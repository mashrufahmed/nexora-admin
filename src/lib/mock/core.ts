import type {
  Organization,
  Site,
  SiteDomain,
  NavItem,
  HomepageSection,
  TeamMember,
} from "./types";

export const organization: Organization = {
  id: "org-1",
  name: "Northbridge Media",
  slug: "northbridge-media",
  plan: "Scale",
  siteLimit: 25,
  memberCount: 8,
};

export const members: TeamMember[] = [
  { id: "m1", name: "Sarah Chen", email: "sarah@northbridge.io", role: "Owner", status: "active", lastActive: "2026-11-05T08:12:00Z", color: "#4F46E5", title: "Founder & Editorial Director" },
  { id: "m2", name: "Marcus Webb", email: "marcus@northbridge.io", role: "Admin", status: "active", lastActive: "2026-11-05T06:40:00Z", color: "#0EA5E9", title: "Managing Editor" },
  { id: "m3", name: "Priya Nair", email: "priya@northbridge.io", role: "Author", status: "active", lastActive: "2026-11-05T05:05:00Z", color: "#10B981", title: "Senior Technology Writer" },
  { id: "m4", name: "Jonas Lindqvist", email: "jonas@northbridge.io", role: "Reviewer", status: "active", lastActive: "2026-11-04T17:22:00Z", color: "#F59E0B", title: "Lead Test Engineer" },
  { id: "m5", name: "Amara Diallo", email: "amara@northbridge.io", role: "Analyst", status: "active", lastActive: "2026-11-04T14:02:00Z", color: "#EC4899", title: "Affiliate Analyst" },
  { id: "m6", name: "Diego Fuentes", email: "diego@northbridge.io", role: "Editor", status: "active", lastActive: "2026-11-03T19:48:00Z", color: "#8B5CF6", title: "Home & Appliances Editor" },
  { id: "m7", name: "Lena Hoffmann", email: "lena@freelance.dev", role: "Author", status: "suspended", lastActive: "2026-10-14T09:31:00Z", color: "#64748B", title: "Freelance Contributor" },
  { id: "m8", name: "Tom Okafor", email: "tom@northbridge.io", role: "Editor", status: "active", lastActive: "2026-11-05T04:15:00Z", color: "#14B8A6", title: "Outdoor Gear Editor" },
];

export const sites: Site[] = [
  {
    id: "s1", name: "TechSift", domain: "techsift.io", niche: "Technology product reviews",
    description: "Independent, lab-tested reviews of laptops, phones, audio and smart-home gear.",
    status: "active", publishedContent: 412, draftContent: 18, products: 864, reviews: 238,
    monthlyViews: 1284000, affiliateClicks: 46800, lastUpdated: "2026-11-05T07:20:00Z",
    color: "#4F46E5", language: "English", createdAt: "2023-02-14T00:00:00Z",
  },
  {
    id: "s2", name: "HomeGrade", domain: "homegrade.com", niche: "Home appliance reviews",
    description: "Hands-on appliance testing: washers, fridges, vacuums and kitchen equipment.",
    status: "active", publishedContent: 296, draftContent: 11, products: 512, reviews: 174,
    monthlyViews: 742000, affiliateClicks: 28900, lastUpdated: "2026-11-04T15:05:00Z",
    color: "#0EA5E9", language: "English", createdAt: "2023-06-02T00:00:00Z",
  },
  {
    id: "s3", name: "TrailKit", domain: "trailkit.net", niche: "Outdoor equipment reviews",
    description: "Field-tested reviews of hiking, camping and climbing equipment.",
    status: "active", publishedContent: 187, draftContent: 7, products: 348, reviews: 96,
    monthlyViews: 398000, affiliateClicks: 15400, lastUpdated: "2026-11-03T11:47:00Z",
    color: "#10B981", language: "English", createdAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "s4", name: "StackRated", domain: "stackrated.com", niche: "Software reviews",
    description: "In-depth SaaS and productivity software evaluations with scoring rubrics.",
    status: "draft", publishedContent: 24, draftContent: 9, products: 61, reviews: 12,
    monthlyViews: 54000, affiliateClicks: 3100, lastUpdated: "2026-11-01T09:12:00Z",
    color: "#F59E0B", language: "English", createdAt: "2025-09-08T00:00:00Z",
  },
  {
    id: "s5", name: "LensPicks", domain: "lenspicks.com", niche: "Camera gear reviews",
    description: "Mirrorless and lens reviews (archived — merged into TechSift).",
    status: "archived", publishedContent: 133, draftContent: 0, products: 240, reviews: 58,
    monthlyViews: 0, affiliateClicks: 0, lastUpdated: "2026-06-30T00:00:00Z",
    color: "#64748B", language: "English", createdAt: "2022-04-11T00:00:00Z",
  },
];

