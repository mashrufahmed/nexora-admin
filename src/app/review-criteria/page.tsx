'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  EmptyState,
  LoadingSkeleton,
  PageContainer,
  PageHeader,
} from '@/components/ui/ui-bits';
import { ApiError } from '@/lib/api/client';
import { reviewsApi } from '@/lib/api/reviews';
import { sitesApi } from '@/lib/api/sites';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ReviewCriteriaPage() {
  const [siteId, setSiteId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('1');
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const criteria = useQuery({
    queryKey: ['review-criteria', siteId],
    queryFn: () => reviewsApi.criteria(siteId),
    enabled: Boolean(siteId),
  });
  const client = useQueryClient();
  const create = useMutation({
    mutationFn: () =>
      reviewsApi.createCriterion(siteId, {
        name,
        description,
        weight: Number(weight),
        position: (criteria.data?.length ?? 0) + 1,
      }),
    onSuccess: () => {
      setName('');
      setDescription('');
      setWeight('1');
      void client.invalidateQueries({ queryKey: ['review-criteria', siteId] });
    },
  });
  const remove = useMutation({
    mutationFn: reviewsApi.deleteCriterion,
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: ['review-criteria', siteId] }),
  });
  const error = [sites.error, criteria.error, create.error, remove.error].find(
    Boolean,
  );
  return (
    <PageContainer>
      <PageHeader
        title="Review criteria"
        description="Define the weighted scorecard editors use when evaluating products."
      />
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error instanceof ApiError
            ? error.message
            : 'Unable to load review criteria'}
        </div>
      )}
      <div className="mb-5 max-w-md space-y-2">
        <Label htmlFor="criteria-site">Site</Label>
        <Select value={siteId || 'none'} onValueChange={(value) => setSiteId(!value || value === 'none' ? '' : value)}><SelectTrigger id="criteria-site" className="w-full"><SelectValue placeholder="Choose a site" /></SelectTrigger><SelectContent><SelectItem value="none">Choose a site</SelectItem>
          {(sites.data ?? []).map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
            </SelectItem>
          ))}
        </SelectContent></Select>
      </div>
      {!siteId ? (
        <EmptyState
          icon={SlidersHorizontal}
          title="Choose a site"
          description="Scoring criteria belong to one site and can be tuned independently."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Scorecard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {criteria.isLoading ? (
                <LoadingSkeleton rows={4} />
              ) : (criteria.data ?? []).length === 0 ? (
                <EmptyState
                  icon={SlidersHorizontal}
                  title="No criteria yet"
                  description="Add the first dimension editors should score."
                />
              ) : (
                (criteria.data ?? []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description || 'No description'} · weight{' '}
                        {item.weight}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${item.name}`}
                      onClick={() => {
                        if (window.confirm(`Delete ${item.name}?`))
                          remove.mutate(item.id);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>New criterion</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  create.mutate();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="criterion-name">Name</Label>
                  <Input
                    id="criterion-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    minLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criterion-description">Description</Label>
                  <Input
                    id="criterion-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criterion-weight">Weight</Label>
                  <Input
                    id="criterion-weight"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={create.isPending}>
                  <Plus /> {create.isPending ? 'Adding…' : 'Add criterion'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
