import { apiFetch } from './client';
export type AnalyticsSummary = { pageViews: number; affiliateClicks: number };
export type AnalyticsEventRow = { type: 'PAGE_VIEW' | 'AFFILIATE_CLICK'; path: string | null; _count: { _all: number } };
export type AnalyticsClickRow = { affiliateLinkId: string; _count: { _all: number } };
export type AnalyticsReport = { from: string; to: string; events: AnalyticsEventRow[]; affiliateClicks: AnalyticsClickRow[] };
export const analyticsApi = { summary: (siteId: string) => apiFetch<AnalyticsSummary>(`/analytics/summary?siteId=${encodeURIComponent(siteId)}`), report: (siteId: string, from?: string, to?: string) => apiFetch<AnalyticsReport>(`/analytics/report?${new URLSearchParams({ siteId, ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString()}`) };