import type {
  ActivityItem,
  ApiKey,
  AppNotification,
  AuditLog,
  Integration,
  Invoice,
  Invitation,
  MediaItem,
  Redirect,
  Role,
  SeoIssue,
  TrafficDatum,
  Webhook,
} from "./types";

export const mediaItems: MediaItem[] = [
  { id: "md1", name: "sonivo-studio-hero.jpg", type: "image", sizeKb: 842, width: 2400, height: 1600, uploadedAt: "2026-10-17T09:00:00Z", alt: "Sonivo Studio ANC headphones on a studio backdrop", caption: "Hero shot for the ANC roundup", folder: "Reviews/Audio", color: "#4F46E5" },
  { id: "md2", name: "nordica-slim-14-lifestyle.jpg", type: "image", sizeKb: 1240, width: 3000, height: 2000, uploadedAt: "2026-10-23T14:20:00Z", alt: "Nordica Slim 14 open on a desk", caption: "Lifestyle for review header", folder: "Reviews/Laptops", color: "#0EA5E9" },
  { id: "md3", name: "atlas-washer-install.pdf", type: "document", sizeKb: 560, width: null, height: null, uploadedAt: "2026-09-14T11:00:00Z", alt: "", caption: "Install guide reference", folder: "Docs", color: "#F59E0B" },
  { id: "md4", name: "brew-pro-espresso-shot.jpg", type: "image", sizeKb: 980, width: 2800, height: 1867, uploadedAt: "2026-10-24T16:40:00Z", alt: "Espresso extraction on the Brew Pro", caption: "Extraction sequence frame 4", folder: "Reviews/Coffee", color: "#EC4899" },
  { id: "md5", name: "trailkit-hero-tent.jpg", type: "image", sizeKb: 1520, width: 3200, height: 1800, uploadedAt: "2026-10-08T07:30:00Z", alt: "Cirrus 2P tent pitched at dusk", caption: "Dusk hero for tent review", folder: "Reviews/Outdoor", color: "#14B8A6" },
  { id: "md6", name: " ANC-attenuation-chart.png", type: "image", sizeKb: 210, width: 1200, height: 800, uploadedAt: "2026-10-18T10:00:00Z", alt: "Measured attenuation across 1kHz sweep", caption: "Lab chart — ANC roundup", folder: "Charts", color: "#6366F1" },
  { id: "md7", name: "doorbell-night-footage.mp4", type: "video", sizeKb: 18600, width: 1920, height: 1080, uploadedAt: "2026-11-02T20:00:00Z", alt: "", caption: "Night HDR comparison clip", folder: "Reviews/Smart Home", color: "#10B981" },
  { id: "md8", name: "washer-stain-strips.jpg", type: "image", sizeKb: 640, width: 2000, height: 1500, uploadedAt: "2026-09-30T09:00:00Z", alt: "Stain strips after cold wash cycle", caption: "Stain results grid", folder: "Charts", color: "#D97706" },
  { id: "md9", name: "team-photo-2026.jpg", type: "image", sizeKb: 3200, width: 4000, height: 2600, uploadedAt: "2026-08-30T15:00:00Z", alt: "The Northbridge editorial team", caption: "About page photo", folder: "Company", color: "#8B5CF6" },
  { id: "md10", name: "pack-torso-fit-guide.pdf", type: "document", sizeKb: 720, width: null, height: null, uploadedAt: "2026-11-03T17:00:00Z", alt: "", caption: "Fit guide illustrations", folder: "Docs", color: "#64748B" },
  { id: "md11", name: "air-fryer-energy-graph.png", type: "image", sizeKb: 180, width: 1200, height: 800, uploadedAt: "2026-11-04T09:40:00Z", alt: "Energy draw comparison graph", caption: "Basket vs oven energy", folder: "Charts", color: "#059669" },
  { id: "md12", name: "hub-mini-unboxing.mp4", type: "video", sizeKb: 24800, width: 1920, height: 1080, uploadedAt: "2026-10-29T13:00:00Z", alt: "", caption: "Hub Mini unboxing b-roll", folder: "Reviews/Smart Home", color: "#047857" },
];

