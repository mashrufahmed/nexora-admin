import { apiFetch, apiJson } from './client';
export type Redirect = { id: string; fromPath: string; toPath: string; statusCode: number; status: string };
export type Tag = { id: string; name: string; slug: string };
export type Subscriber = { id: string; email: string; status: string; source?: string | null; createdAt: string };
export const p1Api = {
  redirects: (siteId: string) => apiFetch<Redirect[]>(`/redirects?siteId=${encodeURIComponent(siteId)}`),
  createRedirect: (input: Record<string, unknown>) => apiJson<Redirect>('/redirects', 'POST', input),
  deleteRedirect: (id: string) => apiJson<{ message: string }>(`/redirects/${id}`, 'DELETE'),
  tags: (siteId: string) => apiFetch<Tag[]>(`/tags?siteId=${encodeURIComponent(siteId)}`),
  createTag: (input: Record<string, unknown>) => apiJson<Tag>('/tags', 'POST', input),
  deleteTag: (id: string) => apiJson<{ message: string }>(`/tags/${id}`, 'DELETE'),
  subscribers: (siteId: string) => apiFetch<Subscriber[]>(`/newsletter?siteId=${encodeURIComponent(siteId)}`),
};