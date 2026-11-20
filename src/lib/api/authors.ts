import { apiFetch, apiJson } from './client';

export type Author = {
  id: string;
  siteId: string | null;
  name: string;
  slug: string;
  bio: string | null;
  shortBio: string | null;
  designation: string | null;
  website: string | null;
  email: string | null;
  status: string;
};

export const authorsApi = {
  list: (siteId?: string) => apiFetch<Author[]>(`/authors${siteId ? `?siteId=${encodeURIComponent(siteId)}` : ''}`),
  create: (input: { siteId?: string; name: string; slug: string; bio?: string; shortBio?: string; designation?: string; website?: string; email?: string }) => apiJson<Author>('/authors', 'POST', input),
  update: (id: string, input: Partial<Author>) => apiJson<Author>(`/authors/${id}`, 'PATCH', input),
  remove: (id: string) => apiJson<{ message: string }>(`/authors/${id}`, 'DELETE'),
};