export const redirects: Redirect[] = [
  { id: "rd1", siteId: "s1", sourceUrl: "/old-headphone-guide", destinationUrl: "/best-noise-cancelling-headphones-2026", statusCode: 301, active: true, hits: 12400, createdAt: "2026-10-18T00:00:00Z" },
  { id: "rd2", siteId: "s1", sourceUrl: "/reviews/best-laptops-2025", destinationUrl: "/best-laptops", statusCode: 301, active: true, hits: 8600, createdAt: "2026-09-01T00:00:00Z" },
  { id: "rd3", siteId: "s2", sourceUrl: "/washer-reviews", destinationUrl: "/best-washers-large-families", statusCode: 301, active: true, hits: 4200, createdAt: "2026-10-02T00:00:00Z" },
  { id: "rd4", siteId: "s3", sourceUrl: "/tent-reviews-2025", destinationUrl: "/best-ultralight-tents-2026", statusCode: 301, active: true, hits: 3100, createdAt: "2026-11-02T00:00:00Z" },
  { id: "rd5", siteId: "s5", sourceUrl: "/*", destinationUrl: "https://techsift.io/lens-reviews", statusCode: 301, active: true, hits: 6600, createdAt: "2026-06-30T00:00:00Z" },
  { id: "rd6", siteId: "s1", sourceUrl: "/audio/news", destinationUrl: "/news", statusCode: 302, active: false, hits: 240, createdAt: "2026-07-15T00:00:00Z" },
];

export const seoIssues: SeoIssue[] = [
  { id: "si1", siteId: "s1", type: "missing_description", resource: "/multipoint-bluetooth-2026", detail: "Meta description is empty — Google will generate its own snippet.", detectedAt: "2026-11-04T02:00:00Z" },
  { id: "si2", siteId: "s1", type: "missing_alt", resource: "ANC-attenuation-chart.png", detail: "Image missing alt text; used on 3 published pages.", detectedAt: "2026-11-04T02:00:00Z" },
  { id: "si3", siteId: "s2", type: "missing_title", resource: "/kitchen/small-appliances", detail: "Category page has no meta title.", detectedAt: "2026-11-04T02:00:00Z" },
  { id: "si4", siteId: "s2", type: "duplicate_title", resource: "/best-espresso-machines + /espresso-reviews", detail: "Two pages share the title 'Best Espresso Machines'.", detectedAt: "2026-11-04T02:00:00Z" },
  { id: "si5", siteId: "s3", type: "broken_link", resource: "/how-to-choose-backpacking-pack", detail: "Outbound link to summitshop.com/fit-guide returns 404.", detectedAt: "2026-11-03T02:00:00Z" },
  { id: "si6", siteId: "s4", type: "missing_description", resource: "/pm-software", detail: "Category page missing meta description.", detectedAt: "2026-11-01T02:00:00Z" },
  { id: "si7", siteId: "s1", type: "missing_alt", resource: "hub-mini-unboxing.mp4 poster", detail: "Video poster image lacks alt text.", detectedAt: "2026-11-03T02:00:00Z" },
  { id: "si8", siteId: "s3", type: "missing_title", resource: "/gear-lists", detail: "Gear list index has a placeholder title.", detectedAt: "2026-11-02T02:00:00Z" },
];

export const roles: Role[] = [
  {
    id: "rl1", name: "Owner", description: "Full control including billing and organization settings.", memberCount: 1, system: true,
    permissions: { Sites: ["view", "create", "edit", "delete", "publish"], Content: ["view", "create", "edit", "delete", "publish", "approve"], Catalog: ["view", "create", "edit", "delete"], Reviews: ["view", "create", "edit", "delete", "approve"], Affiliate: ["view", "edit", "delete"], Analytics: ["view", "export"], Team: ["view", "invite", "edit", "remove"], Platform: ["manage"] },
  },
  {
    id: "rl2", name: "Admin", description: "Manages sites, content and team without billing access.", memberCount: 1, system: true,
    permissions: { Sites: ["view", "create", "edit", "delete", "publish"], Content: ["view", "create", "edit", "delete", "publish", "approve"], Catalog: ["view", "create", "edit", "delete"], Reviews: ["view", "create", "edit", "delete", "approve"], Affiliate: ["view", "edit"], Analytics: ["view", "export"], Team: ["view", "invite", "edit"], Platform: ["manage"] },
  },
  {
    id: "rl3", name: "Editor", description: "Edits and publishes content across assigned sites.", memberCount: 2, system: true,
    permissions: { Sites: ["view", "edit"], Content: ["view", "create", "edit", "publish", "approve"], Catalog: ["view", "edit"], Reviews: ["view", "edit", "approve"], Affiliate: ["view"], Analytics: ["view", "export"], Team: ["view"], Platform: [] },
  },
  {
    id: "rl4", name: "Reviewer", description: "Runs product testing and completes review scores.", memberCount: 1, system: true,
    permissions: { Sites: ["view"], Content: ["view", "edit"], Catalog: ["view", "edit"], Reviews: ["view", "create", "edit", "approve"], Affiliate: ["view"], Analytics: ["view"], Platform: [] },
  },
  {
    id: "rl5", name: "Author", description: "Writes and submits drafts for review.", memberCount: 2, system: true,
    permissions: { Sites: ["view"], Content: ["view", "create", "edit"], Catalog: ["view"], Reviews: ["view", "create", "edit"], Affiliate: [], Analytics: ["view"], Platform: [] },
  },
  {
    id: "rl6", name: "Analyst", description: "Read-only access to analytics and affiliate reporting.", memberCount: 1, system: true,
    permissions: { Sites: ["view"], Content: ["view"], Catalog: ["view"], Reviews: ["view"], Affiliate: ["view"], Analytics: ["view", "export"], Platform: [] },
  },
];