export const domains: SiteDomain[] = [
  { id: "d1", siteId: "s1", host: "techsift.io", type: "primary", ssl: "active", verified: true, addedAt: "2023-02-14T00:00:00Z" },
  { id: "d2", siteId: "s1", host: "www.techsift.io", type: "redirect", ssl: "active", verified: true, addedAt: "2023-02-20T00:00:00Z" },
  { id: "d3", siteId: "s1", host: "techsift.co.uk", type: "alias", ssl: "pending", verified: false, addedAt: "2026-10-28T00:00:00Z" },
  { id: "d4", siteId: "s2", host: "homegrade.com", type: "primary", ssl: "active", verified: true, addedAt: "2023-06-02T00:00:00Z" },
  { id: "d5", siteId: "s2", host: "www.homegrade.com", type: "redirect", ssl: "active", verified: true, addedAt: "2023-06-02T00:00:00Z" },
  { id: "d6", siteId: "s3", host: "trailkit.net", type: "primary", ssl: "active", verified: true, addedAt: "2024-01-20T00:00:00Z" },
  { id: "d7", siteId: "s4", host: "stackrated.com", type: "primary", ssl: "pending", verified: false, addedAt: "2025-09-08T00:00:00Z" },
  { id: "d8", siteId: "s5", host: "lenspicks.com", type: "primary", ssl: "active", verified: true, addedAt: "2022-04-11T00:00:00Z" },
];

export const defaultNavItems: NavItem[] = [
  { id: "n1", label: "Home", href: "/" },
  { id: "n2", label: "Reviews", href: "/reviews", children: [
    { id: "n2-1", label: "Latest Reviews", href: "/reviews/latest" },
    { id: "n2-2", label: "Buying Guides", href: "/reviews/guides" },
  ]},
  { id: "n3", label: "Categories", href: "/categories", children: [
    { id: "n3-1", label: "Laptops", href: "/categories/laptops" },
    { id: "n3-2", label: "Smartphones", href: "/categories/smartphones" },
    { id: "n3-3", label: "Audio", href: "/categories/audio" },
    { id: "n3-4", label: "Smart Home", href: "/categories/smart-home" },
  ]},
  { id: "n4", label: "Comparisons", href: "/comparisons" },
  { id: "n5", label: "Deals", href: "/deals" },
  { id: "n6", label: "About", href: "/about" },
];

export const defaultHomepageSections: HomepageSection[] = [
  { id: "h1", type: "hero", title: "Hero", enabled: true, config: { headline: "Lab-tested reviews for gear worth your money", ctaLabel: "Browse reviews", style: "gradient" } },
  { id: "h2", type: "featured_content", title: "Featured content", enabled: true, config: { limit: 4, layout: "grid", source: "editors_picks" } },
  { id: "h3", type: "latest_articles", title: "Latest articles", enabled: true, config: { limit: 9, layout: "list" } },
  { id: "h4", type: "featured_reviews", title: "Featured reviews", enabled: true, config: { limit: 3, showScores: true } },
  { id: "h5", type: "best_products", title: "Best products", enabled: true, config: { limit: 6, showPrices: true } },
  { id: "h6", type: "buying_guides", title: "Buying guides", enabled: true, config: { limit: 4 } },
  { id: "h7", type: "comparisons", title: "Comparisons", enabled: false, config: { limit: 3 } },
  { id: "h8", type: "newsletter", title: "Newsletter", enabled: true, config: { headline: "Join 48,000 readers", cadence: "weekly" } },
];
