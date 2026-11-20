import { apiFetch, apiJson } from './client';
import type { PageMeta } from './admin';

export type Permission = { id: string; name: string; code: string; module: string; description?: string | null };
export type Role = { id: string; name: string; description?: string | null; isSystem: boolean; permissions?: Array<{ permission: Permission }>; _count?: { admins: number; permissions: number } };
const pageQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams(); for (const [key, value] of Object.entries(params)) if (value) query.set(key, String(value)); return query;
};
export const rbacApi = {
  roles: (params: { page?: number; limit?: number; search?: string } = {}) => apiFetch<{ data: Role[]; meta: PageMeta }>(`/rbac/roles?${pageQuery(params)}`),
  role: (id: string) => apiFetch<Role>(`/rbac/roles/${id}`),
  createRole: (data: { name: string; description?: string }) => apiJson<Role>('/rbac/roles', 'POST', data),
  updateRole: (id: string, data: { name?: string; description?: string }) => apiJson<Role>(`/rbac/roles/${id}`, 'PATCH', data),
  deleteRole: (id: string) => apiJson<{ message: string }>(`/rbac/roles/${id}`, 'DELETE'),
  permissions: (params: { page?: number; limit?: number; search?: string; module?: string } = {}) => apiFetch<{ data: Permission[]; meta: PageMeta }>(`/rbac/permissions?${pageQuery(params)}`),
  assignPermissions: (roleId: string, permissionIds: string[]) => apiJson<Role>(`/rbac/roles/${roleId}/permissions`, 'POST', { permissionIds }),
  removePermission: (roleId: string, permissionId: string) => apiJson<{ message: string }>(`/rbac/roles/${roleId}/permissions/${permissionId}`, 'DELETE'),
  assignRoles: (adminId: string, roleIds: string[]) => apiJson(`/rbac/admins/${adminId}/roles`, 'POST', { roleIds }),
  removeRole: (adminId: string, roleId: string) => apiJson<{ message: string }>(`/rbac/admins/${adminId}/roles/${roleId}`, 'DELETE'),
};