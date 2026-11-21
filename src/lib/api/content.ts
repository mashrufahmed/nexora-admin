import { apiFetch, apiJson } from './client';

export type ContentStatus =
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'ARCHIVED';
export type ContentType = 'ARTICLE' | 'PAGE';
export type Content = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string | null;
  body: Record<string, unknown> | null;
  status: ContentStatus;
  featuredMediaId?: string | null;
  createdAt: string;
  updatedAt: string;
  siteContents?: Array<{
    id: string;
    siteId: string;
    slug: string;
    status: string;
    publishedAt?: string | null;
    scheduledAt?: string | null;
    categories?: Array<{ categoryId: string }>;
  }>;
  authors?: Array<{ authorId: string; position: number }>;
};
export type ContentInput = {
  type: ContentType;
  title: string;
  slug: string;
  excerpt?: string;
  body?: Record<string, unknown>;
};

export type ContentRevision = {
  id: string;
  revisionNumber: number;
  title: string;
  excerpt?: string | null;
  body: Record<string, unknown> | null;
  createdAt: string;
  createdBy?: { id: string; name?: string; email?: string } | null;
};

export const contentApi = {
  list: () => apiFetch<Content[]>('/content'),
  get: (id: string) => apiFetch<Content>(`/content/${id}`),
  create: (input: ContentInput) => apiJson<Content>('/content', 'POST', input),
  update: (id: string, input: Partial<ContentInput>) =>
    apiJson<Content>(`/content/${id}`, 'PATCH', input),
  remove: (id: string) =>
    apiJson<{ message: string }>(`/content/${id}`, 'DELETE'),
  submit: (id: string) => apiJson<Content>(`/content/${id}/submit`, 'POST'),
  archive: (id: string) => apiJson<Content>(`/content/${id}/archive`, 'POST'),
  publish: (
    id: string,
    siteId: string,
    categoryIds: string[] = [],
    slug?: string,
  ) =>
    apiJson<Content>(`/content/${id}/publish`, 'POST', {
      siteId,
      categoryIds,
      slug,
    }),
  schedule: (id: string, siteId: string, scheduledAt: string) =>
    apiJson<Content>(`/content/${id}/schedule`, 'POST', { siteId, scheduledAt }),
  revisions: (id: string) => apiFetch<ContentRevision[]>(`/content/${id}/revisions`),
  previewRevision: (id: string, revisionId: string) =>
    apiFetch<{ contentId: string; revision: ContentRevision }>(
      `/content/${id}/revisions/${revisionId}/preview`,
    ),
  restoreRevision: (id: string, revisionId: string) =>
    apiJson<Content>(`/content/${id}/revisions/${revisionId}/restore`, 'POST'),
};

export type Category = {
  id: string;
  siteId: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: Category[];
};

export const categoriesApi = {
  list: (siteId: string) => apiFetch<Category[]>(`/sites/${siteId}/categories`),
  create: (siteId: string, input: { name: string; slug: string; parentId?: string }) =>
    apiJson<Category>(`/sites/${siteId}/categories`, 'POST', input),
};
