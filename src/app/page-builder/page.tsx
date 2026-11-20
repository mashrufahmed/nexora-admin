'use client';

import { PageContainer, PageHeader } from '@/components/ui/ui-bits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { sitesApi } from '@/lib/api/sites';
import { pageTemplatesApi, type PageTemplate } from '@/lib/api/page-templates';
import { PuckEditor } from './puck-editor';
import { useQuery } from '@tanstack/react-query';
import { LayoutTemplate, Plus } from 'lucide-react';
import { useState } from 'react';

export default function PageBuilderPage() {
  const [siteId, setSiteId] = useState('');
  const [editing, setEditing] = useState<PageTemplate | null>(null);
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const templates = useQuery({ queryKey: ['page-templates', siteId], queryFn: () => pageTemplatesApi.list(siteId), enabled: Boolean(siteId) });
  const selectedSite = sites.data?.find((site) => site.id === siteId);
  const newTemplate = () => setEditing({ id: '', siteId, name: '', type: 'page', status: 'DRAFT', currentRevisionId: null, revisions: [] });

  return <PageContainer className="space-y-6 pb-10">
    <PageHeader title="Page builder" description="Compose reusable pages with a controlled component library." actions={<Button disabled={!siteId} onClick={newTemplate}><Plus /> New template</Button>} />
    <Card className="max-w-xl"><CardHeader><CardTitle className="text-base">Choose a site</CardTitle></CardHeader><CardContent><Label htmlFor="builder-site">Site</Label><select id="builder-site" value={siteId} onChange={(event) => { setSiteId(event.target.value); setEditing(null); }} className="mt-2 h-9 w-full rounded-lg border bg-background px-3 text-sm"><option value="">Select a site</option>{(sites.data ?? []).map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}</select></CardContent></Card>
    {siteId && !editing && <div className="grid gap-4 md:grid-cols-2">{(templates.data ?? []).map((template) => <Card key={template.id}><CardHeader><CardTitle className="text-base">{template.name}</CardTitle><p className="text-sm text-muted-foreground">{template.type} · {template.status.toLowerCase()} · revision {template.revisions[0]?.revisionNumber ?? 0}</p></CardHeader><CardContent><Button variant="outline" onClick={() => setEditing(template)}>Open editor</Button></CardContent></Card>)}{templates.data?.length === 0 && <Card className="md:col-span-2"><CardContent className="flex flex-col items-center gap-3 py-16 text-center"><LayoutTemplate className="size-8 text-muted-foreground" /><p className="font-medium">No templates for {selectedSite?.name ?? 'this site'}</p><Button onClick={newTemplate}><Plus /> Create the first template</Button></CardContent></Card>}</div>}
    {editing && <PuckEditor template={editing} onClose={() => setEditing(null)} />}
  </PageContainer>;
}