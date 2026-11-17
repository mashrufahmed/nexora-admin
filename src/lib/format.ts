import { format, formatDistanceToNowStrict, parseISO } from "date-fns";

export const fmtDate = (iso: string | null | undefined) =>
  iso ? format(parseISO(iso), "MMM d, yyyy") : "—";
export const fmtDateTime = (iso: string | null | undefined) =>
  iso ? format(parseISO(iso), "MMM d, yyyy · HH:mm") : "—";
export const fmtAgo = (iso: string | null | undefined) =>
  iso ? `${formatDistanceToNowStrict(parseISO(iso))} ago` : "—";
export const fmtNum = (n: number) => new Intl.NumberFormat("en-US").format(n);
export const fmtCompact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
export const fmtMoney = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
