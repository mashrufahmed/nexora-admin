'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ChartCard,
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  MetricCard,
  PageContainer,
  PageHeader,
} from '@/components/ui/ui-bits';
import { analyticsApi } from '@/lib/api/analytics';
import { sitesApi } from '@/lib/api/sites';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  CalendarDays,
  ExternalLink,
  Link2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';

export default function AnalyticsPage() {
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const [siteId, setSiteId] = useState('');
  const [from, setFrom] = useState('2026-10-18');
  const [to, setTo] = useState('2026-11-17');
  const selected = siteId || sites.data?.[0]?.id || '';
  const summary = useQuery({
    queryKey: ['analytics', 'summary', selected],
    queryFn: () => analyticsApi.summary(selected),
    enabled: Boolean(selected),
  });
  const report = useQuery({
    queryKey: ['analytics', 'report', selected, from, to],
    queryFn: () => analyticsApi.report(selected, from, `${to}T23:59:59.999Z`),
    enabled: Boolean(selected),
  });
  const clicks = report.data?.affiliateClicks ?? [];
  const topPages = useMemo(() => {
    const events = report.data?.events ?? [];
    return events
      .filter((event) => event.type === 'PAGE_VIEW')
      .sort((a, b) => b._count._all - a._count._all)
      .slice(0, 8);
  }, [report.data?.events]);
  if (sites.isLoading)
    return (
      <PageContainer>
        <LoadingSkeleton rows={8} />
      </PageContainer>
    );
  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Read the signals behind your publishing network."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void sites.refetch();
              void summary.refetch();
              void report.refetch();
            }}
          >
            <RefreshCw /> Refresh
          </Button>
        }
      />
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 md:flex-row md:items-center">
        <Select value={selected || 'none'} onValueChange={(value) => setSiteId(!value || value === 'none' ? '' : value)}>
          <SelectTrigger className="w-full md:w-56"><SelectValue placeholder="Choose site" /></SelectTrigger>
          <SelectContent><SelectItem value="none">Choose site</SelectItem>
          {(sites.data ?? []).map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="h-9 rounded-lg border bg-background px-2 text-foreground"
          />
          <span>to</span>
          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="h-9 rounded-lg border bg-background px-2 text-foreground"
          />
        </div>
      </div>
      {!selected ? (
        <EmptyState
          icon={BarChart3}
          title="Choose a site"
          description="Analytics are scoped to a site so access and reporting remain precise."
        />
      ) : summary.isLoading || report.isLoading ? (
        <LoadingSkeleton rows={8} />
      ) : summary.error || report.error ? (
        <ErrorState
          title="Analytics unavailable"
          description="The live report could not be loaded for this site."
          onRetry={() => {
            void summary.refetch();
            void report.refetch();
          }}
        />
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Page views"
              value={summary.data?.pageViews.toLocaleString() ?? '0'}
              hint="selected date range"
              icon={TrendingUp}
            />
            <MetricCard
              label="Affiliate clicks"
              value={summary.data?.affiliateClicks.toLocaleString() ?? '0'}
              hint="tracked redirects"
              icon={Link2}
            />
            <MetricCard
              label="Tracked pages"
              value={String(topPages.length)}
              hint="in this report"
              icon={ExternalLink}
            />
            <MetricCard
              label="Affiliate links"
              value={String(clicks.length)}
              hint="with recorded clicks"
              icon={Link2}
            />
          </section>
          <section className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Top pages"
              description="Page-view event groups for the selected range"
            >
              <div className="space-y-3">
                {topPages.map((event) => (
                  <div key={event.path} className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <TrendingUp className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {event.path || 'Unknown path'}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {event._count._all.toLocaleString()}
                    </span>
                  </div>
                ))}
                {!topPages.length && (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No page-view events in this range.
                  </p>
                )}
              </div>
            </ChartCard>
            <ChartCard
              title="Affiliate activity"
              description="Tracked click groups by affiliate link"
            >
              <div className="space-y-3">
                {clicks.slice(0, 8).map((click) => (
                  <div
                    key={click.affiliateLinkId}
                    className="flex items-center gap-3"
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-[#d8ed68]/50 text-primary">
                      <Link2 className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm">
                      {click.affiliateLinkId}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {click._count._all.toLocaleString()}
                    </span>
                  </div>
                ))}
                {!clicks.length && (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No affiliate activity in this range.
                  </p>
                )}
              </div>
            </ChartCard>
          </section>
        </>
      )}
    </PageContainer>
  );
}
