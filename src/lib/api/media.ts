import { apiFetch, apiJson } from './client';

export type MediaAsset = { id: string; siteId: string | null; originalFilename: string; mimeType: string; size: number; storageKey: string; url?: string | null; alt: string | null; caption: string | null; createdAt: string; updatedAt: string };
export const mediaApi = {
  list: (siteId?: string, search?: string) => apiFetch<MediaAsset[]>(`/media?${new URLSearchParams({ ...(siteId ? { siteId } : {}), ...(search ? { search } : {}) }).toString()}`),
  update: (id: string, input: { alt?: string; caption?: string }) => apiJson<MediaAsset>(`/media/${id}`, 'PATCH', input),
  remove: (id: string) => apiJson<{ message: string }>(`/media/${id}`, 'DELETE'),
  upload: async (file: File, siteId?: string, alt?: string, caption?: string) => { const form = new FormData(); form.append('file', file); if (siteId) form.append('siteId', siteId); if (alt) form.append('alt', alt); if (caption) form.append('caption', caption); return apiFetch<MediaAsset>('/media/multipart', { method: 'POST', body: form, headers: {} }); },
};