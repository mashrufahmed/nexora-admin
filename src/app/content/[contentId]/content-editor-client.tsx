'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  LoadingSkeleton,
  PageContainer,
  PageHeader,
  StatusBadge,
} from '@/components/ui/ui-bits';
import { ApiError } from '@/lib/api/client';
import { categoriesApi, contentApi, type Content } from '@/lib/api/content';
import { sitesApi } from '@/lib/api/sites';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Save,
  Send,
  History,
  RotateCcw,
  Eye,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function CategoryCheckboxDropdown({ categories, value, onChange }: { categories: Array<{ id: string; name: string }>; value: string[]; onChange: (value: string[]) => void }) {
  return <div className="space-y-2 rounded-md border border-border/70 bg-background p-2">
    {categories.length === 0 ? <p className="px-2 py-1 text-sm text-muted-foreground">No categories for this site.</p> : categories.map((category) => <label key={category.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
      <input type="checkbox" checked={value.includes(category.id)} onChange={(event) => onChange(event.target.checked ? [...value, category.id] : value.filter((id) => id !== category.id))} />
      {category.name}
    </label>)}
  </div>;
}

function ContentEditorForm({ content }: { content: Content }) {
  const router = useRouter();
  const client = useQueryClient();
  const [title, setTitle] = useState(content.title);
  const [slug, setSlug] = useState(content.slug);
  const [excerpt, setExcerpt] = useState(content.excerpt ?? '');
  const [body, setBody] = useState(
    typeof content.body?.content === 'string' ? content.body.content : '',
  );
  const [siteId, setSiteId] = useState(content.siteContents?.[0]?.siteId ?? '');
  const [categoryIds, setCategoryIds] = useState<string[]>(
    content.siteContents?.[0]?.categories?.map(
      (category) => category.categoryId,
    ) ?? [],
  );
  const [scheduledAt, setScheduledAt] = useState('');
  const [previewRevision, setPreviewRevision] = useState<Content['body'] | null>(null);
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const categories = useQuery({
    queryKey: ['categories', siteId],
    queryFn: () => categoriesApi.list(siteId),
    enabled: Boolean(siteId),
  });
  const update = useMutation({
    mutationFn: () =>
      contentApi.update(content.id, {
        title,
        slug,
        excerpt,
        body: { format: 'plain', content: body },
      }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['content'] });
      void client.invalidateQueries({ queryKey: ['content', content.id] });
    },
  });
  const submit = useMutation({
    mutationFn: () => contentApi.submit(content.id),
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: ['content', content.id] }),
  });
  const archive = useMutation({
    mutationFn: () => contentApi.archive(content.id),
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: ['content', content.id] }),
  });
  const publish = useMutation({
    mutationFn: () => contentApi.publish(content.id, siteId, categoryIds, slug),
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: ['content', content.id] }),
  });
  const schedule = useMutation({
    mutationFn: () => contentApi.schedule(content.id, siteId, new Date(scheduledAt).toISOString()),
    onSuccess: () => {
      setScheduledAt('');
      void client.invalidateQueries({ queryKey: ['content', content.id] });
      void client.invalidateQueries({ queryKey: ['content'] });
    },
  });
  const revisions = useQuery({
    queryKey: ['content-revisions', content.id],
    queryFn: () => contentApi.revisions(content.id),
  });
  const restore = useMutation({
    mutationFn: (revisionId: string) => contentApi.restoreRevision(content.id, revisionId),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['content', content.id] });
      void client.invalidateQueries({ queryKey: ['content-revisions', content.id] });
    },
  });
  const error = [update.error, submit.error, archive.error, publish.error, schedule.error, restore.error].find(
    (value): value is Error => Boolean(value),
  );

  return (
    <PageContainer className="pb-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-5"
        onClick={() => router.push('/content')}
      >
        <ArrowLeft /> All content
      </Button>
      <PageHeader
        title="Edit content"
        description={content.title}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={content.status.toLowerCase()} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => update.mutate()}
              disabled={update.isPending}
            >
              <Save /> {update.isPending ? 'Saving…' : 'Save'}
            </Button>
            {content.status === 'DRAFT' && (
              <Button
                size="sm"
                onClick={() => submit.mutate()}
                disabled={submit.isPending}
              >
                <Send /> Submit review
              </Button>
            )}
            {content.status !== 'ARCHIVED' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm('Archive this content? It will leave the active workflow.')) archive.mutate();
                }}
                disabled={archive.isPending}
                aria-label="Archive content"
              >
                <Archive />
              </Button>
            )}
            {siteId && ['IN_REVIEW', 'SCHEDULED'].includes(content.status) && (
              <Button
                size="sm"
                onClick={() => publish.mutate()}
                disabled={publish.isPending}
              >
                <Upload /> {publish.isPending ? 'Publishing…' : 'Publish'}
              </Button>
            )}
          </div>
        }
      />
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error instanceof ApiError
            ? error.message
            : 'Unable to update this content'}
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Editorial draft</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Keep the story focused, readable, and ready for review.</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                maxLength={500}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="min-h-100"
              />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Choose a destination and control when this content becomes visible.</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Publish to site</Label>
              <Select
                value={siteId}
                onValueChange={(value) => {
                  setSiteId(value ?? '');
                  setCategoryIds([]);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a site" />
                </SelectTrigger>
                <SelectContent>
                  {(sites.data ?? []).map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {siteId && (
              <div className="space-y-2">
                <Label htmlFor="publish-category">Categories</Label>
                <CategoryCheckboxDropdown categories={categories.data ?? []} value={categoryIds} onChange={setCategoryIds} />
              </div>
            )}
            {siteId && ['DRAFT', 'IN_REVIEW'].includes(content.status) && (
              <div className="space-y-2 rounded-md border border-dashed border-primary/30 bg-primary/5 p-3">
                <Label htmlFor="scheduled-at">Schedule publication</Label>
                <Input
                  id="scheduled-at"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(event) => setScheduledAt(event.target.value)}
                />
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => schedule.mutate()}
                  disabled={!scheduledAt || schedule.isPending}
                >
                  {schedule.isPending ? 'Scheduling…' : 'Schedule publication'}
                </Button>
              </div>
            )}
            <div className="rounded-md border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">
              <CheckCircle2 className="mb-2 size-4 text-success" />
              Saving keeps this draft private. Publishing makes it visible on
              the selected site.
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History className="size-4" /> Revision history</CardTitle>
        </CardHeader>
        <CardContent>
          {revisions.isLoading ? <p className="text-sm text-muted-foreground">Loading revisions…</p> :
            revisions.data?.length ? <div className="space-y-2">{revisions.data.map((revision) => (
              <div key={revision.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
                <span className="font-medium">Revision {revision.revisionNumber}</span>
                <span className="text-xs text-muted-foreground">{new Date(revision.createdAt).toLocaleString()}</span>
                <div className="ml-auto flex gap-1">
                  <Button size="sm" variant="ghost" onClick={async () => {
                    const result = await contentApi.previewRevision(content.id, revision.id);
                    setPreviewRevision(result.revision.body);
                  }}><Eye /> Preview</Button>
                  <Button size="sm" variant="outline" onClick={() => restore.mutate(revision.id)} disabled={restore.isPending}><RotateCcw /> Restore</Button>
                </div>
              </div>
            ))}</div> : <p className="text-sm text-muted-foreground">No saved revisions yet.</p>}
          {previewRevision && <div className="mt-4 rounded-lg bg-muted/40 p-4"><div className="mb-2 flex items-center justify-between text-sm font-medium"><span>Revision preview</span><Button size="sm" variant="ghost" onClick={() => setPreviewRevision(null)}>Close</Button></div><pre className="max-h-64 overflow-auto whitespace-pre-wrap text-xs">{typeof previewRevision?.content === 'string' ? previewRevision.content : JSON.stringify(previewRevision, null, 2)}</pre></div>}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export default function ContentEditorClient({
  contentId,
}: {
  contentId: string;
}) {
  const result = useQuery({
    queryKey: ['content', contentId],
    queryFn: () => contentApi.get(contentId),
  });
  if (result.isLoading)
    return (
      <PageContainer>
        <LoadingSkeleton rows={8} />
      </PageContainer>
    );
  if (!result.data)
    return (
      <PageContainer>
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {result.error instanceof ApiError
            ? result.error.message
            : 'Content not found'}
        </div>
      </PageContainer>
    );
  return <ContentEditorForm content={result.data} />;
}
