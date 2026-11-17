import type {
  AffiliateNetwork,
  AffiliateLink,
  Campaign,
  ClickDatum,
  CommissionReport,
  Merchant,
  Offer,
} from "./types";

export const networks: AffiliateNetwork[] = [
  { id: "an1", name: "Amazon Associates", status: "connected", merchantCount: 4, programs: 4, defaultCommission: "4.0%", apiKeyMasked: "AKIA••••••••7F2Q" },
  { id: "an2", name: "Impact", status: "connected", merchantCount: 5, programs: 6, defaultCommission: "6.5%", apiKeyMasked: "IMP••••••••92Kd" },
  { id: "an3", name: "Awin", status: "connected", merchantCount: 3, programs: 3, defaultCommission: "5.0%", apiKeyMasked: "AWN••••••••41Rx" },
  { id: "an4", name: "CJ Affiliate", status: "disconnected", merchantCount: 0, programs: 0, defaultCommission: "—", apiKeyMasked: "" },
  { id: "an5", name: "Sovrn Commerce", status: "error", merchantCount: 2, programs: 2, defaultCommission: "3.2%", apiKeyMasked: "SOV••••••••08Tt" },
];

export const merchants: Merchant[] = [
  { id: "mc1", name: "Amazon US", networkId: "an1", program: "Amazon Associates", country: "United States", currency: "USD", status: "active", commission: "4.0%", color: "#F59E0B" },
  { id: "mc2", name: "Amazon UK", networkId: "an1", program: "Amazon Associates", country: "United Kingdom", currency: "GBP", status: "active", commission: "4.0%", color: "#F59E0B" },
  { id: "mc3", name: "Amazon DE", networkId: "an1", program: "Amazon Associates", country: "Germany", currency: "EUR", status: "active", commission: "4.0%", color: "#F59E0B" },
  { id: "mc4", name: "BestGear Co.", networkId: "an2", program: "BestGear Partner", country: "United States", currency: "USD", status: "active", commission: "6.5%", color: "#0EA5E9" },
  { id: "mc5", name: "AudioHaus", networkId: "an2", program: "AudioHaus Affiliate", country: "United States", currency: "USD", status: "active", commission: "7.0%", color: "#4F46E5" },
  { id: "mc6", name: "NordicStore", networkId: "an3", program: "NordicStore EU", country: "Sweden", currency: "EUR", status: "active", commission: "5.5%", color: "#10B981" },
  { id: "mc7", name: "HomeKit Direct", networkId: "an2", program: "HomeKit Partner", country: "United States", currency: "USD", status: "paused", commission: "5.0%", color: "#8B5CF6" },
  { id: "mc8", name: "SummitShop", networkId: "an2", program: "SummitShop Pro", country: "United States", currency: "USD", status: "active", commission: "8.0%", color: "#14B8A6" },
  { id: "mc9", name: "TrailWorks", networkId: "an3", program: "TrailWorks Partner", country: "New Zealand", currency: "NZD", status: "active", commission: "6.0%", color: "#6366F1" },
  { id: "mc10", name: "CafeSupply", networkId: "an5", program: "CafeSupply Basic", country: "Canada", currency: "CAD", status: "active", commission: "3.2%", color: "#EC4899" },
  { id: "mc11", name: "OfficeStack", networkId: "an2", program: "SaaS Referral", country: "United States", currency: "USD", status: "active", commission: "20.0%", color: "#64748B" },
];

