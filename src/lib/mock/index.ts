export * from "./types";
export * from "./core";
export * from "./catalog";
export * from "./content";
export * from "./reviews";
export * from "./editorial";
export * from "./affiliate";
export * from "./platform";

import { members, sites } from "./core";
import { brands, productCategories, products } from "./catalog";
import { merchants, networks } from "./affiliate";

export const memberById = (id: string | null | undefined) => members.find((m) => m.id === id);
export const siteById = (id: string | null | undefined) => sites.find((s) => s.id === id);
export const brandById = (id: string | null | undefined) => brands.find((b) => b.id === id);
export const categoryById = (id: string | null | undefined) => productCategories.find((c) => c.id === id);
export const productById = (id: string | null | undefined) => products.find((p) => p.id === id);
export const merchantById = (id: string | null | undefined) => merchants.find((m) => m.id === id);
export const networkById = (id: string | null | undefined) => networks.find((n) => n.id === id);

/** Weighted score: sum(score/max * weight) / sum(weight) * 10, rounded to 1 decimal. */
export function weightedScore(criteria: { weight: number; score: number; max: number }[]): number {
  const total = criteria.reduce((a, c) => a + c.weight, 0);
  if (total === 0) return 0;
  const sum = criteria.reduce((a, c) => a + (c.max > 0 ? (c.score / c.max) * c.weight : 0), 0);
  return Math.round((sum / total) * 100) / 10;
}
