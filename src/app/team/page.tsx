'use client';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  EmptyState,
  LoadingSkeleton,
  PageContainer,
  PageHeader,
  StatusBadge,
} from '@/components/ui/ui-bits';
import { adminManagementApi, type AdminRecord } from '@/lib/api/admin';
import { ApiError } from '@/lib/api/client';
import { RefreshCw, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TeamPage() {
  const { can, admin: current } = useAuth();
  const [items, setItems] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  async function load() {
    setLoading(true);
    setError('');
    try {
      setItems((await adminManagementApi.list({ limit: 100, search })).data);
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : 'Unable to load team members',
      );
    } finally {
      setLoading(false);
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 250);
    return () => window.clearTimeout(timer);
  }, [search]);
  async function toggle(item: AdminRecord) {
    setError('');
    try {
      const updated = await adminManagementApi.updateStatus(
        item.id,
        item.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
      );
      setItems((all) =>
        all.map((x) => (x.id === item.id ? { ...x, ...updated } : x)),
      );
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Unable to update member');
    }
  }
  return (
    <PageContainer>
      <PageHeader
        title="Team members"
        description="Manage administrators and their access to Nexora."
        actions={
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw /> Refresh
          </Button>
        }
      />
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}
      <div className="mb-5 flex max-w-md items-center gap-2 rounded-lg border bg-card px-3">
        <Search className="size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>
      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members found"
          description="Verified administrators will appear here."
        />
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {item.name}{' '}
                    {item.id === current?.id && (
                      <span className="text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.email}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.roles.map((role) => (
                      <span
                        key={role.id}
                        className="rounded-full border px-2 py-0.5 text-xs"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </div>
                <StatusBadge status={item.status.toLowerCase()} />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    !can('rbac.admins.update') || item.id === current?.id
                  }
                  onClick={() => void toggle(item)}
                >
                  {item.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
