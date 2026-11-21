'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartCard,
  LoadingSkeleton,
  MetricCard,
  PageContainer,
  PageHeader,
  StatusBadge,
} from '@/components/ui/ui-bits';
import { analyticsApi } from '@/lib/api/analytics';
import { auditApi } from '@/lib/api/audit';
import { ApiError } from '@/lib/api/client';
import { contentApi } from '@/lib/api/content';
import { sitesApi } from '@/lib/api/sites';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpRight,
  FileText,
  Gauge,
  Globe2,
  ImageIcon,
  Link2,
  Package,
  Plus,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

type AnalyticsReport = {
  events?: Array<{
    type: string;
    path: string | null;
    _count: { _all: number };
  }>;
  affiliateClicks?: Array<{
    affiliateLinkId: string;
    _count: { _all: number };
  }>;
};

export default function DashboardHome() {
  const { can } = useAuth();
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const content = useQuery({ queryKey: ['content'], queryFn: contentApi.list });
  const activeSite =
    sites.data?.find((site) => site.status === 'ACTIVE') ?? sites.data?.[0];
  const summary = useQuery({
    queryKey: ['analytics', 'summary', activeSite?.id],
    queryFn: () => analyticsApi.summary(activeSite!.id),
    enabled: Boolean(activeSite),
  });
  const report = useQuery({
    queryKey: ['analytics', 'report', activeSite?.id],
    queryFn: () => analyticsApi.report(activeSite!.id),
    enabled: Boolean(activeSite),
  });
  const activity = useQuery({
    queryKey: ['audit', 'recent'],
    queryFn: () => auditApi.list({ limit: 6 }),
    enabled: can('audit.logs.read'),
    staleTime: 15_000,
  });
  const reportData = (report.data ?? {}) as AnalyticsReport;
  const pageViews = Number(summary.data?.pageViews ?? 0);
  const affiliateClicks = Number(summary.data?.affiliateClicks ?? 0);
  const published =
    content.data?.filter((item) => item.status === 'PUBLISHED').length ?? 0;
  const review =
    content.data?.filter((item) => item.status === 'IN_REVIEW').length ?? 0;
  const activeSites =
    sites.data?.filter((site) => site.status === 'ACTIVE').length ?? 0;
  const error = [
    sites.error,
    content.error,
    summary.error,
    report.error,
    activity.error,
  ].find(Boolean);
  if (sites.isLoading || content.isLoading)
    return (
      <PageContainer>
        <LoadingSkeleton rows={8} />
      </PageContainer>
    );
  return (
    <PageContainer className="space-y-6 pb-10">
      <PageHeader
        title="Good morning"
        description={
          activeSite
            ? `Here’s the operating picture for ${activeSite.name}.`
            : 'Connect a site to start seeing live network signals.'
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void sites.refetch();
                void content.refetch();
                void summary.refetch();
                void report.refetch();
                void activity.refetch();
              }}
            >
              <RefreshCw /> Refresh
            </Button>
            {can('content.create') && (
              <Button onClick={() => (window.location.href = '/content/new')}>
                <Plus /> New content
              </Button>
            )}
          </>
        }
      >
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" /> Live backend
            data
          </span>
          <span>·</span>
          <span>
            {activeSite
              ? `Reporting from ${activeSite.slug}`
              : 'No site selected'}
          </span>
        </div>
      </PageHeader>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error instanceof ApiError
            ? error.message
            : 'Some live data could not be loaded.'}
        </div>
      )}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Published content"
          value={String(published)}
          hint="live CMS count"
          icon={FileText}
        />
        <MetricCard
          label="Page views"
          value={pageViews.toLocaleString()}
          hint="all recorded events"
          icon={TrendingUp}
        />
        <MetricCard
          label="Affiliate clicks"
          value={affiliateClicks.toLocaleString()}
          hint="tracked redirects"
          icon={Link2}
        />
        <MetricCard
          label="Review queue"
          value={String(review)}
          hint="awaiting review"
          icon={Gauge}
        />
        <MetricCard
          label="Active sites"
          value={String(activeSites)}
          hint={`of ${sites.data?.length ?? 0} properties`}
          icon={Globe2}
        />
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <ChartCard
          title="Live event mix"
          description="Aggregated analytics report for the selected site"
        >
          <div className="space-y-4 pt-2">
            {(reportData.events ?? []).slice(0, 8).map((event) => (
              <div
                key={`${event.type}-${event.path}`}
                className="flex items-center gap-3"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  {event.type === 'PAGE_VIEW' ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <Link2 className="size-4" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {event.path || event.type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {event.type.replace('_', ' ')}
                  </span>
                </span>
                <span className="font-semibold tabular-nums">
                  {event._count._all.toLocaleString()}
                </span>
              </div>
            ))}
            {!reportData.events?.length && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No analytics events have been recorded for this site yet.
              </p>
            )}
          </div>
        </ChartCard>
        <ChartCard
          title="Sites at a glance"
          description="Properties available to your account"
        >
          <div className="space-y-3">
            {(sites.data ?? []).map((site) => (
              <Link
                href={`/sites/${site.id}`}
                key={site.id}
                className="flex items-center gap-3 rounded-lg p-1.5 hover:bg-muted/50"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Globe2 className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {site.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {site.slug}
                  </span>
                </span>
                <StatusBadge status={site.status.toLowerCase()} />
              </Link>
            ))}
          </div>
        </ChartCard>
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Publishing queue</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Live CMS items that need a decision.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {(content.data ?? [])
              .filter((item) => ['DRAFT', 'IN_REVIEW'].includes(item.status))
              .slice(0, 5)
              .map((item) => (
                <Link
                  href={`/content/${item.id}`}
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/50"
                >
                  <FileText className="size-4 text-primary" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {item.title}
                  </span>
                  <StatusBadge status={item.status.toLowerCase()} />
                </Link>
              ))}
            {!content.data?.some((item) =>
              ['DRAFT', 'IN_REVIEW'].includes(item.status),
            ) && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                The queue is clear.
              </p>
            )}
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => (window.location.href = '/content')}
            >
              Open content <ArrowUpRight />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest administrative events.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.isLoading ? (
              <LoadingSkeleton rows={3} />
            ) : (
              (activity.data?.data ?? []).map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{log.action}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {log.actor?.name ?? 'System'} ·{' '}
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            {can('audit.logs.read') &&
              !activity.isLoading &&
              !activity.data?.data.length && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No recent activity.
                </p>
              )}
            {!can('audit.logs.read') && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Activity is restricted to audit readers.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next surfaces</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue working with live records.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => (window.location.href = '/products')}
            >
              Manage products <Package />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => (window.location.href = '/reviews')}
            >
              Review testing queue <Sparkles />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => (window.location.href = '/affiliate')}
            >
              Affiliate links <Link2 />
            </Button>
          </CardContent>
        </Card>
        <Card className="overflow-hidden bg-primary text-primary-foreground">
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#d8ed68] text-primary">
              <ImageIcon className="size-5" />
            </div>
            <CardTitle className="mt-4 text-xl">Keep publishing</CardTitle>
            <p className="text-primary-foreground/70">
              Your next useful action is one click away.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              onClick={() => (window.location.href = '/content')}
            >
              View content <ArrowUpRight />
            </Button>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
