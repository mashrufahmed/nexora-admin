import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Inbox, AlertTriangle, Trophy, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/* ---------- Layout ---------- */

export function PageHeader({ title, description, actions, children }: { title: string; description?: string; actions?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

/* ---------- Status ---------- */

type Tone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";
const toneCls: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary/10 text-primary border-primary/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/25",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
};

const statusTone: Record<string, Tone> = {
  active: "success", published: "success", connected: "success", paid: "success", in_stock: "success", imported: "success", accepted: "success", verified: "success", ok: "success",
  draft: "neutral", archived: "neutral", disabled: "neutral", revoked: "neutral", ended: "neutral", expired: "neutral", not_connected: "neutral", discontinued: "neutral",
  in_review: "info", scheduled: "primary", approved: "primary", processing: "info", invited: "info", pre_order: "info",
  changes_requested: "warning", pending: "warning", paused: "warning", open: "warning",
  error: "danger", failed: "danger", out_of_stock: "danger", suspended: "danger", disconnected: "danger",
};

export const statusLabel = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export function StatusBadge({ status, label, tone }: { status: string; label?: string; tone?: Tone }) {
  const t = tone ?? statusTone[status] ?? "neutral";
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium", toneCls[t])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label ?? statusLabel(status)}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number | null }) {
  if (score == null) return <span className="text-xs text-muted-foreground">Unscored</span>;
  const tone: Tone = score >= 9 ? "success" : score >= 8 ? "primary" : score >= 7 ? "warning" : "danger";
  return <span className={cn("inline-flex min-w-10 justify-center rounded-md border px-1.5 py-0.5 text-xs font-semibold tabular-nums", toneCls[tone])}>{score.toFixed(1)}</span>;
}

export function AwardBadge({ name }: { name: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium", toneCls.warning)}>
      <Trophy className="size-3" aria-hidden /> {name}
    </span>
  );
}

/* ---------- Avatars ---------- */

export function ColorAvatar({ name, color, size = "md", square }: { name: string; color: string; size?: "sm" | "md" | "lg"; square?: boolean }) {
  const s = size === "sm" ? "size-6 text-[10px]" : size === "lg" ? "size-12 text-base" : "size-8 text-xs";
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center font-semibold text-primary-foreground", s, square ? "rounded-md" : "rounded-full")}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

export function ProductImage({ color, size = "md" }: { color: string; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "size-8" : size === "lg" ? "size-24" : "size-10";
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-md border", s)} style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}>
      <Package className="size-1/2" style={{ color }} aria-hidden />
    </span>
  );
}

/* ---------- Metrics ---------- */

export function MetricCard({ label, value, delta, icon: Icon, hint }: { label: string; value: string; delta?: number; icon?: LucideIcon; hint?: string }) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {Icon && <Icon className="size-4 text-muted-foreground" aria-hidden />}
        </div>
        <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          {delta !== undefined && (
            <span className={cn("inline-flex items-center font-medium", up ? "text-success" : "text-destructive")}>
              {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartCard({ title, description, action, children, className }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/* ---------- States ---------- */

export function EmptyState({ icon: Icon = Inbox, title, description, action }: { icon?: LucideIcon; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted"><Icon className="size-5 text-muted-foreground" aria-hidden /></div>
      <p className="font-medium">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <EmptyState icon={AlertTriangle} title={title} description={description} action={onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>} />
  );
}

export function LoadingSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-11 w-full" />)}
    </div>
  );
}

export function KeyValue({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}

export function MockNotice({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-start gap-2 rounded-lg border border-info/25 bg-info/5 px-4 py-3 text-sm text-foreground">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
      <div>{children}</div>
    </div>
  );
}
