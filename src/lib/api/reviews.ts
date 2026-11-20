import { apiFetch, apiJson } from './client';
export type Review = {
  id: string;
  title?: string;
  status: string;
  overallScore?: number | null;
  verdict?: string | null;
  siteProductId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};
export const reviewsApi = {
  criteria: (siteId: string) => apiFetch<Array<{ id: string; name: string; description?: string | null; weight: number; position: number }>>(`/sites/${siteId}/review-criteria`),
  createCriterion: (siteId: string, input: { name: string; description?: string; weight: number; position?: number }) => apiJson<Record<string, unknown>>(`/sites/${siteId}/review-criteria`, 'POST', input),
  updateCriterion: (id: string, input: { name: string; description?: string; weight: number; position?: number }) => apiJson<Record<string, unknown>>(`/review-criteria/${id}`, 'PATCH', input),
  deleteCriterion: (id: string) => apiJson<{ message: string }>(`/review-criteria/${id}`, 'DELETE'),
  list: () => apiFetch<Review[]>('/reviews'),
  get: (id: string) => apiFetch<Review>(`/reviews/${id}`),
  create: (input: Record<string, unknown>) =>
    apiJson<Review>('/reviews', 'POST', input),
  update: (id: string, input: Record<string, unknown>) =>
    apiJson<Review>(`/reviews/${id}`, 'PATCH', input),
  submit: (id: string) => apiJson<Review>(`/reviews/${id}/submit`, 'POST'),
  publish: (id: string) => apiJson<Review>(`/reviews/${id}/publish`, 'POST'),
  archive: (id: string) => apiJson<Review>(`/reviews/${id}/archive`, 'POST'),
};
