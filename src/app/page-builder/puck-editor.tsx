'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/api/client';
import {
    pageTemplatesApi,
    type PageTemplate,
    type PuckData,
} from '@/lib/api/page-templates';
import { Puck, type Config, type Data } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const config: Config = {
  components: {
    Heading: {
      fields: {
        text: { type: 'text' },
        level: {
          type: 'select',
          options: [
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
          ],
        },
      },
      defaultProps: { text: 'Your headline', level: 'h1' },
      render: ({ text, level }) => {
        const Tag = level as 'h1' | 'h2' | 'h3';
        return <Tag className="text-3xl font-bold tracking-tight">{text}</Tag>;
      },
    },
    Text: {
      fields: { text: { type: 'textarea' } },
      defaultProps: { text: 'Add supporting copy here.' },
      render: ({ text }) => (
        <p className="max-w-2xl text-base leading-7 text-slate-600">{text}</p>
      ),
    },
    Image: {
      fields: { src: { type: 'text' }, alt: { type: 'text' } },
      defaultProps: { src: '', alt: 'Image' },
      render: ({ src, alt }) =>
        src ? (
          <img
            src={src}
            alt={alt}
            className="max-h-96 w-full rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
            Add an image URL
          </div>
        ),
    },
    Button: {
      fields: { label: { type: 'text' }, href: { type: 'text' } },
      defaultProps: { label: 'Learn more', href: '#' },
      render: ({ label, href }) => (
        <a
          href={href}
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          {label}
        </a>
      ),
    },
  },
};
const emptyData: PuckData = { content: [], root: {} };

export function PuckEditor({
  template,
  onClose,
}: {
  template: PageTemplate;
  onClose: () => void;
}) {
  const [activeTemplate, setActiveTemplate] = useState(template);
  const [name, setName] = useState(template.name);
  const [error, setError] = useState('');
  const [previewRevision, setPreviewRevision] = useState<Awaited<ReturnType<typeof pageTemplatesApi.preview>> | null>(null);
  const client = useQueryClient();
  const versions = useQuery({
    queryKey: ['page-template-versions', activeTemplate.id],
    queryFn: () => pageTemplatesApi.versions(activeTemplate.id),
    enabled: Boolean(activeTemplate.id),
  });
  const save = useMutation<
    PageTemplate | Awaited<ReturnType<typeof pageTemplatesApi.update>>,
    unknown,
    Data
  >({
    mutationFn: (data) =>
      activeTemplate.id
        ? pageTemplatesApi.update(activeTemplate.id, {
            name,
            type: activeTemplate.type,
            config: data as PuckData,
          })
        : pageTemplatesApi.create({
            siteId: activeTemplate.siteId,
            name,
            type: activeTemplate.type,
            config: data as PuckData,
          }),
    onSuccess: (result) => {
      if ('siteId' in result) setActiveTemplate(result);
      setError('');
      void client.invalidateQueries({
        queryKey: ['page-templates', activeTemplate.siteId],
      });
    },
    onError: (cause) =>
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to save this template',
      ),
  });
  const publish = useMutation({
    mutationFn: (revisionId: string) =>
      pageTemplatesApi.publish(activeTemplate.id, revisionId),
    onSuccess: (result) =>
      setActiveTemplate((current) => ({ ...current, ...result })),
    onError: (cause) =>
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to publish this revision',
      ),
  });
  const restore = useMutation({
    mutationFn: (revisionId: string) =>
      pageTemplatesApi.restore(activeTemplate.id, revisionId),
    onSuccess: (revision) => {
      setActiveTemplate((current) => ({
        ...current,
        status: 'DRAFT',
        revisions: [revision, ...current.revisions],
      }));
      void versions.refetch();
      void client.invalidateQueries({
        queryKey: ['page-templates', activeTemplate.siteId],
      });
      setError('');
    },
    onError: (cause) =>
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to restore this revision',
      ),
  });
  const preview = useMutation({
    mutationFn: (revisionId: string) => pageTemplatesApi.preview(activeTemplate.id, revisionId),
    onSuccess: setPreviewRevision,
    onError: (cause) => setError(cause instanceof ApiError ? cause.message : 'Unable to load preview'),
  });
  const initialData = useMemo(
    () => (activeTemplate.revisions[0]?.config ?? emptyData) as Data,
    [activeTemplate.revisions],
  );
  const latestRevisionId = activeTemplate.revisions[0]?.id;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="max-w-sm"
          aria-label="Template name"
        />
        <Button variant="outline" onClick={onClose}>
          Back to templates
        </Button>
        {activeTemplate.id && latestRevisionId && (
          <Button
            variant="secondary"
            disabled={publish.isPending}
            onClick={() => publish.mutate(latestRevisionId)}
          >
            {publish.isPending ? 'Publishing…' : 'Publish latest revision'}
          </Button>
        )}
      </div>
      {activeTemplate.id && (
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Revision history</h2>
              <p className="text-sm text-muted-foreground">
                Restore a previous revision as a new draft.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {versions.data?.length ?? 0} revisions
            </span>
          </div>
          <div className="space-y-2">
            {(versions.data ?? activeTemplate.revisions).map((revision) => (
              <div
                key={revision.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    Revision {revision.revisionNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(revision.createdAt).toLocaleString()}
                    {revision.publishedAt ? ' · published' : ' · draft'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => preview.mutate(revision.id)}
                  disabled={preview.isPending}
                >
                  {preview.isPending ? 'Loading…' : 'Preview'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    restore.isPending || revision.id === latestRevisionId
                  }
                  onClick={() => {
                    if (
                      window.confirm(
                        `Restore revision ${revision.revisionNumber} as a new draft?`,
                      )
                    )
                      restore.mutate(revision.id);
                  }}
                >
                  {restore.isPending ? 'Restoring…' : 'Restore'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <Dialog open={Boolean(previewRevision)} onOpenChange={(open) => !open && setPreviewRevision(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Revision {previewRevision?.revision.revisionNumber} preview</DialogTitle>
            <DialogDescription>This is a read-only snapshot of the saved page configuration.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto rounded-lg border bg-muted/30 p-4">
            <pre className="whitespace-pre-wrap text-xs leading-5">{JSON.stringify(previewRevision?.revision.config, null, 2)}</pre>
          </div>
        </DialogContent>
      </Dialog>
      <div className="min-h-[720px] overflow-hidden rounded-xl border bg-white">
        <Puck
          config={config}
          data={initialData}
          onPublish={async (data) => {
            await save.mutateAsync(data);
          }}
          headerTitle={name || 'Untitled template'}
        />
      </div>
    </div>
  );
}
