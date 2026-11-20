import { apiFetch, apiJson } from './client';

export type Admin = {
  id: string;
  name: string;
  email: string;
  status: string;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
};
export type LoginResult = { message: string; admin: Admin };

export const authApi = {
  login: (email: string, password: string) =>
    apiJson<LoginResult>('/admin/auth/login', 'POST', { email, password }),
  me: () => apiFetch<{ admin: Admin }>('/admin/auth/me'),
  logout: () => apiJson<{ message: string }>('/admin/auth/logout', 'POST'),
};
