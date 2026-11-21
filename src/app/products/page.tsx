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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  EmptyState,
  LoadingSkeleton,
  PageContainer,
  PageHeader,
  StatusBadge,
} from '@/components/ui/ui-bits';
import { ApiError } from '@/lib/api/client';
import { productsApi, type Brand, type Product } from '@/lib/api/products';
import { mediaApi } from '@/lib/api/media';
import { sitesApi } from '@/lib/api/sites';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, Pencil, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const client = useQueryClient();
  const result = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.list,
  });
  const brands = useQuery({
    queryKey: ['brands'],
    queryFn: productsApi.brands,
  });
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const remove = useMutation({
    mutationFn: productsApi.remove,
    onSuccess: () => void client.invalidateQueries({ queryKey: ['products'] }),
  });
  const items = useMemo(
    () =>
      (result.data ?? []).filter((item) =>
        `${item.name} ${item.slug} ${item.brand?.name ?? ''}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, result.data],
  );
  return (
    <PageContainer>
      <PageHeader
        title="Products"
        description="Build the catalog behind every review, guide and comparison."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void result.refetch()}
            >
              <RefreshCw /> Refresh
            </Button>
            <Button
              onClick={() =>
                setEditing({ id: '', name: '', slug: '', status: 'DRAFT' })
              }
            >
              <Plus /> New product
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
      <div className="mb-5 flex max-w-md items-center gap-2 rounded-lg border bg-card px-3">
        <Search className="size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products…"
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>
      {result.isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Add a product to give your editorial team something to test."
          action={
            <Button
              onClick={() =>
                setEditing({ id: '', name: '', slug: '', status: 'DRAFT' })
              }
            >
              <Plus /> Add product
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                    <Package className="size-5" />
                  </span>
                  <StatusBadge
                    status={(item.status ?? 'DRAFT').toLowerCase()}
                  />
                </div>
                <h2 className="mt-4 truncate font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.brand?.name ?? 'Unbranded'} · {item.slug}
                </p>
                <p className="mt-4 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                  {item.description || 'No description yet.'}
                </p>
                <div className="mt-5 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditing(item)}
                  >
                    <Pencil /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      if (window.confirm('Delete this product?'))
                        remove.mutate(item.id);
                    }}
                    aria-label="Delete product"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ProductDialog
        product={editing}
        brands={brands.data ?? []}
        sites={sites.data ?? []}
        onClose={() => setEditing(null)}
        onError={setError}
      />
    </PageContainer>
  );
}

function ProductDialog({
  product,
  brands,
  sites,
  onClose,
  onError,
}: {
  product: Product | null;
  brands: Brand[];
  sites: Array<{ id: string; name: string }>;
  onClose: () => void;
  onError: (message: string) => void;
}) {
  const client = useQueryClient();
  const detail = useQuery({ queryKey: ['product', product?.id], queryFn: () => productsApi.get(product!.id), enabled: Boolean(product?.id) });
  const media = useQuery({ queryKey: ['global-media'], queryFn: () => mediaApi.list() });
  const [variantName, setVariantName] = useState('');
  const [variantSku, setVariantSku] = useState('');
  const [assetId, setAssetId] = useState('');
  const [siteProductId, setSiteProductId] = useState('');
  const [siteTitle, setSiteTitle] = useState('');
  const [brandId, setBrandId] = useState(product?.brand?.id ?? '');
  const [publishSiteId, setPublishSiteId] = useState('');
  const current = detail.data ?? product;
  const mutation = useMutation({
    mutationFn: (input: {
      name: string;
      slug: string;
      brandId?: string;
      modelNumber?: string;
      description?: string;
    }) =>
      product?.id
        ? productsApi.update(product.id, input)
        : productsApi.create(input),
    onSuccess: () => {
      onClose();
      void client.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (cause) =>
      onError(
        cause instanceof ApiError ? cause.message : 'Unable to save product',
      ),
  });
  const publish = useMutation({
    mutationFn: (siteId: string) =>
      productsApi.publish(siteId, product!.id, {}),
    onSuccess: () => void client.invalidateQueries({ queryKey: ['products'] }),
    onError: (cause) =>
      onError(
        cause instanceof ApiError ? cause.message : 'Unable to publish product',
      ),
  });
  const addVariant = useMutation({ mutationFn: () => productsApi.addVariant(product!.id, { name: variantName, sku: variantSku }), onSuccess: () => { setVariantName(''); setVariantSku(''); void detail.refetch(); } });
  const addImage = useMutation({ mutationFn: () => productsApi.addImage(product!.id, assetId, { isPrimary: !(current?.images?.length), position: current?.images?.length ?? 0 }), onSuccess: () => { setAssetId(''); void detail.refetch(); } });
  const updateSite = useMutation({ mutationFn: () => productsApi.updateSiteProduct(siteProductId, { title: siteTitle }), onSuccess: () => void detail.refetch() });
  if (!product) return null;
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product.id ? 'Edit product' : 'Create product'}
          </DialogTitle>
          <DialogDescription>
            Keep catalog records clean so editorial decisions stay consistent.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            mutation.mutate({
              name: String(form.get('name')),
              slug: String(form.get('slug')),
              brandId: brandId || undefined,
              modelNumber: String(form.get('modelNumber') || ''),
              description: String(form.get('description') || ''),
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Product name</Label>
            <Input
              name="name"
              id="name"
              defaultValue={product.name}
              required
              minLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              name="slug"
              id="slug"
              defaultValue={product.slug}
              required
              minLength={2}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandId">Brand</Label>
            <Select value={brandId} onValueChange={(value) => setBrandId(value ?? '')}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Unbranded" /></SelectTrigger>
              <SelectContent><SelectItem value="">Unbranded</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="modelNumber">Model number</Label>
            <Input
              name="modelNumber"
              id="modelNumber"
              defaultValue={product.modelNumber ?? ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              id="description"
              defaultValue={product.description ?? ''}
            />
          </div>
          {product.id && (
            <div className="space-y-2 border-t pt-4">
              <Label htmlFor="publish-site">Publish to site</Label>
              <div className="flex gap-2">
                <Select value={publishSiteId} onValueChange={(value) => setPublishSiteId(value ?? '')}>
                  <SelectTrigger className="min-w-0 flex-1"><SelectValue placeholder="Select site" /></SelectTrigger>
                  <SelectContent><SelectItem value="">Select site</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={publish.isPending}
                  onClick={() => { if (publishSiteId) publish.mutate(publishSiteId); }}
                >
                  Publish
                </Button>
              </div>
            </div>
          )}
          {product.id && <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between"><Label>Variants</Label><span className="text-xs text-muted-foreground">{current?.variants?.length ?? 0} configured</span></div>
            {(current?.variants ?? []).map((variant) => <div key={variant.id} className="flex justify-between rounded-md border px-3 py-2 text-sm"><span>{variant.name}</span><code className="text-muted-foreground">{variant.sku}</code></div>)}
            <div className="grid grid-cols-2 gap-2"><Input placeholder="Variant name" value={variantName} onChange={(e) => setVariantName(e.target.value)} /><Input placeholder="SKU" value={variantSku} onChange={(e) => setVariantSku(e.target.value)} /></div>
            <Button type="button" variant="outline" size="sm" disabled={!variantName || !variantSku || addVariant.isPending} onClick={() => addVariant.mutate()}>Add variant</Button>
          </div>}
          {product.id && <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between"><Label>Product images</Label><span className="text-xs text-muted-foreground">{current?.images?.length ?? 0} assigned</span></div>
            {(current?.images ?? []).map((image) => <div key={image.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"><span>{image.alt || image.mediaAssetId}</span><span className="text-xs text-muted-foreground">{image.isPrimary ? 'Primary' : `Order ${image.position}`}</span></div>)}
            <div className="flex gap-2"><Select value={assetId} onValueChange={(value) => setAssetId(value ?? '')}><SelectTrigger className="min-w-0 flex-1"><SelectValue placeholder="Choose global image" /></SelectTrigger><SelectContent><SelectItem value="">Choose global image</SelectItem>{(media.data ?? []).filter((asset) => asset.mimeType.startsWith('image/')).map((asset) => <SelectItem key={asset.id} value={asset.id}>{asset.originalFilename}</SelectItem>)}</SelectContent></Select><Button type="button" variant="outline" disabled={!assetId || addImage.isPending} onClick={() => addImage.mutate()}>Assign</Button></div>
          </div>}
          {product.id && (current?.siteProducts ?? []).length > 0 && <div className="space-y-3 border-t pt-4">
            <Label>Site publishing details</Label>
            <Select value={siteProductId} onValueChange={(id) => { const value = id ?? ''; setSiteProductId(value); const item = current?.siteProducts?.find((entry) => entry.id === value); setSiteTitle(item?.title ?? ''); }}><SelectTrigger className="w-full"><SelectValue placeholder="Choose site listing" /></SelectTrigger><SelectContent><SelectItem value="">Choose site listing</SelectItem>{current?.siteProducts?.map((item) => <SelectItem key={item.id} value={item.id}>{item.title} · {item.slug}</SelectItem>)}</SelectContent></Select>
            {siteProductId && <div className="flex gap-2"><Input value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} placeholder="Published title" /><Button type="button" variant="outline" disabled={updateSite.isPending} onClick={() => updateSite.mutate()}>Save details</Button></div>}
          </div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