export const invitations: Invitation[] = [
  { id: "in1", email: "nadia.khan@northbridge.io", role: "Editor", status: "pending", sentAt: "2026-11-01T09:00:00Z", expiresAt: "2026-11-08T09:00:00Z" },
  { id: "in2", email: "felix@trailtests.com", role: "Reviewer", status: "pending", sentAt: "2026-10-28T14:30:00Z", expiresAt: "2026-11-04T14:30:00Z" },
  { id: "in3", email: "ruth@applianceweekly.co.uk", role: "Author", status: "accepted", sentAt: "2026-10-20T10:00:00Z", expiresAt: "2026-10-27T10:00:00Z" },
  { id: "in4", email: "gustav@nordicreviews.se", role: "Author", status: "expired", sentAt: "2026-09-30T10:00:00Z", expiresAt: "2026-10-07T10:00:00Z" },
];

export const auditLogs: AuditLog[] = [
  { id: "au1", actorId: "m3", action: "content.published", resource: "Best Noise-Cancelling Headphones of 2026", siteId: "s1", ip: "203.0.113.42", at: "2026-11-04T10:12:00Z", details: "Published revision 4 with updated lab chart." },
  { id: "au2", actorId: "m2", action: "content.comment_added", resource: "Smart Doorbells Compared", siteId: "s1", ip: "198.51.100.17", at: "2026-11-04T15:50:00Z", details: "Requested pricing table before verdict." },
  { id: "au3", actorId: "m6", action: "review.updated", resource: "Atlas 6200 Washer Review", siteId: "s2", ip: "198.51.100.71", at: "2026-11-03T13:10:00Z", details: "Refreshed merchant prices in buying options." },
  { id: "au4", actorId: "m5", action: "report.imported", resource: "Commission report — Amazon Associates, Oct 2026", siteId: null, ip: "203.0.113.9", at: "2026-11-03T09:00:00Z", details: "Imported 1,420 conversions, $18,420.55." },
  { id: "au5", actorId: "m1", action: "team.role_changed", resource: "Diego Fuentes", siteId: null, ip: "203.0.113.3", at: "2026-11-02T11:00:00Z", details: "Role changed from Author to Editor." },
  { id: "au6", actorId: "m8", action: "content.changes_requested", resource: "How to Choose a Backpacking Pack", siteId: "s3", ip: "198.51.100.88", at: "2026-11-03T17:40:00Z", details: "Hip-belt section needs the two-frame comparison." },
  { id: "au7", actorId: "m2", action: "site.settings_updated", resource: "TechSift", siteId: "s1", ip: "198.51.100.17", at: "2026-11-01T16:30:00Z", details: "Updated homepage hero copy." },
  { id: "au8", actorId: "m4", action: "review.published", resource: "Traverse Cirrus 2P Tent Review", siteId: "s3", ip: "198.51.100.52", at: "2026-11-02T17:35:00Z", details: "Score 9.2, awarded Best Overall." },
  { id: "au9", actorId: "m1", action: "apikey.created", resource: "Publishing API — prod", siteId: null, ip: "203.0.113.3", at: "2026-10-30T09:20:00Z", details: "Permissions: content:read, products:read." },
  { id: "au10", actorId: "m5", action: "link.paused", resource: "vfpm-office", siteId: "s4", ip: "203.0.113.9", at: "2026-10-29T14:00:00Z", details: "Program commission dropped to 12%." },
  { id: "au11", actorId: "m2", action: "seo.redirect_created", resource: "/old-headphone-guide → /best-noise-cancelling-headphones-2026", siteId: "s1", ip: "198.51.100.17", at: "2026-10-18T08:30:00Z", details: "301 redirect, active." },
  { id: "au12", actorId: "m6", action: "media.uploaded", resource: "brew-pro-espresso-shot.jpg", siteId: "s2", ip: "198.51.100.71", at: "2026-10-24T16:40:00Z", details: "980 KB, added to Reviews/Coffee." },
];

