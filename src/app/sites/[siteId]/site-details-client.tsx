'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LoadingSkeleton,
  PageContainer,
  PageHeader,
  StatusBadge,
} from '@/components/ui/ui-bits';
import { ApiError } from '@/lib/api/client';
import { sitesApi, type Site } from '@/lib/api/sites';
import {
  ArrowLeft,
  Copy,
  Globe2,
  KeyRound,
  Pause,
  Play,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SiteDetailsClient({ siteId }: { siteId: string }) {
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [hostname, setHostname] = useState('');
  const [secret, setSecret] = useState<string | null>(null);
  const [secretId, setSecretId] = useState<string | null>(null);
  const [secretBusy, setSecretBusy] = useState(false);
  useEffect(() => {
    sitesApi
      .get(siteId)
      .then(setSite)
      .catch((cause) =>
        setError(
          cause instanceof ApiError ? cause.message : 'Unable to load site',
        ),
      )
      .finally(() => setLoading(false));
  }, [siteId]);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!site) return;
    setSaving(true);
    try {
      const updated = await sitesApi.update(site.id, {
        name: site.name,
        slug: site.slug,
      });
      setSite(updated);
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : 'Unable to update site',
      );
    } finally {
      setSaving(false);
    }
  }
  async function toggleStatus() {
    if (!site) return;
    setSaving(true);
    setError('');
    try {
      const updated = await sitesApi.update(site.id, {
        status: site.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
      setSite(updated);
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : 'Unable to update site status',
      );
    } finally {
      setSaving(false);
    }
  }
  async function addDomain(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!site || !hostname.trim()) return;
    try {
      const domain = await sitesApi.addDomain(
        site.id,
        hostname.trim(),
        site.domains.length === 0,
      );
      setSite({ ...site, domains: [...(site.domains ?? []), domain] });
      setHostname('');
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : 'Unable to add domain',
      );
    }
  }
  async function createSecret() {
    if (!site) return;
    setSecretBusy(true);
    setError('');
    try {
      const result = await sitesApi.createSecret(site.id);
      setSecret(result.secret);
      setSecretId(result.id);
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : 'Unable to create site key',
      );
    } finally {
      setSecretBusy(false);
    }
  }
  async function revokeSecret() {
    if (
      !site ||
      !secretId ||
      !window.confirm(
        'Revoke this site key? Public requests using it will stop working.',
      )
    )
      return;
    setSecretBusy(true);
    try {
      await sitesApi.revokeSecret(site.id, secretId);
      setSecret(null);
      setSecretId(null);
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : 'Unable to revoke site key',
      );
    } finally {
      setSecretBusy(false);
    }
  }
  if (loading)
    return (
      <PageContainer>
        <LoadingSkeleton rows={6} />
      </PageContainer>
    );
  if (!site)
    return (
      <PageContainer>
        <div role="alert" className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error || 'Site not found'}
        </div>
      </PageContainer>
    );
  const domains = site.domains ?? [];
  return (
    <PageContainer>
      <Button
        variant="ghost"
        size="sm"
        className="mb-5"
        render={<Link href="/sites" />}
      >
        <ArrowLeft /> All sites
      </Button>
      <PageHeader
        title={site.name}
        description={`Manage ${site.slug} and its publishing configuration.`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={site.status.toLowerCase()} />
            <Button
              size="sm"
              variant={site.status === 'ACTIVE' ? 'outline' : 'default'}
              onClick={() => void toggleStatus()}
              disabled={saving}
            >
              {site.status === 'ACTIVE' ? (
                <>
                  <Pause /> Deactivate
                </>
              ) : (
                <>
                  <Play /> Activate
                </>
              )}
            </Button>
          </div>
        }
      />
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Site details</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Update the identity used across your publishing workflow.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={site.name}
                  onChange={(event) =>
                    setSite({ ...site, name: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={site.slug}
                  onChange={(event) =>
                    setSite({ ...site, slug: event.target.value })
                  }
                />
              </div>
              <Button type="submit" disabled={saving}>
                <Save /> {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Domains</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect the hostnames that should resolve to this property.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {domains.length === 0 ? (
                <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                  No domains connected yet.
                </p>
              ) : (
                domains.map((domain) => (
                  <div
                    key={domain.id}
                    className="flex items-center gap-2 rounded-md border border-border/70 bg-muted/20 p-3 text-sm"
                  >
                    <Globe2 className="size-4 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">
                      {domain.hostname}
                    </span>
                    {domain.isPrimary && (
                      <StatusBadge status="active" label="Primary" />
                    )}
                  </div>
                ))
              )}
            </div>
            <form onSubmit={addDomain} className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={hostname}
                onChange={(event) => setHostname(event.target.value)}
                placeholder="www.example.com"
                type="text"
                required
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0"
                aria-label="Add domain"
              >
                <Plus />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Site key</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Use a key to authenticate public requests for this property.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {secret ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input readOnly value={secret} />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => void navigator.clipboard.writeText(secret)}
                aria-label="Copy site key"
              >
                <Copy />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => void revokeSecret()}
                disabled={secretBusy}
              >
                <Trash2 /> Revoke
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => void createSecret()}
              disabled={secretBusy}
            >
              <KeyRound /> {secretBusy ? 'Generating…' : 'Generate site key'}
            </Button>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
