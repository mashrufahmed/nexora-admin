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
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="gap-4 border-b border-sidebar-border/70 px-4 py-4 group-data-[collapsible=icon]:px-3">
        <Link
          href="/dashboard/home"
          className="flex h-9 items-center gap-3 rounded-md px-1 outline-none ring-sidebar-ring transition-colors focus-visible:ring-2"
        >
          <span className="relative flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_0_0_1px_rgb(249_115_22_/_0.35)]">
            <Layers className="size-4.5" />
          </span>
          {expanded && (
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold tracking-tight text-sidebar-accent-foreground">
                Nexora
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-sidebar-foreground/45">
                Admin workspace
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-3 group-data-[collapsible=icon]:px-2">
        {navGroups.map((group) => {
          const items = group.items.filter(
            (item) =>
              AVAILABLE_ROUTES.has(resolveRoute(item.url)) &&
              (!item.permission || can(item.permission)),
          );
          if (!items.length) return null;
          return (
            <SidebarGroup key={group.label} className="p-0 pt-5 first:pt-1">
              <SidebarGroupLabel className="h-7 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
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
                        className="relative h-9 rounded-md px-2.5 text-[13px] font-medium text-sidebar-foreground/72 transition-colors hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-[inset_2px_0_0_var(--sidebar-primary)] [&>svg]:text-sidebar-foreground/60 data-[active=true]:[&>svg]:text-sidebar-primary group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                      />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={admin?.name ?? me.name}
                    className="h-14 rounded-md px-2 hover:bg-sidebar-accent/80 focus-visible:ring-2"
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
