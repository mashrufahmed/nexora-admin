'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { fmtDate } from '@/lib/format';
import { notifications as seedNotifications, sites } from '@/lib/mock';
import { allNavLeaves } from '@/lib/navigation';
import { useCollection } from '@/lib/store';
import { cn } from '@/lib/utils';

import { Bell, CheckCheck, Command, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

function Breadcrumbs() {
  const path = usePathname();
  const parts = path.split('/').filter(Boolean);
  const crumbs = parts.map((p, i) => {
    const href = '/' + parts.slice(0, i + 1).join('/');
    const leaf = allNavLeaves.find((l) => l.url === href);
    const site = sites.find((s) => s.id === p);
    const label =
      leaf?.title ??
      site?.name ??
      p.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
    return { href, label };
  });
  return (
    <Breadcrumb className="hidden md:block">
      <BreadcrumbList>
        {crumbs.map((c, i) => (
          <Fragment key={c.href}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {i === crumbs.length - 1 ? (
                <BreadcrumbPage className="max-w-50 truncate">
                  {c.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={c.href}>{c.label}</Link>} />
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function NotificationCenter() {
  const { items, setAll, update } = useCollection(
    'notifications',
    seedNotifications,
  );
  const unread = items.filter((n) => !n.read).length;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-lg"
            aria-label={`Notifications, ${unread} unread`}
          >
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {unread}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="end" className="w-90 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7"
            onClick={() => setAll(items.map((n) => ({ ...n, read: true })))}
          >
            <CheckCheck className="size-3.5" /> Mark all read
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => update(n.id, { read: true })}
              className={cn(
                'flex w-full gap-3 border-b px-4 py-3 text-left last:border-0 hover:bg-muted/50',
                !n.read && 'bg-primary/5',
              )}
            >
              <span
                className={cn(
                  'mt-1.5 size-2 shrink-0 rounded-full',
                  n.read ? 'bg-transparent' : 'bg-primary',
                )}
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{n.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {n.body}
                </span>
                <span className="mt-1 block text-[11px] text-muted-foreground">
                  {fmtDate(n.at)}
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className="border-t p-2">
          <Button
            render={<Link href="/settings/account" />}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Account settings
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/92 px-3 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-5">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mx-1 h-full" />
      <Breadcrumbs />
      <div className="ml-auto hidden max-w-sm flex-1 items-center justify-center px-4 lg:flex">
        <button className="flex h-8 w-full items-center gap-2 rounded-lg border bg-muted/40 px-3 text-left text-xs text-muted-foreground transition-colors hover:bg-muted">
          <Search className="size-3.5" />
          <span className="flex-1">Search anything...</span>
          <span className="inline-flex items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 text-[10px]">
            <Command className="size-2.5" /> K
          </span>
        </button>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <NotificationCenter />
      </div>
    </header>
  );
}