export const affiliateLinks: AffiliateLink[] = [
  { id: "al1", productId: "p1", merchantId: "mc1", key: "sv900-amz", destinationUrl: "https://amazon.com/dp/B0SV900", affiliateUrl: "https://amazon.com/dp/B0SV900?tag=northb-20", status: "active", clicks: 18420, conversions: 552, createdAt: "2026-03-15T00:00:00Z" },
  { id: "al2", productId: "p1", merchantId: "mc5", key: "sv900-audiohaus", destinationUrl: "https://audiohaus.com/sv-900", affiliateUrl: "https://audiohaus.com/sv-900?ref=northbridge", status: "active", clicks: 7240, conversions: 435, createdAt: "2026-03-15T00:00:00Z" },
  { id: "al3", productId: "p2", merchantId: "mc1", key: "svl20-amz", destinationUrl: "https://amazon.com/dp/B0SVL20", affiliateUrl: "https://amazon.com/dp/B0SVL20?tag=northb-20", status: "active", clicks: 9120, conversions: 386, createdAt: "2026-05-10T00:00:00Z" },
  { id: "al4", productId: "p3", merchantId: "mc4", key: "ncs14-bestgear", destinationUrl: "https://bestgear.com/nc-s14", affiliateUrl: "https://bestgear.com/nc-s14?ref=northbridge", status: "active", clicks: 6830, conversions: 241, createdAt: "2026-02-20T00:00:00Z" },
  { id: "al5", productId: "p3", merchantId: "mc3", key: "ncs14-amzde", destinationUrl: "https://amazon.de/dp/B0NCS14", affiliateUrl: "https://amazon.de/dp/B0NCS14?tag=northb-de-21", status: "active", clicks: 3210, conversions: 98, createdAt: "2026-02-20T00:00:00Z" },
  { id: "al6", productId: "p7", merchantId: "mc3", key: "atw6200-amzde", destinationUrl: "https://amazon.de/dp/B0ATW6200", affiliateUrl: "https://amazon.de/dp/B0ATW6200?tag=northb-de-21", status: "active", clicks: 5840, conversions: 189, createdAt: "2025-12-01T00:00:00Z" },
  { id: "al7", productId: "p10", merchantId: "mc10", key: "kpbp58-cafe", destinationUrl: "https://cafesupply.ca/kp-bp58", affiliateUrl: "https://cafesupply.ca/kp-bp58?ref=northbridge", status: "active", clicks: 4120, conversions: 173, createdAt: "2026-02-10T00:00:00Z" },
  { id: "al8", productId: "p12", merchantId: "mc8", key: "sorl65-summit", destinationUrl: "https://summitshop.com/so-rl65", affiliateUrl: "https://summitshop.com/so-rl65?ref=northbridge", status: "active", clicks: 5460, conversions: 231, createdAt: "2026-03-30T00:00:00Z" },
  { id: "al9", productId: "p13", merchantId: "mc9", key: "tgc2p-trail", destinationUrl: "https://trailworks.nz/tg-c2p", affiliateUrl: "https://trailworks.nz/tg-c2p?ref=northbridge", status: "active", clicks: 3980, conversions: 142, createdAt: "2026-04-05T00:00:00Z" },
  { id: "al10", productId: "p14", merchantId: "mc11", key: "vfpm-office", destinationUrl: "https://vertexsoftware.io/flow", affiliateUrl: "https://vertexsoftware.io/flow?ref=northbridge", status: "paused", clicks: 1640, conversions: 96, createdAt: "2025-10-01T00:00:00Z" },
  { id: "al11", productId: "p5", merchantId: "mc1", key: "mhdb2-amz", destinationUrl: "https://amazon.com/dp/B0MHDB2", affiliateUrl: "https://amazon.com/dp/B0MHDB2?tag=northb-20", status: "active", clicks: 7630, conversions: 268, createdAt: "2026-01-25T00:00:00Z" },
  { id: "al12", productId: "p9", merchantId: "mc3", key: "atv9-amzde", destinationUrl: "https://amazon.de/dp/B0ATV9", affiliateUrl: "https://amazon.de/dp/B0ATV9?tag=northb-de-21", status: "active", clicks: 4390, conversions: 152, createdAt: "2026-06-20T00:00:00Z" },
];

