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

function normalizeSite(site: Site): Site {
  return {
    ...site,
    domains: Array.isArray(site.domains) ? site.domains : [],
  };
}

function normalizeSites(sites: Site[]): Site[] {
  return sites.map(normalizeSite);
}

export const sitesApi = {
  list: async () => normalizeSites(await apiFetch<Site[]>('/sites')),
  get: async (id: string) => normalizeSite(await apiFetch<Site>(`/sites/${id}`)),
  create: async (input: CreateSiteInput) => normalizeSite(await apiJson<Site>('/sites', 'POST', input)),
  update: (id: string, input: Partial<CreateSiteInput> & { status?: string }) =>
    apiJson<Site>(`/sites/${id}`, 'PATCH', input).then(normalizeSite),
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
