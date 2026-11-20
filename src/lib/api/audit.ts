import { apiFetch } from './client';
import type { PageMeta } from './admin';
export type AuditLog = { id: string; action: string; entityType: string; entityId?: string | null; metadata?: unknown; ipAddress?: string | null; createdAt: string; actor?: { name: string; email: string } | null };
export const auditApi = { list: (params: { page?: number; limit?: number; action?: string; entityType?: string } = {}) => { const q = new URLSearchParams(); for (const [k, v] of Object.entries(params)) if (v) q.set(k, String(v)); return apiFetch<{ data: AuditLog[]; meta: PageMeta }>(`/audit?${q}`); } };