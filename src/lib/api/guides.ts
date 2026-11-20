import { apiFetch, apiJson } from './client';

export type EditorialItem = { siteProductId: string; position: number; note?: string };
export type EditorialEntry = { id: string; siteId: string; title: string; slug: string; description?: string | null; status: string; items?: Array<EditorialItem & { siteProduct?: { title?: string; slug?: string } }>; createdAt?: string; updatedAt?: string };
const resource = (comparison: boolean) => comparison ? 'comparisons' : 'buying-guides';
export const guidesApi = {
  list: (siteId: string, comparison = false) => apiFetch<EditorialEntry[]>(`/${resource(comparison)}?siteId=${encodeURIComponent(siteId)}`),
  create: (input: Record<string, unknown>, comparison = false) => apiJson<EditorialEntry>(`/${resource(comparison)}`, 'POST', input),
  update: (id: string, input: Record<string, unknown>, comparison = false) => apiJson<EditorialEntry>(`/${resource(comparison)}/${id}`, 'PATCH', input),
  remove: (id: string, comparison = false) => apiJson<{ message: string }>(`/${resource(comparison)}/${id}`, 'DELETE'),
  transition: (id: string, status: string, comparison = false) => apiJson<EditorialEntry>(`/${resource(comparison)}/${id}/${status}`, 'POST'),
  items: (id: string, items: EditorialItem[], comparison = false) => apiJson<{ count: number }>(`/${resource(comparison)}/${id}/items`, 'POST', { items }),
};