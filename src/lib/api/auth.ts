import { apiFetch, apiJson, clearCsrfToken } from './client';

export type Admin = {
  id: string;
  name: string;
  email: string;
  status: string;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  roles: Array<{ id: string; name: string }>;
  permissions: string[];
  siteAccess: string[];
};
export type LoginResult = { message: string; admin: Admin };

export const authApi = {
  login: async (email: string, password: string) => {
    clearCsrfToken();
    return apiJson<LoginResult>('/admin/auth/login', 'POST', { email, password });
  },
  me: () => apiFetch<{ admin: Admin }>('/admin/auth/me'),
  logout: async () => {
    try {
      return await apiJson<{ message: string }>('/admin/auth/logout', 'POST');
    } finally {
      clearCsrfToken();
    }
  },
  forgotPassword: (email: string) => apiJson<{ message: string }>('/admin/auth/forgot-password', 'POST', { email }),
  resetPassword: (email: string, token: string, password: string) => apiJson<{ message: string }>('/admin/auth/reset-password', 'POST', { email, token, password }),
  verifyEmail: (email: string, otp: string) => apiJson<{ emailVerified: boolean }>('/admin/email/verify', 'POST', { email, otp }),
  resendEmailOtp: (email: string) => apiJson<{ message: string }>('/admin/email/resend', 'POST', { email }),
  changePassword: (currentPassword: string, newPassword: string) => apiJson<{ message: string }>('/admin/auth/change-password', 'POST', { currentPassword, newPassword }),
};