export const apiKeys: ApiKey[] = [
  { id: "ak1", name: "Publishing API — prod", prefix: "ph_live_7Kd2", permissions: ["content:read", "products:read", "webhooks:manage"], createdAt: "2026-10-30T09:20:00Z", lastUsed: "2026-11-05T04:00:00Z", expiresAt: null, status: "active" },
  { id: "ak2", name: "Analytics export", prefix: "ph_live_2Mv8", permissions: ["analytics:read"], createdAt: "2026-08-12T10:00:00Z", lastUsed: "2026-11-04T22:30:00Z", expiresAt: "2027-08-12T00:00:00Z", status: "active" },
  { id: "ak3", name: "Staging sync", prefix: "ph_test_9Qz4", permissions: ["content:write", "products:write"], createdAt: "2026-09-01T08:00:00Z", lastUsed: "2026-10-15T16:00:00Z", expiresAt: null, status: "active" },
  { id: "ak4", name: "Legacy importer", prefix: "ph_live_1Bn6", permissions: ["content:write", "products:write", "media:write"], createdAt: "2024-05-20T08:00:00Z", lastUsed: "2026-04-02T12:00:00Z", expiresAt: "2026-05-20T00:00:00Z", status: "revoked" },
];

export const webhooks: Webhook[] = [
  { id: "wh1", url: "https://ops.northbridge.io/hooks/publishing", events: ["content.published", "content.scheduled"], status: "active", lastDelivery: "2026-11-04T10:12:00Z", successRate: 99.8, createdAt: "2026-03-01T00:00:00Z" },
  { id: "wh2", url: "https://zapier.com/hooks/affiliate", events: ["commission.imported", "link.paused"], status: "active", lastDelivery: "2026-11-03T09:00:00Z", successRate: 98.2, createdAt: "2026-04-15T00:00:00Z" },
  { id: "wh3", url: "https://staging.northbridge.io/hooks/catalog", events: ["product.created", "product.updated", "offer.updated"], status: "disabled", lastDelivery: "2026-10-20T12:00:00Z", successRate: 91.4, createdAt: "2026-08-20T00:00:00Z" },
];

export const webhookEvents = [
  "content.published", "content.scheduled", "content.updated", "review.published",
  "product.created", "product.updated", "offer.updated", "commission.imported",
  "link.paused", "media.uploaded", "member.invited",
];

export const integrations: Integration[] = [
  { id: "ig1", name: "Google Analytics 4", category: "Analytics", description: "Traffic and engagement data for every site.", status: "connected", icon: "bar-chart", color: "#F59E0B" },
  { id: "ig2", name: "Google Search Console", category: "SEO", description: "Query data, indexing status and Core Web Vitals.", status: "connected", icon: "search", color: "#0EA5E9" },
  { id: "ig3", name: "Amazon Associates", category: "Affiliate network", description: "Product data and commission reports.", status: "connected", icon: "shopping-cart", color: "#D97706" },
  { id: "ig4", name: "Impact", category: "Affiliate network", description: "Programs, offers and conversion feeds.", status: "connected", icon: "shopping-cart", color: "#10B981" },
  { id: "ig5", name: "Awin", category: "Affiliate network", description: "EU merchant programs and reporting.", status: "connected", icon: "shopping-cart", color: "#6366F1" },
  { id: "ig6", name: "Sovrn Commerce", category: "Affiliate network", description: "Link monetization across merchants.", status: "not_connected", icon: "shopping-cart", color: "#8B5CF6" },
  { id: "ig7", name: "Mailchimp", category: "Email", description: "Newsletter sync for every site.", status: "not_connected", icon: "mail", color: "#EC4899" },
  { id: "ig8", name: "Cloudflare R2", category: "Storage", description: "Media library CDN storage.", status: "connected", icon: "cloud", color: "#F97316" },
];

