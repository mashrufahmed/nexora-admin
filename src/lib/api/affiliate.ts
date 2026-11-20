import { apiFetch, apiJson } from './client';
export type AffiliateLink = {
  id: string;
  siteId: string;
  merchantId: string;
  destinationUrl: string;
  trackingUrl?: string | null;
  status: string;
  merchant?: { id: string; name: string };
  createdAt?: string;
  [key: string]: unknown;
};
export type Merchant = {
  id: string;
  name: string;
  slug: string;
  website?: string | null;
};
export const affiliateApi = {
  merchants: () => apiFetch<Merchant[]>('/merchants'),
  list: (siteId: string) =>
    apiFetch<AffiliateLink[]>(
      `/affiliate-links?siteId=${encodeURIComponent(siteId)}`,
    ),
  create: (input: Record<string, unknown>) =>
    apiJson<AffiliateLink>('/affiliate-links', 'POST', input),
  update: (id: string, input: Record<string, unknown>) =>
    apiJson<AffiliateLink>(`/affiliate-links/${id}`, 'PATCH', input),
  remove: (id: string) =>
    apiJson<{ message: string }>(`/affiliate-links/${id}`, 'DELETE'),
  createMerchant: (input: Record<string, unknown>) =>
    apiJson<Merchant>('/merchants', 'POST', input),
};
