'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { useAuth } from '@/components/providers/auth-provider';
import { members, organization } from '@/lib/mock';
import { navGroups } from '@/lib/navigation';

import {
  Check,
  ChevronsUpDown,
  Layers,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function OrganizationSwitcher() {
  const { state } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent"
          tooltip={organization.name}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Layers className="size-4" />
          </span>
          {state === 'expanded' && (
            <>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold text-sidebar-accent-foreground">
                   Nexora
                </span>
                <span className="truncate text-xs">{organization.name}</span>
              </span>
              <ChevronsUpDown className="ml-auto size-4" />
            </>
          )}
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Organizations
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <Check className="size-4" /> {organization.name}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            // toast.info('Demo workspace', {
            //   description:
            //     'Multiple organizations need a backend account system.',
            // })
            alert('Demo workspace')
          }
        >
          <span className="size-4" /> Create organization…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppSidebar() {
  const path = usePathname();
  const { state } = useSidebar();
  const me = members[0];
  const { admin, logoutLoading, logout } = useAuth();
  const isActive = (url: string) =>
    path === url ||
    (url !== '/dashboard' &&
      url.split('/').length <= 2 &&
      path.startsWith(url + '/'));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <OrganizationSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((g) => (
          <SidebarGroup key={g.label} className="py-1">
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url + item.title}>
                    <SidebarMenuButton
                      // asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                      className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
              // asChild
              >
                <SidebarMenuButton size="lg" tooltip={admin?.name ?? me.name}>
                  <ColorAvatar name={admin?.name ?? me.name} color={me.color} />
                  {state === 'expanded' && (
                    <span className="grid flex-1 text-left leading-tight">
                      <span className="truncate text-sm font-medium text-sidebar-accent-foreground">
                        {admin?.name ?? me.name}
                      </span>
                      <span className="truncate text-xs">{admin?.email ?? me.email}</span>
                    </span>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem
                // asChild
                >
                  <Link href="/settings/account">
                    <User className="size-4" /> Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                // asChild
                >
                  <Link href="/settings/preferences">
                    <Settings className="size-4" /> Preferences
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void logout()}
                >
                  <LogOut className="size-4" /> {logoutLoading ? 'Signing out…' : 'Sign out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
