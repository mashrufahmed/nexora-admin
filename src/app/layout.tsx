import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { AdminShell } from '@/components/layouts/admin-shell';
import { QueryProvider } from '@/components/providers/query-provider';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Nexora Admin',
  description: 'The operating system for multi-site publishing.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn('h-full', 'antialiased', 'font-sans', montserrat.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider><Suspense fallback={null}><AuthProvider><AdminShell>{children}</AdminShell></AuthProvider></Suspense></QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
