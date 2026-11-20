'use client';

import { PageContainer, PageHeader, StatusBadge, EmptyState, LoadingSkeleton } from '@/components/ui/ui-bits';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { sitesApi, type Site } from '@/lib/api/sites';
import { ApiError } from '@/lib/api/client';
import { ArrowUpRight, Globe2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() { setLoading(true); setError(''); try { setSites(await sitesApi.list()); } catch (cause) { setError(cause instanceof ApiError ? cause.message : 'Unable to load sites'); } finally { setLoading(false); } }
  // Initial data loading synchronizes this client component with the API.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => sites.filter((site) => `${site.name} ${site.slug}`.toLowerCase().includes(query.toLowerCase())), [query, sites]);
  async function createSite(event: React.FormEvent) { event.preventDefault(); setSaving(true); setError(''); try { const created = await sitesApi.create({ name: name.trim(), slug: slug.trim().toLowerCase() }); setSites((current) => [created, ...current]); setOpen(false); setName(''); setSlug(''); } catch (cause) { setError(cause instanceof ApiError ? cause.message : 'Unable to create site'); } finally { setSaving(false); } }
  async function removeSite(id: string) { if (!window.confirm('Delete this site? This cannot be undone.')) return; try { await sitesApi.remove(id); setSites((current) => current.filter((site) => site.id !== id)); } catch (cause) { setError(cause instanceof ApiError ? cause.message : 'Unable to delete site'); } }

  return <PageContainer>
    <PageHeader title="Sites" description="Manage the properties that power your publishing network." actions={<><Button variant="outline" size="sm" onClick={() => void load()}><RefreshCw /> Refresh</Button><Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button><Plus /> New site</Button>} /></Dialog></>} />
    {error && <div role="alert" className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
    <div className="mb-5 flex max-w-md items-center gap-2 rounded-lg border bg-card px-3"><Search className="size-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sites…" className="border-0 bg-transparent shadow-none focus-visible:ring-0" /></div>
    {loading ? <LoadingSkeleton rows={5} /> : filtered.length === 0 ? <EmptyState icon={Globe2} title={query ? 'No sites match your search' : 'No sites yet'} description="Create your first property to start publishing." action={<Button onClick={() => setOpen(true)}><Plus /> Create site</Button>} /> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((site) => <Card key={site.id} className="group transition-shadow hover:shadow-md"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Globe2 className="size-5" /></span><StatusBadge status={site.status.toLowerCase()} /></div><h2 className="mt-5 truncate text-lg font-semibold">{site.name}</h2><p className="mt-1 truncate text-sm text-muted-foreground">{site.slug}</p><div className="mt-5 grid grid-cols-2 gap-3 border-y py-3 text-sm"><div><span className="block text-xs text-muted-foreground">Domains</span><span className="mt-1 block font-medium">{site.domains.length}</span></div><div><span className="block text-xs text-muted-foreground">Created</span><span className="mt-1 block font-medium">{new Date(site.createdAt).toLocaleDateString()}</span></div></div><div className="mt-4 flex items-center gap-2"><Button className="flex-1" size="sm" onClick={() => window.location.href = `/sites/${site.id}`}>Open site <ArrowUpRight /></Button><Button variant="ghost" size="icon-sm" aria-label={`Delete ${site.name}`} onClick={() => void removeSite(site.id)}><Trash2 /></Button></div></CardContent></Card>)}</div>}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>Create a site</DialogTitle><DialogDescription>Add a new publishing property to your Nexora network.</DialogDescription></DialogHeader><form onSubmit={createSite} className="space-y-4"><div className="space-y-2"><Label htmlFor="site-name">Name</Label><Input id="site-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="TechSift" minLength={2} required /></div><div className="space-y-2"><Label htmlFor="site-slug">Slug</Label><Input id="site-slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="techsift" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" minLength={2} required /><p className="text-xs text-muted-foreground">Lowercase letters, numbers and hyphens only.</p></div><DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create site'}</Button></DialogFooter></form></DialogContent></Dialog>
  </PageContainer>;
}