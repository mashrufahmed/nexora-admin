'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { PageContainer, PageHeader, StatusBadge, LoadingSkeleton } from '@/components/ui/ui-bits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contentApi, categoriesApi, type Content } from '@/lib/api/content';
import { sitesApi } from '@/lib/api/sites';
import { ApiError } from '@/lib/api/client';
import { ArrowLeft, Archive, CheckCircle2, Save, Send, Upload } from 'lucide-react';
import { useState } from 'react';

function ContentEditorForm({ content }: { content: Content }) {
  const router = useRouter();
  const client = useQueryClient();
  const [title, setTitle] = useState(content.title);
  const [slug, setSlug] = useState(content.slug);
  const [excerpt, setExcerpt] = useState(content.excerpt ?? '');
  const [body, setBody] = useState(typeof content.body?.content === 'string' ? content.body.content : '');
  const [siteId, setSiteId] = useState(content.siteContents?.[0]?.siteId ?? '');
  const [categoryIds, setCategoryIds] = useState<string[]>(content.siteContents?.[0]?.categories?.map((category) => category.categoryId) ?? []);
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const categories = useQuery({ queryKey: ['categories', siteId], queryFn: () => categoriesApi.list(siteId), enabled: Boolean(siteId) });
  const update = useMutation({ mutationFn: () => contentApi.update(content.id, { title, slug, excerpt, body: { format: 'plain', content: body } }), onSuccess: () => { void client.invalidateQueries({ queryKey: ['content'] }); void client.invalidateQueries({ queryKey: ['content', content.id] }); } });
  const submit = useMutation({ mutationFn: () => contentApi.submit(content.id), onSuccess: () => void client.invalidateQueries({ queryKey: ['content', content.id] }) });
  const archive = useMutation({ mutationFn: () => contentApi.archive(content.id), onSuccess: () => void client.invalidateQueries({ queryKey: ['content', content.id] }) });
  const publish = useMutation({ mutationFn: () => contentApi.publish(content.id, siteId, categoryIds, slug), onSuccess: () => void client.invalidateQueries({ queryKey: ['content', content.id] }) });
  const error = [update.error, submit.error, archive.error, publish.error].find((value): value is Error => Boolean(value));

  return <PageContainer>
    <Button variant="ghost" size="sm" className="mb-5" onClick={() => router.push('/content')}><ArrowLeft /> All content</Button>
    <PageHeader title="Edit content" description={content.title} actions={<div className="flex items-center gap-2"><StatusBadge status={content.status.toLowerCase()} /><Button variant="outline" size="sm" onClick={() => update.mutate()} disabled={update.isPending}><Save /> {update.isPending ? 'Saving…' : 'Save'}</Button>{content.status === 'DRAFT' && <Button size="sm" onClick={() => submit.mutate()} disabled={submit.isPending}><Send /> Submit review</Button>}{content.status !== 'ARCHIVED' && <Button variant="ghost" size="sm" onClick={() => archive.mutate()} disabled={archive.isPending}><Archive /></Button>}{siteId && ['IN_REVIEW', 'SCHEDULED'].includes(content.status) && <Button size="sm" onClick={() => publish.mutate()} disabled={publish.isPending}><Upload /> {publish.isPending ? 'Publishing…' : 'Publish'}</Button>}</div>} />
    {error && <div role="alert" className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">{error instanceof ApiError ? error.message : 'Unable to update this content'}</div>}
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]"><Card><CardHeader><CardTitle>Editorial draft</CardTitle></CardHeader><CardContent className="space-y-5"><div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="excerpt">Excerpt</Label><Textarea id="excerpt" value={excerpt} onChange={(event) => setExcerpt(event.target.value)} maxLength={500} /></div><div className="space-y-2"><Label htmlFor="body">Body</Label><Textarea id="body" value={body} onChange={(event) => setBody(event.target.value)} className="min-h-100" /></div></CardContent></Card><Card><CardHeader><CardTitle>Publishing</CardTitle></CardHeader><CardContent className="space-y-5"><div className="space-y-2"><Label htmlFor="slug">Slug</Label><Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} /></div><div className="space-y-2"><Label>Publish to site</Label><Select value={siteId} onValueChange={(value) => { setSiteId(value ?? ''); setCategoryIds([]); }}><SelectTrigger className="w-full"><SelectValue placeholder="Choose a site" /></SelectTrigger><SelectContent>{(sites.data ?? []).map((site) => <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>)}</SelectContent></Select></div>{siteId && <div className="space-y-2"><Label htmlFor="publish-category">Categories</Label><select id="publish-category" multiple value={categoryIds} onChange={(event) => setCategoryIds(Array.from(event.target.selectedOptions, (option) => option.value))} className="min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm">{(categories.data ?? []).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>}<div className="rounded-lg border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground"><CheckCircle2 className="mb-2 size-4 text-emerald-600" />Saving keeps this draft private. Publishing makes it visible on the selected site.</div></CardContent></Card></div>
  </PageContainer>;
}

export default function ContentEditorClient({ contentId }: { contentId: string }) {
  const result = useQuery({ queryKey: ['content', contentId], queryFn: () => contentApi.get(contentId) });
  if (result.isLoading) return <PageContainer><LoadingSkeleton rows={8} /></PageContainer>;
  if (!result.data) return <PageContainer><div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{result.error instanceof ApiError ? result.error.message : 'Content not found'}</div></PageContainer>;
  return <ContentEditorForm content={result.data} />;
}