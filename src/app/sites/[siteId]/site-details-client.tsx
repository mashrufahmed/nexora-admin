'use client';

import { PageContainer, PageHeader, StatusBadge, LoadingSkeleton } from '@/components/ui/ui-bits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sitesApi, type Site } from '@/lib/api/sites';
import { ApiError } from '@/lib/api/client';
import { ArrowLeft, Globe2, Plus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SiteDetailsClient({ siteId }: { siteId: string }) {
  const [site, setSite] = useState<Site | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [saving, setSaving] = useState(false); const [hostname, setHostname] = useState('');
  useEffect(() => { sitesApi.get(siteId).then(setSite).catch((cause) => setError(cause instanceof ApiError ? cause.message : 'Unable to load site')).finally(() => setLoading(false)); }, [siteId]);
  async function save(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (!site) return; setSaving(true); try { setSite(await sitesApi.update(site.id, { name: site.name, slug: site.slug })); } catch (cause) { setError(cause instanceof ApiError ? cause.message : 'Unable to update site'); } finally { setSaving(false); } }
  async function addDomain(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (!site || !hostname.trim()) return; try { const domain = await sitesApi.addDomain(site.id, hostname.trim(), site.domains.length === 0); setSite({ ...site, domains: [...site.domains, domain] }); setHostname(''); } catch (cause) { setError(cause instanceof ApiError ? cause.message : 'Unable to add domain'); } }
  if (loading) return <PageContainer><LoadingSkeleton rows={6} /></PageContainer>;
  if (!site) return <PageContainer><div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">{error || 'Site not found'}</div></PageContainer>;
  return <PageContainer><Button variant="ghost" size="sm" className="mb-5" onClick={() => window.location.href = '/sites'}><ArrowLeft /> All sites</Button><PageHeader title={site.name} description={`Manage ${site.slug} and its publishing configuration.`} actions={<StatusBadge status={site.status.toLowerCase()} />} />{error && <div role="alert" className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}<div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"><Card><CardHeader><CardTitle>Site details</CardTitle></CardHeader><CardContent><form onSubmit={save} className="space-y-4"><div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={site.name} onChange={(event) => setSite({ ...site, name: event.target.value })} /></div><div className="space-y-2"><Label htmlFor="slug">Slug</Label><Input id="slug" value={site.slug} onChange={(event) => setSite({ ...site, slug: event.target.value })} /></div><Button type="submit" disabled={saving}><Save /> {saving ? 'Saving…' : 'Save changes'}</Button></form></CardContent></Card><Card><CardHeader><CardTitle>Domains</CardTitle></CardHeader><CardContent className="space-y-4"><div className="space-y-2">{site.domains.map((domain) => <div key={domain.id} className="flex items-center gap-2 rounded-lg border p-3 text-sm"><Globe2 className="size-4 text-muted-foreground" /><span className="min-w-0 flex-1 truncate">{domain.hostname}</span>{domain.isPrimary && <StatusBadge status="active" label="Primary" />}</div>)}</div><form onSubmit={addDomain} className="flex gap-2"><Input value={hostname} onChange={(event) => setHostname(event.target.value)} placeholder="www.example.com" type="text" required /><Button type="submit" size="icon" aria-label="Add domain"><Plus /></Button></form></CardContent></Card></div></PageContainer>;
}