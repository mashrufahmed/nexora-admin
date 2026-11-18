'use client';

import { authApi, type Admin } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextValue = { admin: Admin | null; loading: boolean; logoutLoading: boolean; refresh: () => Promise<void>; logout: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const refresh = async () => {
    try { setAdmin((await authApi.me()).admin); } catch (error) { if (error instanceof ApiError && error.status === 401) setAdmin(null); } finally { setLoading(false); }
  };

  useEffect(() => {
    void refresh();
    const onExpired = () => { setAdmin(null); if (window.location.pathname.startsWith('/dashboard') || window.location.pathname.startsWith('/analytics')) window.location.href = '/auth/login'; };
    window.addEventListener('nexora:session-expired', onExpired);
    return () => window.removeEventListener('nexora:session-expired', onExpired);
  }, []);
  useEffect(() => { if (!loading && !admin && window.location.pathname.startsWith('/dashboard')) window.location.href = '/auth/login'; }, [admin, loading]);

  const value = useMemo(() => ({ admin, loading, logoutLoading, refresh, logout: async () => { setLogoutLoading(true); try { await authApi.logout().catch(() => undefined); setAdmin(null); window.location.href = '/auth/login'; } finally { setLogoutLoading(false); } } }), [admin, loading, logoutLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; }