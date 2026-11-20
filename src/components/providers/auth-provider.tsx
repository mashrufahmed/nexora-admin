'use client';

import { authApi, type Admin } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type AuthContextValue = { admin: Admin | null; loading: boolean; logoutLoading: boolean; refresh: () => Promise<void>; logout: () => Promise<void>; can: (permission: string) => boolean };
const AuthContext = createContext<AuthContextValue | null>(null);
const PUBLIC_PATHS = ['/auth/login', '/auth/forgot-password', '/auth/verify-otp', '/auth/reset-password'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const refresh = async () => {
    try { setAdmin((await authApi.me()).admin); } catch (error) { if (error instanceof ApiError && error.status === 401) setAdmin(null); } finally { setLoading(false); }
  };

  useEffect(() => {
    // Initial session loading synchronizes this provider with the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    const onExpired = () => { setAdmin(null); if (!PUBLIC_PATHS.includes(window.location.pathname)) router.replace('/auth/login'); };
    window.addEventListener('nexora:session-expired', onExpired);
    return () => window.removeEventListener('nexora:session-expired', onExpired);
  }, [router]);
  useEffect(() => {
    if (!loading && !admin && !PUBLIC_PATHS.includes(pathname)) router.replace('/auth/login');
  }, [admin, loading, pathname, router]);

  const value = useMemo(() => ({
    admin,
    loading,
    logoutLoading,
    refresh,
    can: (permission: string) => Boolean(admin?.permissions.includes(permission)),
    logout: async () => {
      setLogoutLoading(true);
      try { await authApi.logout().catch(() => undefined); setAdmin(null); router.replace('/auth/login'); }
      finally { setLogoutLoading(false); }
    },
  }), [admin, loading, logoutLoading, router]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; }