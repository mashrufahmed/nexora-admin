// Shared TypeScript interfaces for the mock data layer.
// Keep mock services shaped like future API responses so real services can replace them.

export type ContentStatus =
  | "draft"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "scheduled"
  | "published"
  | "archived";

export type SiteStatus = "active" | "draft" | "archived";
export type ProductStatus = "draft" | "published" | "archived";
export type SimpleStatus = "active" | "paused" | "archived";
export type Availability = "in_stock" | "out_of_stock" | "pre_order" | "discontinued";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "Free" | "Growth" | "Scale";
  siteLimit: number;
  memberCount: number;
}

export interface Site {
  id: string;
  name: string;
  domain: string;
  niche: string;
  description: string;
  status: SiteStatus;
  publishedContent: number;
  draftContent: number;
  products: number;
  reviews: number;
  monthlyViews: number;
  affiliateClicks: number;
  lastUpdated: string;
  color: string; // tailwind-friendly hex for avatar
  language: string;
  createdAt: string;
}

export interface SiteDomain {
  id: string;
  siteId: string;
  host: string;
  type: "primary" | "redirect" | "alias";
  ssl: "active" | "pending" | "failed";
  verified: boolean;
  addedAt: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: NavItem[];
}

export type HomepageSectionType =
  | "hero"
  | "featured_content"
  | "latest_articles"
  | "featured_reviews"
  | "best_products"
  | "buying_guides"
  | "comparisons"
  | "newsletter"
  | "custom";

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  title: string;
  enabled: boolean;
  config: Record<string, string | number | boolean>;
}

export interface SeoMeta {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface ContentItem {
  id: string;
  siteId: string;
  type: "article" | "page";
  title: string;
  slug: string;
  excerpt: string;
  authorId: string;
  status: ContentStatus;
  category: string;
  tags: string[];
  wordCount: number;
  views: number;
  publishedAt: string | null;
  scheduledAt: string | null;
  updatedAt: string;
  seo: SeoMeta;
  assigneeId: string | null;
  reviewerId: string | null;
  comments: EditorialComment[];
  revision: number;
}

export interface EditorialComment {
  id: string;
  authorId: string;
  body: string;
  at: string;
  resolvesRevision: boolean;
}

export interface ContentRevision {
  id: string;
  contentId: string;
  revision: number;
  authorId: string;
  at: string;
  note: string;
  type: "auto_save" | "manual" | "published" | "restored";
}

export interface ProductSpec {
  name: string;
  value: string;
  unit?: string;
}

export interface ProductOffer {
  merchantId: string;
  price: number;
  currency: string;
  availability: Availability;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  categoryId: string;
  model: string;
  sku: string;
  gtin: string;
  description: string;
  status: ProductStatus;
  score: number | null;
  releaseDate: string;
  price: number;
  currency: string;
  siteIds: string[];
  specs: ProductSpec[];
  tags: string[];
  imageColor: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  website: string;
  productCount: number;
  description: string;
  color: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  productCount: number;
  description: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  type: "text" | "number" | "boolean" | "select";
  unit: string | null;
  required: boolean;
  categories: string[];
  showInSpecs: boolean;
  showInComparison: boolean;
}

export interface ReviewCriterion {
  criterion: string;
  weight: number;
  score: number;
  max: number;
}

export interface Review {
  id: string;
  productId: string;
  siteId: string;
  title: string;
  authorId: string;
  score: number;
  verdict: string;
  summary: string;
  pros: string[];
  cons: string[];
  status: ContentStatus;
  testingDate: string;
  testingMethodology: string;
  updatedAt: string;
  criteria: ReviewCriterion[];
  awards: string[];
  methodologyId: string;
}

export interface Methodology {
  id: string;
  name: string;
  version: string;
  status: "draft" | "published";
  description: string;
  updatedAt: string;
  criteria: { criterion: string; weight: number; max: number }[];
}

export interface Award {
  id: string;
  name: string;
  description: string;
  color: string;
  assignedCount: number;
}

export interface GuideProductEntry {
  productId: string;
  rank: number;
  award: string | null;
  blurb: string;
}

export interface Guide {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  siteId: string;
  authorId: string;
  status: ContentStatus;
  updatedAt: string;
  intro: string;
  selectionMethodology: string;
  buyingAdvice: string;
  products: GuideProductEntry[];
  faq: { question: string; answer: string }[];
  wordCount: number;
}

export interface Comparison {
  id: string;
  title: string;
  slug: string;
  productIds: string[];
  winnerId: string | null;
  criteria: string[];
  status: ContentStatus;
  authorId: string;
  siteId: string;
  updatedAt: string;
  verdict: string;
  summary: string;
}

export interface AffiliateNetwork {
  id: string;
  name: string;
  status: "connected" | "disconnected" | "error";
  merchantCount: number;
  programs: number;
  defaultCommission: string;
  apiKeyMasked: string;
}

export interface Merchant {
  id: string;
  name: string;
  networkId: string;
  program: string;
  country: string;
  currency: string;
  status: SimpleStatus;
  commission: string;
  color: string;
}

export interface AffiliateLink {
  id: string;
  productId: string;
  merchantId: string;
  key: string;
  destinationUrl: string;
  affiliateUrl: string;
  status: SimpleStatus;
  clicks: number;
  conversions: number;
  createdAt: string;
}

export interface Offer {
  id: string;
  productId: string;
  merchantId: string;
  price: number;
  currency: string;
  availability: Availability;
  url: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  source: string;
  medium: string;
  key: string;
  siteId: string;
  startDate: string;
  endDate: string | null;
  status: "active" | "scheduled" | "ended" | "paused";
  clicks: number;
}

export interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "document";
  sizeKb: number;
  width: number | null;
  height: number | null;
  uploadedAt: string;
  alt: string;
  caption: string;
  folder: string;
  color: string;
}

export interface Redirect {
  id: string;
  siteId: string;
  sourceUrl: string;
  destinationUrl: string;
  statusCode: 301 | 302;
  active: boolean;
  hits: number;
  createdAt: string;
}

export interface SeoIssue {
  id: string;
  siteId: string;
  type: "missing_title" | "missing_description" | "missing_alt" | "broken_link" | "duplicate_title";
  resource: string;
  detail: string;
  detectedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  lastActive: string;
  color: string;
  title: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "expired";
  sentAt: string;
  expiresAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  system: boolean;
  permissions: Record<string, string[]>;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  resource: string;
  siteId: string | null;
  ip: string;
  at: string;
  details: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  status: "active" | "revoked";
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: "active" | "disabled";
  lastDelivery: string | null;
  successRate: number;
  createdAt: string;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "connected" | "not_connected";
  icon: string;
  color: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: "paid" | "open" | "failed";
  date: string;
  period: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "publishing" | "review" | "affiliate" | "system";
  at: string;
  read: boolean;
}

export interface ActivityItem {
  id: string;
  actorId: string;
  action: string;
  target: string;
  at: string;
  type: "content" | "product" | "affiliate" | "team" | "seo" | "system";
}

export interface ClickDatum {
  date: string;
  clicks: number;
  conversions: number;
}

export interface TrafficDatum {
  date: string;
  views: number;
  visitors: number;
}

export interface CommissionReport {
  id: string;
  networkId: string;
  period: string;
  amount: number;
  conversions: number;
  status: "imported" | "pending" | "processing";
  importedAt: string | null;
}
