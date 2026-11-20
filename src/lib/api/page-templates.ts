import { apiFetch, apiJson } from './client';

export type PuckData = { content: Array<Record<string, unknown>>; root: Record<string, unknown> };
export type PageRevision = { id: string; revisionNumber: number; config: PuckData; createdAt: string; publishedAt: string | null };
export type PageTemplate = { id: string; siteId: string; name: string; type: string; status: string; currentRevisionId: string | null; revisions: PageRevision[] };

export const pageTemplatesApi = {
  list: (siteId: string) => apiFetch<PageTemplate[]>(`/page-templates/site/${siteId}`),
  create: (input: { siteId: string; name: string; type: string; config: PuckData }) => apiJson<PageTemplate>('/page-templates', 'POST', input),
  update: (id: string, input: { config: PuckData; name?: string; type?: string }) => apiJson<PageRevision>(`/page-templates/${id}`, 'PATCH', input),
  publish: (id: string, revisionId: string) => apiJson<PageTemplate>(`/page-templates/${id}/revisions/${revisionId}/publish`, 'POST'),
  versions: (id: string) => apiFetch<PageRevision[]>(`/page-templates/${id}/versions`),
  restore: (id: string, revisionId: string) => apiJson<PageRevision>(`/page-templates/${id}/revisions/${revisionId}/restore`, 'POST'),
  preview: (id: string, revisionId: string) => apiFetch<{ templateId: string; revision: PageRevision }>(`/page-templates/${id}/revisions/${revisionId}/preview`),
};