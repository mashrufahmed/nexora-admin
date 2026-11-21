'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  EmptyState,
  LoadingSkeleton,
  PageContainer,
  PageHeader,
  StatusBadge,
} from '@/components/ui/ui-bits';
import { ApiError } from '@/lib/api/client';
import { guidesApi, type EditorialEntry } from '@/lib/api/guides';
import { productsApi } from '@/lib/api/products';
import { sitesApi } from '@/lib/api/sites';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function GuidesPage() {
  return <EditorialPage comparison={false} />;
}

export function EditorialPage({ comparison }: { comparison: boolean }) {
  const [siteId, setSiteId] = useState('');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<EditorialEntry | null>(null);
  const client = useQueryClient();
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const entries = useQuery({
    queryKey: [comparison ? 'comparisons' : 'guides', siteId],
    queryFn: () => guidesApi.list(siteId, comparison),
    enabled: Boolean(siteId),
  });
  const remove = useMutation({
    mutationFn: (id: string) => guidesApi.remove(id, comparison),
    onSuccess: () =>
      void client.invalidateQueries({
        queryKey: [comparison ? 'comparisons' : 'guides', siteId],
      }),
  });
  const items = useMemo(
    () =>
      (entries.data ?? []).filter((entry) =>
        `${entry.title} ${entry.slug}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [entries.data, query],
  );
  const error =
    entries.error instanceof ApiError
      ? entries.error.message
      : remove.error instanceof ApiError
        ? remove.error.message
        : '';
  return (
    <PageContainer>
      <PageHeader
        title={comparison ? 'Comparisons' : 'Buying guides'}
        description={
          comparison
            ? 'Build side-by-side product recommendations with validated catalog items.'
            : 'Create practical buying advice from active products on each site.'
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void entries.refetch()}
              disabled={!siteId}
            >
              <RefreshCw /> Refresh
            </Button>
            <Button
              onClick={() =>
                setEditing({
                  id: '',
                  siteId,
                  title: '',
                  slug: '',
                  status: 'DRAFT',
                })
              }
              disabled={!siteId}
            >
              <Plus /> New {comparison ? 'comparison' : 'guide'}
            </Button>
          </>
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
      <div className="mb-5 grid gap-3 sm:grid-cols-[240px_1fr]">
        <Select value={siteId || 'none'} onValueChange={(value) => setSiteId(!value || value === 'none' ? '' : value)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Choose a site" /></SelectTrigger><SelectContent><SelectItem value="none">Choose a site</SelectItem>
          {(sites.data ?? []).map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 rounded-lg border bg-card px-3">
          <Search className="size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${comparison ? 'comparisons' : 'guides'}…`}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
      </div>
      {!siteId ? (
        <EmptyState
          icon={BookOpen}
          title="Choose a site to begin"
          description="Editorial entries are isolated per site."
        />
      ) : entries.isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={`No ${comparison ? 'comparisons' : 'guides'} yet`}
          description="Create an editorial entry for this site."
          action={
            <Button
              onClick={() =>
                setEditing({
                  id: '',
                  siteId,
                  title: '',
                  slug: '',
                  status: 'DRAFT',
                })
              }
            >
              <Plus /> Create
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              comparison={comparison}
              onEdit={() => setEditing(entry)}
              onDelete={() => {
                if (
                  window.confirm(
                    `Delete this ${comparison ? 'comparison' : 'guide'}?`,
                  )
                )
                  remove.mutate(entry.id);
              }}
            />
          ))}
        </div>
      )}
      <EditorialDialog
        entry={editing}
        comparison={comparison}
        onClose={() => setEditing(null)}
      />
    </PageContainer>
  );
}

function EntryCard({
  entry,
  comparison,
  onEdit,
  onDelete,
}: {
  entry: EditorialEntry;
  comparison: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const client = useQueryClient();
  const transition = useMutation({
    mutationFn: (status: string) =>
      guidesApi.transition(entry.id, status, comparison),
    onSuccess: () =>
      void client.invalidateQueries({
        queryKey: [comparison ? 'comparisons' : 'guides', entry.siteId],
      }),
  });
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
            <BookOpen className="size-5" />
          </span>
          <StatusBadge status={entry.status.toLowerCase()} />
        </div>
        <h2 className="mt-4 truncate font-semibold">{entry.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          /{entry.slug} · {entry.items?.length ?? 0} products
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}>
            Edit
          </Button>
          {entry.status === 'DRAFT' && (
            <Button size="sm" onClick={() => transition.mutate('IN_REVIEW')}>
              Submit
            </Button>
          )}
          {entry.status === 'IN_REVIEW' && (
            <Button size="sm" onClick={() => transition.mutate('PUBLISHED')}>
              Publish
            </Button>
          )}
          {entry.status === 'PUBLISHED' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => transition.mutate('ARCHIVED')}
            >
              Archive
            </Button>
          )}
          {entry.status !== 'PUBLISHED' && (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={onDelete}
              aria-label="Delete"
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EditorialDialog({
  entry,
  comparison,
  onClose,
}: {
  entry: EditorialEntry | null;
  comparison: boolean;
  onClose: () => void;
}) {
  const client = useQueryClient();
  const products = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.list,
    enabled: Boolean(entry),
  });
  const mutation = useMutation({
    mutationFn: async ({
      input,
      items,
    }: {
      input: Record<string, unknown>;
      items: Array<{ siteProductId: string; position: number }>;
    }) => {
      const saved = entry?.id
        ? await guidesApi.update(entry.id, input, comparison)
        : await guidesApi.create(input, comparison);
      if (items.length) await guidesApi.items(saved.id, items, comparison);
      return saved;
    },
    onSuccess: () => {
      onClose();
      void client.invalidateQueries({
        queryKey: [comparison ? 'comparisons' : 'guides', entry?.siteId],
      });
    },
  });
  if (!entry) return null;
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entry.id ? 'Edit' : 'Create'}{' '}
            {comparison ? 'comparison' : 'buying guide'}
          </DialogTitle>
          <DialogDescription>
            Only active products from the selected site can be attached.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const ids = Array.from(form.getAll('productId')).map(String);
            mutation.mutate({
              input: {
                siteId: entry.siteId,
                title: String(form.get('title')),
                slug: String(form.get('slug')),
                description: String(form.get('description') || ''),
              },
              items: ids.map((siteProductId, position) => ({
                siteProductId,
                position,
              })),
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={entry.title}
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={entry.slug}
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              defaultValue={entry.description ?? ''}
            />
          </div>
          <div className="space-y-2">
            <Label>Products</Label>
            <div className="max-h-40 space-y-2 overflow-auto rounded-lg border bg-background p-3">
              {(products.data ?? []).flatMap((product) =>
                (
                  (product.siteProducts as
                    | Array<{ id: string; status?: string }>
                    | undefined) ?? []
                )
                  .filter(
                    (siteProduct) =>
                      siteProduct.status === 'ACTIVE' || !siteProduct.status,
                  )
                  .map((siteProduct) => (
                    <label key={siteProduct.id} className="flex items-center gap-2 text-sm"><Checkbox name="productId" value={siteProduct.id} />{product.name}</label>
                  )),
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Select one or more products to include.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
