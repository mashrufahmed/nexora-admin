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
  StatusBadge,
} from '@/components/ui/ui-bits';
import { ApiError } from '@/lib/api/client';
import { emailApi } from '@/lib/api/email';
import { sitesApi } from '@/lib/api/sites';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, RefreshCw, Send } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function EmailPage() {
  const [siteId, setSiteId] = useState('');
  const [error, setError] = useState('');
  const [historyFilter, setHistoryFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Awaited<ReturnType<typeof emailApi.history>>[number] | null>(null);
  const client = useQueryClient();
  const sites = useQuery({ queryKey: ['sites'], queryFn: sitesApi.list });
  const templates = useQuery({
    queryKey: ['email-templates', siteId],
    queryFn: () => emailApi.templates(siteId),
    enabled: Boolean(siteId),
  });
  const senders = useQuery({
    queryKey: ['email-senders', siteId],
    queryFn: () => emailApi.senders(siteId),
    enabled: Boolean(siteId),
  });
  const history = useQuery({
    queryKey: ['email-history', siteId],
    queryFn: () => emailApi.history(siteId),
    enabled: Boolean(siteId),
  });
  const send = useMutation({
    mutationFn: emailApi.send,
    onSuccess: () => {
      setError('');
      void client.invalidateQueries({ queryKey: ['email-history', siteId] });
    },
    onError: (cause) =>
      setError(
        cause instanceof ApiError ? cause.message : 'Unable to queue email',
      ),
  });
  return (
    <PageContainer>
      <PageHeader
        title="Email"
        description="Compose messages, use validated templates and track delivery history."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => void history.refetch()}
            disabled={!siteId}
          >
            <RefreshCw /> Refresh
          </Button>
        }
      />
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}
      <div className="mb-5">
        <Select value={siteId || 'none'} onValueChange={(value) => setSiteId(!value || value === 'none' ? '' : value)}>
          <SelectTrigger className="w-full max-w-xs"><SelectValue placeholder="Choose a site" /></SelectTrigger>
          <SelectContent><SelectItem value="none">Choose a site</SelectItem>
          {(sites.data ?? []).map((site) => (
            <SelectItem key={site.id} value={site.id}>
              {site.name}
            </SelectItem>
          ))}
          </SelectContent>
        </Select>
      </div>
      {!siteId ? (
        <EmptyState
          icon={Mail}
          title="Choose a site to begin"
          description="Email sending and history are isolated per site."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,420px)_1fr]">
          <ComposeCard
            siteId={siteId}
            templates={templates.data ?? []}
            senders={senders.data ?? []}
            pending={send.isPending}
            onSend={(input) => send.mutate(input)}
          />
          <Card>
            <CardHeader>
              <CardTitle>Delivery history</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={historyFilter}
                onChange={(event) => setHistoryFilter(event.target.value)}
                placeholder="Filter recipient or subject"
                className="mb-3"
                aria-label="Filter delivery history"
              />
              {history.isLoading ? (
                <LoadingSkeleton rows={5} />
              ) : (history.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No messages yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {history.data!.filter((message) => {
                    const query = historyFilter.toLowerCase();
                    return !query || message.recipient.toLowerCase().includes(query) || message.subject.toLowerCase().includes(query) || message.status.toLowerCase().includes(query);
                  }).map((message) => (
                    <div
                      key={message.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedMessage(message)}
                      onKeyDown={(event) => event.key === 'Enter' && setSelectedMessage(message)}
                      className="flex cursor-pointer flex-col gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {message.recipient}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {message.subject}
                        </p>
                      </div>
                      <StatusBadge status={message.status.toLowerCase()} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Dialog open={Boolean(selectedMessage)} onOpenChange={(open) => !open && setSelectedMessage(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Email delivery details</DialogTitle>
                <DialogDescription>{selectedMessage?.recipient} · {selectedMessage?.status}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Subject</p><p className="font-medium">{selectedMessage?.subject}</p></div>
                <div><p className="text-xs text-muted-foreground">Queued</p><p>{selectedMessage && new Date(selectedMessage.createdAt).toLocaleString()}</p></div>
                {selectedMessage?.sentAt && <div><p className="text-xs text-muted-foreground">Sent</p><p>{new Date(selectedMessage.sentAt).toLocaleString()}</p></div>}
                {selectedMessage?.error && <div className="rounded-lg bg-destructive/10 p-3 text-destructive"><p className="text-xs font-medium">Delivery error</p><p>{selectedMessage.error}</p></div>}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </PageContainer>
  );
}

function ComposeCard({
  siteId,
  templates,
  senders,
  pending,
  onSend,
}: {
  siteId: string;
  templates: Array<{ id: string; name: string; subject: string }>;
  senders: Array<{ id: string; name: string; emailAddress: string }>;
  pending: boolean;
  onSend: (input: Record<string, unknown>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose email</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            onSend({
              siteId,
              recipient: String(form.get('recipient')),
              subject: String(form.get('subject')),
              htmlBody: String(form.get('htmlBody')),
              senderId: String(form.get('senderId') || '') || undefined,
              templateId: String(form.get('templateId') || '') || undefined,
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input id="recipient" name="recipient" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderId">Sender</Label>
            <Select name="senderId" defaultValue="none">
              <SelectTrigger id="senderId" className="w-full"><SelectValue placeholder="Default sender" /></SelectTrigger><SelectContent><SelectItem value="none">Default sender</SelectItem>
              {senders.map((sender) => (
                <SelectItem key={sender.id} value={sender.id}>
                  {sender.name} ({sender.emailAddress})
                </SelectItem>
              ))}
              </SelectContent></Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="templateId">Template</Label>
            <Select name="templateId" defaultValue="none">
              <SelectTrigger id="templateId" className="w-full"><SelectValue placeholder="Custom message" /></SelectTrigger><SelectContent><SelectItem value="none">Custom message</SelectItem>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
              </SelectContent></Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="htmlBody">HTML body</Label>
            <Textarea id="htmlBody" name="htmlBody" rows={7} required />
          </div>
          <Button type="submit" disabled={pending}>
            <Send /> {pending ? 'Queueing…' : 'Queue email'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
