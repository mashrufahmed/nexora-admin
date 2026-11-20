'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageContainer, PageHeader, EmptyState, LoadingSkeleton } from '@/components/ui/ui-bits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sitesApi } from '@/lib/api/sites';
import { categoriesApi, type Category } from '@/lib/api/content';
import { ApiError } from '@/lib/api/client';
import { FolderTree, Plus } from 'lucide-react';
import { useState } from 'react';

export default function CategoriesPage() {
  const [siteId, setSiteId] = useState('');
  const [name, setName] = useState(''); const [slug, setSlug] = useState(''); const [parentId, setParentId] = useState('');
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const categories = useQuery({ queryKey: ['categories', siteId], queryFn: () => categoriesApi.list(siteId), enabled: Boolean(siteId) });
  const client = useQueryClient();
  const create = useMutation({ mutationFn: () => categoriesApi.create(siteId, { name, slug, ...(parentId ? { parentId } : {}) }), onSuccess: () => { setName(''); setSlug(''); setParentId(''); void client.invalidateQueries({ queryKey: ['categories', siteId] }); } });
  const error = [sites.error, categories.error, create.error].find(Boolean);
  const items = categories.data ?? [];
  return <PageContainer><PageHeader title="Categories" description="Organize published content into clear site-specific branches." />{error && <div role="alert" className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error instanceof ApiError ? error.message : 'Unable to load categories'}</div>}<div className="mb-5 max-w-md space-y-2"><Label htmlFor="site">Site</Label><select id="site" value={siteId} onChange={(e) => setSiteId(e.target.value)} className="h-9 w-full rounded-lg border bg-background px-3 text-sm"><option value="">Choose a site</option>{(sites.data ?? []).map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}</select></div>{!siteId ? <EmptyState icon={FolderTree} title="Choose a site" description="Categories belong to one site and cannot be shared across sites." /> : <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><Card><CardHeader><CardTitle>Category tree</CardTitle></CardHeader><CardContent className="space-y-2">{categories.isLoading ? <LoadingSkeleton rows={4} /> : items.length === 0 ? <EmptyState icon={FolderTree} title="No categories yet" description="Create the first branch for this site." /> : items.map((category) => <CategoryRow key={category.id} category={category} />)}</CardContent></Card><Card><CardHeader><CardTitle>New category</CardTitle></CardHeader><CardContent><form className="space-y-4" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}><div className="space-y-2"><Label htmlFor="category-name">Name</Label><Input id="category-name" value={name} onChange={(e) => { setName(e.target.value); if (!slug) setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')); }} required minLength={2} /></div><div className="space-y-2"><Label htmlFor="category-slug">Slug</Label><Input id="category-slug" value={slug} onChange={(e) => setSlug(e.target.value)} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></div><div className="space-y-2"><Label htmlFor="parent">Parent (optional)</Label><select id="parent" value={parentId} onChange={(e) => setParentId(e.target.value)} className="h-9 w-full rounded-lg border bg-background px-3 text-sm"><option value="">Top level</option>{items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><Button type="submit" disabled={create.isPending}><Plus /> {create.isPending ? 'Creating…' : 'Create category'}</Button></form></CardContent></Card></div>}</PageContainer>;
}

function CategoryRow({ category, depth = 0 }: { category: Category; depth?: number }) { return <div className="rounded-lg border p-3 text-sm" style={{ marginLeft: depth * 16 }}><p className="font-medium">{category.name}</p><p className="text-xs text-muted-foreground">/{category.slug}</p>{category.children?.map((child) => <CategoryRow key={child.id} category={child} depth={depth + 1} />)}</div>; }