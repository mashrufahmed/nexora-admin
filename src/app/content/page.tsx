'use client';

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
import { ApiError } from '@/lib/api/client';
import { contentApi, type Content } from '@/lib/api/content';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Archive,
  ArrowUpRight,
  FileText,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const statuses = [
  'ALL',
  'DRAFT',
  'IN_REVIEW',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
] as const;

export default function ContentPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<(typeof statuses)[number]>('ALL');
  const router = useRouter();
  const client = useQueryClient();
  const result = useQuery({ queryKey: ['content'], queryFn: contentApi.list });
  const archive = useMutation({
    mutationFn: contentApi.archive,
    onSuccess: () => client.invalidateQueries({ queryKey: ['content'] }),
  });
  const items = useMemo(
    () =>
      (result.data ?? []).filter(
        (item) =>
          (status === 'ALL' || item.status === status) &&
          `${item.title} ${item.slug}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, result.data, status],
  );
  const error =
    result.error instanceof ApiError
      ? result.error.message
      : result.error
        ? 'Unable to load content'
        : archive.error instanceof ApiError
          ? archive.error.message
          : '';
  return (
    <PageContainer>
      <PageHeader
        title="Content"
        description="Shape the stories, pages and reviews that move your network."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void result.refetch()}
            >
              <RefreshCw /> Refresh
            </Button>
            <Button onClick={() => router.push('/content/new')}>
              <Plus /> New content
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
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-md items-center gap-2 rounded-lg border bg-card px-3">
          <Search className="size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title or slug…"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((value) => (
            <Button
              key={value}
              size="xs"
              variant={status === value ? 'default' : 'outline'}
              onClick={() => setStatus(value)}
            >
              {value === 'ALL' ? 'All' : value.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>
      {result.isLoading ? (
        <LoadingSkeleton rows={7} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={
            query || status !== 'ALL'
              ? 'No content matches this view'
              : 'No content yet'
          }
          description="Create your first article or page to start the editorial workflow."
          action={
            <Button onClick={() => router.push('/content/new')}>
              <Plus /> Create content
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ContentRow
              key={item.id}
              item={item}
              archiving={archive.isPending}
              onArchive={() => archive.mutate(item.id)}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}

function ContentRow({
  item,
  archiving,
  onArchive,
}: {
  item: Content;
  archiving: boolean;
  onArchive: () => void;
}) {
  const router = useRouter();
  return (
    <Card className="transition-shadow hover:shadow-sm">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <FileText className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href={`/content/${item.id}`}
            className="block truncate font-medium hover:text-primary"
          >
            {item.title}
          </Link>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            /{item.slug} · {item.type.toLowerCase()} · updated{' '}
            {new Date(item.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={item.status.toLowerCase()} />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
             onClick={() => router.push(`/content/${item.id}`)}
            aria-label="Open content"
          >
            <ArrowUpRight />
          </Button>
          {item.status !== 'ARCHIVED' && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onArchive}
              disabled={archiving}
              aria-label="Archive content"
            >
              <Archive />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
