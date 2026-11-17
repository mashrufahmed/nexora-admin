'use client';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Tiny demo-state store: a collection seeded from mock data, persisted to localStorage
 * after hydration. Swap for real API services (TanStack Query) later.
 */
type Listener = () => void;
const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<Listener>>();
const PREFIX = 'publisher-demo:';

function emit(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

export function useCollection<T extends { id: string }>(
  key: string,
  seed: T[],
) {
  if (!cache.has(key)) cache.set(key, seed);
  const subscribe = useCallback(
    (l: Listener) => {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key)!.add(l);
      return () => listeners.get(key)!.delete(l);
    },
    [key],
  );
  const items = useSyncExternalStore(
    subscribe,
    () => cache.get(key) as T[],
    () => seed,
  );

  // Load persisted state once, after hydration.
  useEffect(() => {
    const flag = `${key}__loaded`;
    if (cache.has(flag)) return;
    cache.set(flag, true);
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw) {
        cache.set(key, JSON.parse(raw));
        emit(key);
      }
    } catch {
      /* ignore corrupt demo state */
    }
  }, [key]);

  const set = useCallback(
    (next: T[]) => {
      cache.set(key, next);
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(next));
      } catch {
        /* storage full — keep in memory */
      }
      emit(key);
    },
    [key],
  );

  const current = () => cache.get(key) as T[];
  return {
    items,
    add: (item: T) => set([item, ...current()]),
    update: (id: string, patch: Partial<T>) =>
      set(current().map((i) => (i.id === id ? { ...i, ...patch } : i))),
    remove: (id: string) => set(current().filter((i) => i.id !== id)),
    removeMany: (ids: string[]) =>
      set(current().filter((i) => !ids.includes(i.id))),
    setAll: set,
  };
}

export const newId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

/** Simulated network latency for loading states. */
export function useFakeLoading(ms = 350) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}

export function resetDemoData() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
  location.reload();
}
