'use client';

import { useAuth } from '@/components/providers/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { ColorAvatar } from '@/components/ui/ui-bits';
import { members } from '@/lib/mock';
import { navGroups } from '@/lib/navigation';
import { ChevronsUpDown, Layers, LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AVAILABLE_ROUTES = new Set([
  '/dashboard/home',
  '/sites',
  '/page-builder',
  '/content',
  '/products',
  '/brands',
  '/categories',
  '/reviews',
  '/review-criteria',
  '/guides',
  '/comparisons',
  '/affiliate',
  '/affiliate/merchants',
  '/media',
  '/authors',
  '/seo/redirects',
  '/tags',
  '/analytics',
  '/analytics/content',
  '/analytics/products',
  '/analytics/affiliate',
  '/team',
  '/team/roles',
  '/audit-logs',
  '/email',
  '/settings/account',
  '/settings/security',
]);

const resolveRoute = (url: string) =>
  url === '/dashboard' ? '/dashboard/home' : url;

export function AppSidebar() {
  const path = usePathname();
  const me = members[0];
  const { state } = useSidebar();
  const { admin, logoutLoading, logout, can } = useAuth();
  const expanded = state === 'expanded';

  const isActive = (url: string) =>
    path === url || (url !== '/dashboard/home' && path.startsWith(`${url}/`));

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border/70">
      <SidebarHeader className="gap-3 p-3">
        <Link
          href="/dashboard/home"
          className="flex h-9 items-center gap-2.5 px-1 outline-none ring-sidebar-ring focus-visible:ring-2"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
            <Layers className="size-4" />
          </span>
          {expanded && (
            <span className="text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">
              Nexora
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-2">
        {navGroups.map((group) => {
          const items = group.items.filter(
            (item) =>
              AVAILABLE_ROUTES.has(resolveRoute(item.url)) &&
              (!item.permission || can(item.permission)),
          );
          if (!items.length) return null;
          return (
            <SidebarGroup key={group.label} className="p-0 pt-4 first:pt-1">
              <SidebarGroupLabel className="h-7 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {items.map((item) => (
                    <SidebarMenuItem key={`${item.url}-${item.title}`}>
                      <SidebarMenuButton
                        render={
                          <Link href={resolveRoute(item.url)}>
                            <item.icon className="size-4.25" />
                            <span>{item.title}</span>
                          </Link>
                        }
                        isActive={isActive(resolveRoute(item.url))}
                        tooltip={item.title}
                        className="relative h-9 rounded-lg px-2.5 text-[13px] font-medium text-sidebar-foreground/72 transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:h-5 data-[active=true]:before:w-0.5 data-[active=true]:before:rounded-full data-[active=true]:before:bg-sidebar-primary [&>svg]:text-sidebar-foreground/60 data-[active=true]:[&>svg]:text-sidebar-primary"
                      />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={admin?.name ?? me.name}
                    className="h-14 rounded-lg px-2 hover:bg-sidebar-accent"
                  >
                    <ColorAvatar
                      name={admin?.name ?? me.name}
                      color={me.color}
                    />
                    {expanded && (
                      <span className="min-w-0 flex-1 text-left leading-tight">
                        <span className="block truncate text-sm font-semibold text-sidebar-accent-foreground">
                          {admin?.name ?? me.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-sidebar-foreground/55">
                          {admin?.email ?? me.email}
                        </span>
                      </span>
                    )}
                    {expanded && (
                      <ChevronsUpDown className="ml-auto size-4 shrink-0 text-sidebar-foreground/45" />
                    )}
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-60"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 text-xs text-muted-foreground">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuItem render={<Link href="/settings/account" />}>
                    <User className="size-4" /> Account settings
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/settings/account" />}>
                    <Settings className="size-4" /> Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void logout()}>
                    <LogOut className="size-4" />
                    {logoutLoading ? 'Signing out…' : 'Sign out'}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
