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
import {
  EmptyState,
  LoadingSkeleton,
  PageContainer,
  PageHeader,
} from '@/components/ui/ui-bits';
import { ApiError } from '@/lib/api/client';
import { productsApi, type Brand } from '@/lib/api/products';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, RefreshCw, Search, Tag, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function BrandsPage() {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Brand | null>(null);
  const [error, setError] = useState('');
  const client = useQueryClient();
  const brands = useQuery({
    queryKey: ['brands'],
    queryFn: productsApi.brands,
  });
  const remove = useMutation({
    mutationFn: productsApi.removeBrand,
    onSuccess: () => void client.invalidateQueries({ queryKey: ['brands'] }),
    onError: (e) =>
      setError(e instanceof ApiError ? e.message : 'Unable to delete brand'),
  });
  const items = useMemo(
    () =>
      (brands.data ?? []).filter((b) =>
        `${b.name} ${b.slug}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [brands.data, query],
  );
  return (
    <PageContainer>
      <PageHeader
        title="Brands"
        description="Maintain the names and handles used across your product catalog."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void brands.refetch()}
            >
              <RefreshCw /> Refresh
            </Button>
            <Button onClick={() => setEditing({ id: '', name: '', slug: '' })}>
              <Plus /> New brand
            </Button>
          </>
        }
      />
      {(error || brands.error) && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error ||
            (brands.error instanceof ApiError
              ? brands.error.message
              : 'Unable to load brands')}
        </div>
      )}
      <div className="mb-5 flex max-w-md items-center gap-2 rounded-lg border bg-card px-3">
        <Search className="size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brands…"
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>
      {brands.isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No brands found"
          description="Create a brand to keep products consistently attributed."
          action={
            <Button onClick={() => setEditing({ id: '', name: '', slug: '' })}>
              <Plus /> Add brand
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((brand) => (
            <Card key={brand.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                    <Tag className="size-5" />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {brand._count?.products ?? 0} products
                  </span>
                </div>
                <h2 className="mt-4 font-semibold">{brand.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  /{brand.slug}
                </p>
                <p className="mt-3 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                  {brand.description || 'No description yet.'}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditing(brand)}
                  >
                    <Pencil /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Delete ${brand.name}`}
                    onClick={() => {
                      if (window.confirm(`Delete ${brand.name}?`))
                        remove.mutate(brand.id);
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <BrandDialog
        brand={editing}
        onClose={() => setEditing(null)}
        onError={setError}
      />
    </PageContainer>
  );
}

function BrandDialog({
  brand,
  onClose,
  onError,
}: {
  brand: Brand | null;
  onClose: () => void;
  onError: (message: string) => void;
}) {
  const client = useQueryClient();
  const save = useMutation({
    mutationFn: (input: {
      name: string;
      slug: string;
      description?: string;
    }) =>
      brand?.id
        ? productsApi.updateBrand(brand.id, input)
        : productsApi.createBrand(input),
    onSuccess: () => {
      onClose();
      void client.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: (e) =>
      onError(e instanceof ApiError ? e.message : 'Unable to save brand'),
  });
  if (!brand) return null;
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{brand.id ? 'Edit brand' : 'Create brand'}</DialogTitle>
          <DialogDescription>
            Use a stable name and URL-friendly slug for catalog records.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            save.mutate({
              name: String(f.get('name')),
              slug: String(f.get('slug')),
              description: String(f.get('description') || ''),
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="brand-name">Name</Label>
            <Input
              id="brand-name"
              name="name"
              defaultValue={brand.name}
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand-slug">Slug</Label>
            <Input
              id="brand-slug"
              name="slug"
              defaultValue={brand.slug}
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand-description">Description</Label>
            <Input
              id="brand-description"
              name="description"
              defaultValue={brand.description ?? ''}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? 'Saving…' : 'Save brand'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