export const offers: Offer[] = [
  { id: "of1", productId: "p1", merchantId: "mc1", price: 349, currency: "USD", availability: "in_stock", url: "https://amazon.com/dp/B0SV900", updatedAt: "2026-11-05T06:00:00Z" },
  { id: "of2", productId: "p1", merchantId: "mc5", price: 339, currency: "USD", availability: "in_stock", url: "https://audiohaus.com/sv-900", updatedAt: "2026-11-04T18:00:00Z" },
  { id: "of3", productId: "p2", merchantId: "mc1", price: 129, currency: "USD", availability: "in_stock", url: "https://amazon.com/dp/B0SVL20", updatedAt: "2026-11-05T06:00:00Z" },
  { id: "of4", productId: "p3", merchantId: "mc4", price: 1499, currency: "USD", availability: "in_stock", url: "https://bestgear.com/nc-s14", updatedAt: "2026-11-04T12:00:00Z" },
  { id: "of5", productId: "p3", merchantId: "mc3", price: 1429, currency: "EUR", availability: "pre_order", url: "https://amazon.de/dp/B0NCS14", updatedAt: "2026-11-03T09:00:00Z" },
  { id: "of6", productId: "p7", merchantId: "mc3", price: 1249, currency: "EUR", availability: "in_stock", url: "https://amazon.de/dp/B0ATW6200", updatedAt: "2026-11-05T06:00:00Z" },
  { id: "of7", productId: "p10", merchantId: "mc10", price: 649, currency: "CAD", availability: "in_stock", url: "https://cafesupply.ca/kp-bp58", updatedAt: "2026-11-04T20:00:00Z" },
  { id: "of8", productId: "p12", merchantId: "mc8", price: 289, currency: "USD", availability: "in_stock", url: "https://summitshop.com/so-rl65", updatedAt: "2026-11-04T14:00:00Z" },
  { id: "of9", productId: "p13", merchantId: "mc9", price: 549, currency: "USD", availability: "in_stock", url: "https://trailworks.nz/tg-c2p", updatedAt: "2026-11-03T16:00:00Z" },
  { id: "of10", productId: "p14", merchantId: "mc11", price: 12, currency: "USD", availability: "in_stock", url: "https://vertexsoftware.io/flow", updatedAt: "2026-11-01T10:00:00Z" },
  { id: "of11", productId: "p9", merchantId: "mc3", price: 549, currency: "EUR", availability: "in_stock", url: "https://amazon.de/dp/B0ATV9", updatedAt: "2026-11-04T08:00:00Z" },
  { id: "of12", productId: "p5", merchantId: "mc1", price: 179, currency: "USD", availability: "out_of_stock", url: "https://amazon.com/dp/B0MHDB2", updatedAt: "2026-11-02T10:00:00Z" },
];

export const campaigns: Campaign[] = [
  { id: "cm1", name: "Black Friday ANC Push", source: "newsletter", medium: "email", key: "bf26-anc", siteId: "s1", startDate: "2026-11-20", endDate: "2026-12-01", status: "scheduled", clicks: 0 },
  { id: "cm2", name: "Holiday Gear Guide", source: "social", medium: "cpc", key: "hol26-gear", siteId: "s3", startDate: "2026-11-15", endDate: "2027-01-05", status: "scheduled", clicks: 0 },
  { id: "cm3", name: "Evergreen Audio Picks", source: "organic", medium: "content", key: "ever-audio", siteId: "s1", startDate: "2026-06-01", endDate: null, status: "active", clicks: 12400 },
  { id: "cm4", name: "Laundry Season Roundup", source: "newsletter", medium: "email", key: "laundry-26", siteId: "s2", startDate: "2026-10-01", endDate: null, status: "active", clicks: 6800 },
  { id: "cm5", name: "Summer Trail Series", source: "search", medium: "cpc", key: "summer26-trail", siteId: "s3", startDate: "2026-05-15", endDate: "2026-09-01", status: "ended", clicks: 18200 },
  { id: "cm6", name: "Appliance Deals Digest", source: "social", medium: "social", key: "appl-digest", siteId: "s2", startDate: "2026-08-01", endDate: null, status: "paused", clicks: 3900 },
];

/** Click series for the last 30 days (dates as ISO day strings). */
export const clickSeries: ClickDatum[] = Array.from({ length: 30 }, (_, i) => {
  const day = new Date(Date.UTC(2026, 9, 7 + i));
  const base = 1400 + Math.round(600 * Math.sin(i / 4)) + (i > 22 ? 900 : 0);
  return {
    date: day.toISOString().slice(0, 10),
    clicks: base + ((i * 137) % 320),
    conversions: Math.round((base + ((i * 137) % 320)) * 0.031),
  };
});

export const commissionReports: CommissionReport[] = [
  { id: "cr1", networkId: "an1", period: "October 2026", amount: 18420.55, conversions: 1420, status: "imported", importedAt: "2026-11-03T09:00:00Z" },
  { id: "cr2", networkId: "an2", period: "October 2026", amount: 9680.2, conversions: 640, status: "imported", importedAt: "2026-11-03T09:30:00Z" },
  { id: "cr3", networkId: "an3", period: "October 2026", amount: 4210.8, conversions: 288, status: "imported", importedAt: "2026-11-03T10:00:00Z" },
  { id: "cr4", networkId: "an1", period: "November 2026 (MTD)", amount: 5120.4, conversions: 396, status: "pending", importedAt: null },
  { id: "cr5", networkId: "an5", period: "October 2026", amount: 0, conversions: 0, status: "processing", importedAt: null },
];