export const invoices: Invoice[] = [
  { id: "iv1", number: "NB-2026-011", amount: 499, status: "paid", date: "2026-11-01", period: "November 2026" },
  { id: "iv2", number: "NB-2026-010", amount: 499, status: "paid", date: "2026-10-01", period: "October 2026" },
  { id: "iv3", number: "NB-2026-009", amount: 499, status: "paid", date: "2026-09-01", period: "September 2026" },
  { id: "iv4", number: "NB-2026-008", amount: 499, status: "paid", date: "2026-08-01", period: "August 2026" },
  { id: "iv5", number: "NB-2026-012", amount: 499, status: "open", date: "2026-12-01", period: "December 2026" },
];

export const notifications: AppNotification[] = [
  { id: "no1", title: "Review approved", body: "Brew Pro Espresso Review was approved by Jonas and is ready to publish.", type: "review", at: "2026-11-05T06:35:00Z", read: false },
  { id: "no2", title: "Commission report ready", body: "Amazon Associates November MTD report is available for import.", type: "affiliate", at: "2026-11-05T05:00:00Z", read: false },
  { id: "no3", title: "Content scheduled", body: "Air Fryer Basket vs. Oven will publish on Nov 12 at 08:00 UTC.", type: "publishing", at: "2026-11-04T09:30:00Z", read: false },
  { id: "no4", title: "SEO issue detected", body: "3 new issues found on TechSift, including a missing meta description.", type: "system", at: "2026-11-04T02:05:00Z", read: true },
  { id: "no5", title: "Changes requested", body: "Marcus requested changes on 'How to Choose a Backpacking Pack'.", type: "publishing", at: "2026-11-03T17:40:00Z", read: true },
  { id: "no6", title: "New team member", body: "Ruth accepted the invitation and joined as Author.", type: "system", at: "2026-10-21T10:00:00Z", read: true },
];

export const activityFeed: ActivityItem[] = [
  { id: "ac1", actorId: "m3", action: "published", target: "Best Noise-Cancelling Headphones of 2026", at: "2026-11-04T10:12:00Z", type: "content" },
  { id: "ac2", actorId: "m4", action: "scored", target: "Brew Pro Espresso Review (9.0)", at: "2026-11-05T06:30:00Z", type: "content" },
  { id: "ac3", actorId: "m5", action: "imported", target: "Amazon commission report — Oct 2026", at: "2026-11-03T09:00:00Z", type: "affiliate" },
  { id: "ac4", actorId: "m6", action: "updated", target: "Atlas 6200 Washer Review", at: "2026-11-03T13:10:00Z", type: "content" },
  { id: "ac5", actorId: "m2", action: "commented on", target: "Smart Doorbells Compared", at: "2026-11-04T15:50:00Z", type: "content" },
  { id: "ac6", actorId: "m8", action: "requested changes on", target: "How to Choose a Backpacking Pack", at: "2026-11-03T17:40:00Z", type: "content" },
  { id: "ac7", actorId: "m1", action: "invited", target: "nadia.khan@northbridge.io as Editor", at: "2026-11-01T09:00:00Z", type: "team" },
  { id: "ac8", actorId: "m4", action: "published review", target: "Traverse Cirrus 2P Tent (9.2)", at: "2026-11-02T17:35:00Z", type: "content" },
];

/** Traffic series for the last 30 days. */
export const trafficSeries: TrafficDatum[] = Array.from({ length: 30 }, (_, i) => {
  const day = new Date(Date.UTC(2026, 9, 7 + i));
  const base = 58000 + Math.round(18000 * Math.sin(i / 5)) + (i > 24 ? 12000 : 0);
  return { date: day.toISOString().slice(0, 10), views: base + ((i * 271) % 4000), visitors: Math.round((base + ((i * 271) % 4000)) * 0.62) };
});

export const usageStats = {
  sites: { used: sites_used(), limit: 25 },
  members: { used: 8, limit: 15 },
  storageGb: { used: 84.2, limit: 250 },
  apiCalls: { used: 128400, limit: 500000 },
};

function sites_used() {
  return 5;
}
