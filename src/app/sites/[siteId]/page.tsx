import SiteDetailsClient from './site-details-client';
import { Suspense } from 'react';

async function SiteDetailsContent({ params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  return <SiteDetailsClient siteId={siteId} />;
}

export default function SiteDetailsPage({ params }: { params: Promise<{ siteId: string }> }) {
  return <Suspense fallback={null}><SiteDetailsContent params={params} /></Suspense>;
}
