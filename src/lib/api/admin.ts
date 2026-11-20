import { apiFetch, apiJson } from './client';

export type AdminRecord = {
  id: string; name: string; email: string; status: string;
  emailVerifiedAt?: string | null; lastLoginAt?: string | null;
  createdAt: string; roles: Array<{ id: string; name: string; isSystem?: boolean }>;
};
export type PageMeta = { page: number; limit: number; total: number; totalPages: number };

export const adminManagementApi = {
  list: (params: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value) query.set(key, String(value));
    return apiFetch<{ data: AdminRecord[]; meta: PageMeta }>(`/admin/management?${query}`);
  },
  updateProfile: (id: string, name: string) => apiJson<AdminRecord>(`/admin/management/${id}/profile`, 'PATCH', { name }),
  updateStatus: (id: string, status: string) => apiJson<AdminRecord>(`/admin/management/${id}/status`, 'PATCH', { status }),
  activate: (id: string, roleIds: string[]) => apiJson<AdminRecord>(`/admin/management/${id}/activate`, 'POST', { roleIds }),
};