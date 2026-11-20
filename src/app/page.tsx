'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function page() {
  const router = useRouter();
  const { admin, loading } = useAuth();

  useEffect(() => {
    if (!loading) router.replace(admin ? '/dashboard/home' : '/auth/login');
  }, [admin, loading, router]);

  return <main className="min-h-svh bg-background" aria-busy="true" />;
}
