'use client';

import { AppHeader } from '@/components/layouts/app-header';
import { AppSidebar } from '@/components/layouts/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const PUBLIC_PATHS = new Set([
  '/auth/login',
  '/auth/forgot-password',
  '/auth/verify-otp',
  '/auth/reset-password',
]);

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (PUBLIC_PATHS.has(pathname)) return <>{children}</>;

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-muted/20">
        <AppSidebar />
        <SidebarInset className="min-w-0 bg-background">
          <AppHeader />
          <main className="min-h-[calc(100svh-3.5rem)] flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}