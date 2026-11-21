'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EmptyState,
  LoadingSkeleton,
  PageContainer,
  PageHeader,
  StatusBadge,
} from '@/components/ui/ui-bits';
import { ApiError } from '@/lib/api/client';
import { reviewsApi, type Review } from '@/lib/api/reviews';
import { sitesApi } from '@/lib/api/sites';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  FileCheck2,
  RefreshCw,
  Search,
  Send,
  Star,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ReviewsPage() {
  const [query, setQuery] = useState('');
  const [siteId, setSiteId] = useState('');
  const client = useQueryClient();
  const result = useQuery({ queryKey: ['reviews'], queryFn: reviewsApi.list });
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const criteria = useQuery({
    queryKey: ['review-criteria', siteId],
    queryFn: () => reviewsApi.criteria(siteId),
    enabled: Boolean(siteId),
  });
  const action = useMutation({
    mutationFn: ({
      id,
      type,
    }: {
      id: string;
      type: 'submit' | 'publish' | 'archive';
    }) => reviewsApi[type](id),
    onSuccess: () => void client.invalidateQueries({ queryKey: ['reviews'] }),
  });
  const items = useMemo(
    () =>
      (result.data ?? []).filter((item) =>
        (item.title ?? '').toLowerCase().includes(query.toLowerCase()),
      ),
    [query, result.data],
  );
  const error =
    result.error instanceof ApiError
      ? result.error.message
      : result.error
        ? 'Unable to load reviews'
        : action.error instanceof ApiError
          ? action.error.message
          : '';
  return (
    <PageContainer>
      <PageHeader
        title="Reviews"
        description="Move tested products through a clear, evidence-led workflow."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => void result.refetch()}
          >
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
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="flex max-w-md items-center gap-2 rounded-lg border bg-card px-3">
          <Search className="size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search review titles…"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <Select value={siteId || 'all-sites'} onValueChange={(value) => setSiteId(!value || value === 'all-sites' ? '' : value)}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Select site criteria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-sites">All sites</SelectItem>
          {(sites.data ?? []).map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </div>
      {siteId && (
        <CriteriaPanel siteId={siteId} criteria={criteria.data ?? []} />
      )}{' '}
      {result.isLoading ? (
        <LoadingSkeleton rows={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews found"
          description="Create a review once a product has a testing record."
        />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ReviewRow
              key={item.id}
              review={item}
              busy={action.isPending}
              onAction={(type) => action.mutate({ id: item.id, type })}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}

function CriteriaPanel({
  siteId,
  criteria,
}: {
  siteId: string;
  criteria: Array<{
    id: string;
    name: string;
    weight: number;
    description?: string | null;
  }>;
}) {
  const client = useQueryClient();
  const save = useMutation({
    mutationFn: (input: {
      name: string;
      weight: number;
      description?: string;
    }) => reviewsApi.createCriterion(siteId, input),
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: ['review-criteria', siteId] }),
  });
  return (
    <Card className="mb-5">
      <CardContent className="space-y-3 p-4">
        <div>
          <h2 className="font-semibold">Scoring criteria</h2>
          <p className="text-sm text-muted-foreground">
            Configure weighted criteria for reviews on this site.
          </p>
        </div>
        {criteria.map((criterion) => (
          <div
            key={criterion.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
          >
            <span>{criterion.name}</span>
            <span className="text-muted-foreground">
              weight {criterion.weight}
            </span>
          </div>
        ))}
        <form
          className="flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            save.mutate({
              name: String(form.get('name')),
              weight: Number(form.get('weight')),
              description: String(form.get('description') || ''),
            });
            event.currentTarget.reset();
          }}
        >
          <Input name="name" placeholder="Criterion name" required />
          <Input
            name="weight"
            type="number"
            min="0.001"
            step="0.001"
            placeholder="Weight"
            required
          />
          <Button type="submit" disabled={save.isPending}>
            Add criterion
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ReviewRow({
  review,
  busy,
  onAction,
}: {
  review: Review;
  busy: boolean;
  onAction: (type: 'submit' | 'publish' | 'archive') => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#d8ed68]/40 text-primary">
          <Star className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-medium">
            {review.title ?? 'Untitled review'}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Product {review.siteProductId ?? 'not assigned'} · updated{' '}
            {review.updatedAt
              ? new Date(review.updatedAt).toLocaleDateString()
              : '—'}
          </p>
        </div>
        {review.overallScore !== null && review.overallScore !== undefined && (
          <span className="text-lg font-semibold">
            {review.overallScore.toFixed(1)}
            <span className="text-xs text-muted-foreground">/10</span>
          </span>
        )}
        <StatusBadge status={review.status.toLowerCase()} />
        <div className="flex gap-1">
          {review.status === 'DRAFT' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction('submit')}
              disabled={busy}
            >
              <Send />
            </Button>
          )}
          {review.status === 'IN_REVIEW' && (
            <Button
              size="sm"
              onClick={() => onAction('publish')}
              disabled={busy}
            >
              <CheckCircle2 />
            </Button>
          )}
          {review.status !== 'ARCHIVED' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAction('archive')}
              disabled={busy}
            >
              <FileCheck2 />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
