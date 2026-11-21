'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EmptyState,
  PageContainer,
  PageHeader,
  StatusBadge,
} from '@/components/ui/ui-bits';
import { p1Api } from '@/lib/api/p1';
import { sitesApi } from '@/lib/api/sites';
import { useQuery } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { useState } from 'react';
export default function NewsletterPage() {
  const [siteId, setSiteId] = useState('');
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const list = useQuery({
    queryKey: ['newsletter', siteId],
    queryFn: () => p1Api.subscribers(siteId),
    enabled: !!siteId,
  });
  return (
    <PageContainer>
      <PageHeader
        title="Newsletter"
        description="Review subscriber status and double opt-in history."
      />
      <div className="mb-5 w-full max-w-sm">
        <Select
          value={siteId}
          onValueChange={(value) => setSiteId(value ?? '')}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a site" />
          </SelectTrigger>
          <SelectContent>
            {(sites.data ?? []).map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {siteId && (list.data ?? []).length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No subscribers"
          description="Subscribers will appear after signup."
        />
      ) : (
        siteId && (
          <div className="space-y-2">
            {(list.data ?? []).map((s) => (
              <Card key={s.id}>
                <CardContent className="flex items-center gap-3 p-4">
                  <Mail className="size-4 text-primary" />
                  <span className="flex-1 text-sm">{s.email}</span>
                  <StatusBadge status={s.status.toLowerCase()} />
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}
    </PageContainer>
  );
}
