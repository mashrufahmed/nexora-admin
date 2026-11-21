'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  EmptyState,
  LoadingSkeleton,
  PageContainer,
  PageHeader,
} from '@/components/ui/ui-bits';
import { authorsApi, type Author } from '@/lib/api/authors';
import { ApiError } from '@/lib/api/client';
import { sitesApi } from '@/lib/api/sites';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PenLine, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AuthorsPage() {
  const [siteId, setSiteId] = useState('');
  const [editing, setEditing] = useState<Author | null>(null);
  const [error, setError] = useState('');
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const authors = useQuery({
    queryKey: ['authors', siteId],
    queryFn: () => authorsApi.list(siteId || undefined),
  });
  const client = useQueryClient();
  const save = useMutation({
    mutationFn: (input: {
      siteId?: string;
      name: string;
      slug: string;
      bio?: string;
      shortBio?: string;
      designation?: string;
      website?: string;
      email?: string;
    }) =>
      editing ? authorsApi.update(editing.id, input) : authorsApi.create(input),
    onSuccess: () => {
      setEditing(null);
      void client.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (cause) =>
      setError(
        cause instanceof ApiError ? cause.message : 'Unable to save author',
      ),
  });
  const remove = useMutation({
    mutationFn: authorsApi.remove,
    onSuccess: () => void client.invalidateQueries({ queryKey: ['authors'] }),
    onError: (cause) =>
      setError(
        cause instanceof ApiError ? cause.message : 'Unable to delete author',
      ),
  });
  return (
    <PageContainer>
      <PageHeader
        title="Authors"
        description="Manage the people behind your editorial work."
        actions={
          <Button
            onClick={() =>
              setEditing({
                id: '',
                siteId: siteId || null,
                name: '',
                slug: '',
                bio: null,
                shortBio: null,
                designation: null,
                website: null,
                email: null,
                status: 'ACTIVE',
              })
            }
          >
            <Plus /> New author
          </Button>
        }
      />
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}
      <div className="mb-5 max-w-md space-y-2">
        <Label htmlFor="author-site">Site</Label>
        <Select value={siteId || 'all'} onValueChange={(value) => setSiteId(!value || value === 'all' ? '' : value)}>
          <SelectTrigger id="author-site" className="w-full"><SelectValue placeholder="All accessible sites" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All accessible sites</SelectItem>
          {(sites.data ?? []).map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </div>
      {authors.isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : (authors.data ?? []).length === 0 ? (
        <EmptyState
          icon={PenLine}
          title="No authors yet"
          description="Create an author to credit your editorial work."
          action={
            <Button
              onClick={() =>
                setEditing({
                  id: '',
                  siteId: siteId || null,
                  name: '',
                  slug: '',
                  bio: null,
                  shortBio: null,
                  designation: null,
                  website: null,
                  email: null,
                  status: 'ACTIVE',
                })
              }
            >
              <Plus /> Create author
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(authors.data ?? []).map((author) => (
            <Card key={author.id}>
              <CardHeader>
                <CardTitle className="text-base">{author.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  /{author.slug}
                  {author.designation ? ` · ${author.designation}` : ''}
                </p>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(author)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Delete this author?'))
                      remove.mutate(author.id);
                  }}
                >
                  <Trash2 /> Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {editing && (
        <AuthorForm
          author={editing}
          defaultSiteId={siteId}
          saving={save.isPending}
          onCancel={() => setEditing(null)}
          onSave={(input) => save.mutate(input)}
        />
      )}
    </PageContainer>
  );
}

function AuthorForm({
  author,
  defaultSiteId,
  saving,
  onCancel,
  onSave,
}: {
  author: Author;
  defaultSiteId: string;
  saving: boolean;
  onCancel: () => void;
  onSave: (input: {
    siteId?: string;
    name: string;
    slug: string;
    bio?: string;
    shortBio?: string;
    designation?: string;
    website?: string;
    email?: string;
  }) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="max-h-[90vh] w-full max-w-xl overflow-auto">
        <CardHeader>
          <CardTitle>{author.id ? 'Edit author' : 'New author'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              onSave({
                siteId: (author.siteId ?? defaultSiteId) || undefined,
                name: String(form.get('name')),
                slug: String(form.get('slug')),
                designation: String(form.get('designation') || ''),
                email: String(form.get('email') || ''),
                website: String(form.get('website') || ''),
                shortBio: String(form.get('shortBio') || ''),
                bio: String(form.get('bio') || ''),
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={author.name}
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={author.slug}
                required
                minLength={2}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="designation"
                placeholder="Designation"
                defaultValue={author.designation ?? ''}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                defaultValue={author.email ?? ''}
              />
            </div>
            <Input
              name="website"
              placeholder="Website"
              defaultValue={author.website ?? ''}
            />
            <Input
              name="shortBio"
              placeholder="Short bio"
              defaultValue={author.shortBio ?? ''}
            />
            <Textarea
              name="bio"
              placeholder="Biography"
              defaultValue={author.bio ?? ''}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save author'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
