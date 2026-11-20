import { apiFetch, apiJson } from './client';
export type EmailSender = { id: string; name: string; emailAddress: string; replyTo?: string | null; status: string };
export type EmailTemplate = { id: string; name: string; slug: string; subject: string; htmlBody: string; variables?: unknown; status: string };
export type EmailMessage = { id: string; recipient: string; subject: string; status: string; error?: string | null; createdAt: string; sentAt?: string | null; sender?: EmailSender | null; template?: EmailTemplate | null };
export const emailApi = {
  senders: (siteId: string) => apiFetch<EmailSender[]>(`/email/senders?siteId=${encodeURIComponent(siteId)}`),
  templates: (siteId: string) => apiFetch<EmailTemplate[]>(`/email/templates?siteId=${encodeURIComponent(siteId)}`),
  history: (siteId: string) => apiFetch<EmailMessage[]>(`/email/history?siteId=${encodeURIComponent(siteId)}`),
  send: (input: Record<string, unknown>) => apiJson<EmailMessage>('/email/send', 'POST', input),
  createSender: (input: Record<string, unknown>) => apiJson<EmailSender>('/email/senders', 'POST', input),
  createTemplate: (input: Record<string, unknown>) => apiJson<EmailTemplate>('/email/templates', 'POST', input),
};