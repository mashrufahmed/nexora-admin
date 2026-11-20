import { apiFetch, apiJson } from './client';

export type SiteDomain = {
  id: string;
  hostname: string;
  isPrimary: boolean;
  createdAt: string;
};
export type SiteSecret = { id: string; secret: string; createdAt: string };
export type Site = {
  id: string;
  name: string;
  slug: string;
  status: string;
  settings: Record<string, unknown> | null;
  seoSettings: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  domains: SiteDomain[];
};
export type CreateSiteInput = {
  name: string;
  slug: string;
  settings?: Record<string, unknown>;
  seoSettings?: Record<string, unknown>;
};

export const sitesApi = {
  list: () => apiFetch<Site[]>('/sites'),
  get: (id: string) => apiFetch<Site>(`/sites/${id}`),
  create: (input: CreateSiteInput) => apiJson<Site>('/sites', 'POST', input),
  update: (id: string, input: Partial<CreateSiteInput> & { status?: string }) =>
    apiJson<Site>(`/sites/${id}`, 'PATCH', input),
  remove: (id: string) =>
    apiJson<{ message: string }>(`/sites/${id}`, 'DELETE'),
  addDomain: (id: string, hostname: string, isPrimary: boolean) =>
    apiJson<SiteDomain>(`/sites/${id}/domains`, 'POST', {
      hostname,
      isPrimary,
    }),
  createSecret: (id: string) => apiJson<SiteSecret>(`/sites/${id}/secrets`, 'POST'),
  revokeSecret: (id: string, secretId: string) => apiJson<{ message: string }>(`/sites/${id}/secrets/${secretId}`, 'DELETE'),
};
