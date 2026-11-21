'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  EmptyState,
  LoadingSkeleton,
  PageContainer,
  PageHeader,
} from '@/components/ui/ui-bits';
import { affiliateApi } from '@/lib/api/affiliate';
import { ApiError } from '@/lib/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Store, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function MerchantsPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [website, setWebsite] = useState('');
  const client = useQueryClient();
  const merchants = useQuery({
    queryKey: ['merchants'],
    queryFn: affiliateApi.merchants,
  });
  const create = useMutation({
    mutationFn: () =>
      affiliateApi.createMerchant({
        name,
        slug,
        website: website || undefined,
      }),
    onSuccess: () => {
      setName('');
      setSlug('');
      setWebsite('');
      void client.invalidateQueries({ queryKey: ['merchants'] });
    },
  });
  const error = create.error ?? merchants.error;
  return (
    <PageContainer>
      <PageHeader
        title="Affiliate merchants"
        description="Manage partner destinations available to every site's tracked links."
      />
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error instanceof ApiError
            ? error.message
            : 'Unable to load merchants'}
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="space-y-2 p-5">
            {merchants.isLoading ? (
              <LoadingSkeleton rows={5} />
            ) : (merchants.data ?? []).length === 0 ? (
              <EmptyState
                icon={Store}
                title="No merchants yet"
                description="Add a partner before creating affiliate links."
              />
            ) : (
              (merchants.data ?? []).map((merchant) => (
                <div
                  key={merchant.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <Store className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{merchant.name}</p>
                    <p className="text-xs text-muted-foreground">
                      /{merchant.slug}
                      {merchant.website ? ` · ${merchant.website}` : ''}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${merchant.name}`}
                    disabled
                    title="Delete merchants from the affiliate links workspace"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                create.mutate();
              }}
            >
              <h2 className="font-semibold">New merchant</h2>
              <div className="space-y-2">
                <Label htmlFor="merchant-name">Name</Label>
                <Input
                  id="merchant-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slug)
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-|-$/g, ''),
                      );
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="merchant-slug">Slug</Label>
                <Input
                  id="merchant-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="merchant-website">Website</Label>
                <Input
                  id="merchant-website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <Button type="submit" disabled={create.isPending}>
                <Plus /> {create.isPending ? 'Adding…' : 'Add merchant'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
