import type { Comparison, Guide } from "./types";

export const guides: Guide[] = [
  {
    id: "g1", title: "Best Noise-Cancelling Headphones 2026", slug: "best-noise-cancelling-headphones-2026",
    categoryId: "c3", siteId: "s1", authorId: "m3", status: "published", updatedAt: "2026-11-04T10:12:00Z",
    intro: "We measured attenuation, battery drain and comfort across 24 headphones. Only five made the final ranking.",
    selectionMethodology: "Lab measurements on the TechSift rig, plus a 12-person blind listening panel and two weeks of commuter testing per finalist.",
    buyingAdvice: "Prioritize attenuation at 100Hz for transit use; for office use, look at speech-frequency attenuation to avoid pressure build-up. Battery claims average 12% optimistic — check our measured numbers.",
    products: [
      { productId: "p1", rank: 1, award: "Best Overall", blurb: "Reference tuning, 40h battery, real multipoint." },
      { productId: "p2", rank: 2, award: "Best Budget", blurb: "Best under $150, especially for calls." },
      { productId: "p16", rank: 3, award: null, blurb: "Not a headphone, but our pick for tablet + ANC combo deals." },
    ],
    faq: [
      { question: "Is ANC worth it on a budget?", answer: "Under $150, expect 15–20dB of attenuation — enough for an office, not for a flight." },
      { question: "Do battery claims hold up?", answer: "On average, claims run 12% high. Our measured numbers are in each review." },
    ],
    wordCount: 4820,
  },
  {
    id: "g2", title: "Best Washers for Large Families", slug: "best-washers-large-families",
    categoryId: "c6", siteId: "s2", authorId: "m6", status: "published", updatedAt: "2026-11-03T13:10:00Z",
    intro: "Nine washers tested on stain removal, spin efficiency and noise across 120 cycles.",
    selectionMethodology: "Standardized stain strips, energy logging and a 12-cycle noise profile per machine.",
    buyingAdvice: "Capacity matters more than cycles. A 9kg drum with a good spin cycle beats a 12kg drum with a weak one — damp loads mean re-drying.",
    products: [
      { productId: "p7", rank: 1, award: "Best Overall", blurb: "Best stain removal and quietest spin." },
      { productId: "p8", rank: 2, award: null, blurb: "Fridge-side pick from the same brand, for kitchen bundles." },
    ],
    faq: [{ question: "Front-load or top-load?", answer: "Front-loads clean better on cold washes and spin drier; top-loads are faster to load." }],
    wordCount: 3940,
  },
  {
    id: "g3", title: "Best Ultralight Tents & Shelters 2026", slug: "best-ultralight-tents-2026",
    categoryId: "c10", siteId: "s3", authorId: "m8", status: "published", updatedAt: "2026-11-02T17:35:00Z",
    intro: "Forty field nights across sub-1.5kg shelters, including two storm exposures.",
    selectionMethodology: "Minimum 15 nights per shelter, storm protocol in exposed terrain, weight verified on a calibrated scale.",
    buyingAdvice: "Buy the last 300 grams of weight savings only if you accept the floor care it demands. For most hikers, 1.2–1.4kg is the sweet spot.",
    products: [
      { productId: "p13", rank: 1, award: "Best Overall", blurb: "1.1kg with genuinely livable dual vestibules." },
      { productId: "p12", rank: 2, award: null, blurb: "The pack we'd pair it with." },
    ],
    faq: [{ question: "Trekking-pole or freestanding?", answer: "Trekking-pole saves 400–700g; freestanding matters mainly on rock slabs and wooden platforms." }],
    wordCount: 3520,
  },
  {
    id: "g4", title: "Smart Doorbell Buyer's Guide", slug: "smart-doorbell-buyers-guide",
    categoryId: "c5", siteId: "s1", authorId: "m2", status: "in_review", updatedAt: "2026-11-04T16:22:00Z",
    intro: "Six wired and battery doorbells tested over 90 days of real front-door traffic.",
    selectionMethodology: "90-day detection log, day/night footage comparison and subscription-cost modelling over three years.",
    buyingAdvice: "Wired wins on reliability and video quality. Check local-storage support before paying a subscription for recordings you already own.",
    products: [{ productId: "p5", rank: 1, award: "Best Overall", blurb: "2K HDR with local microSD storage." }],
    faq: [],
    wordCount: 2680,
  },
  {
    id: "g5", title: "Best Espresso Machines Under $700", slug: "best-espresso-machines-under-700",
    categoryId: "c8", siteId: "s2", authorId: "m6", status: "draft", updatedAt: "2026-11-01T08:40:00Z",
    intro: "Seven machines run through our extraction protocol — temperature stability separates the field fast.",
    selectionMethodology: "30 back-to-back shots per machine with thermocouple logging and blind taste panel.",
    buyingAdvice: "Spend on temperature stability before flow profiling. A PID-stable machine with a basic grinder beats the reverse at this budget.",
    products: [{ productId: "p10", rank: 1, award: "Best Overall", blurb: "±0.4°C stability and a real 58mm portafilter." }],
    faq: [],
    wordCount: 1400,
  },
  {
    id: "g6", title: "How to Choose a Backpacking Pack", slug: "how-to-choose-backpacking-pack",
    categoryId: "c9", siteId: "s3", authorId: "m8", status: "changes_requested", updatedAt: "2026-11-03T18:00:00Z",
    intro: "Fit first, then volume, then features — in that order. Here's how to actually do it.",
    selectionMethodology: "Compiled from 1,400+ miles of loaded testing and fit sessions with six testers of different torso lengths.",
    buyingAdvice: "Match pack volume to your shelter and sleep system weight first; adding capacity for capacity's sake adds carried grams.",
    products: [{ productId: "p12", rank: 1, award: "Best Value", blurb: "Adjustable torso that actually fits most bodies." }],
    faq: [{ question: "How much do I need for a week?", answer: "With modern gear, 60–65L comfortably covers a week of food and fuel." }],
    wordCount: 2400,
  },
];

export const comparisons: Comparison[] = [
  {
    id: "cp1", title: "Sonivo Studio ANC vs. Sonivo Air Pods Lite", slug: "sonivo-studio-vs-air-pods-lite",
    productIds: ["p1", "p2"], winnerId: "p1", criteria: ["Sound quality", "ANC performance", "Battery life", "Comfort", "Price"],
    status: "published", authorId: "m4", siteId: "s1", updatedAt: "2026-10-18T08:00:00Z",
    verdict: "The Studio ANC is worth the step up for flights and offices; the Air Pods Lite win for calls and pocketability.",
    summary: "Side-by-side lab scores and commute testing. Attenuation gap is 9dB at 100Hz; call quality gap favours the Lite.",
  },
  {
    id: "cp2", title: "Nordica Slim 14 vs. Pro 16 Workstation", slug: "nordica-slim-14-vs-pro-16",
    productIds: ["p3", "p4"], winnerId: "p3", criteria: ["Performance", "Display", "Battery life", "Portability", "Value"],
    status: "published", authorId: "m4", siteId: "s1", updatedAt: "2026-11-02T14:40:00Z",
    verdict: "For most buyers the Slim 14 is the better laptop; the Pro 16 only makes sense with a sustained GPU workload.",
    summary: "Benchmark suite and battery results compared. Slim 14 wins efficiency; Pro 16 wins sustained compute by 2.6×.",
  },
  {
    id: "cp3", title: "Atlas 6200 Washer vs. Cyclone V9 Vacuum", slug: "atlas-washer-vs-cyclone-v9",
    productIds: ["p7", "p9"], winnerId: null, criteria: ["Cleaning performance", "Energy efficiency", "Noise", "Usability"],
    status: "draft", authorId: "m6", siteId: "s2", updatedAt: "2026-11-04T09:55:00Z",
    verdict: "", summary: "Cross-category comparison used for the 'laundry day upgrade' feature page. Draft pending final scores.",
  },
  {
    id: "cp4", title: "Ridgeline 65 vs. Cirrus 2P: The Trail Pairing", slug: "ridgeline-65-vs-cirrus-2p",
    productIds: ["p12", "p13"], winnerId: "p13", criteria: ["Weight", "Durability", "Comfort", "Value"],
    status: "published", authorId: "m8", siteId: "s3", updatedAt: "2026-11-03T10:05:00Z",
    verdict: "Both are keepers, but the Cirrus 2P's weight-to-durability ratio is the standout of 2026.",
    summary: "Our two award-winning gear picks compared as a system: combined trail weight, cost and use-case split.",
  },
];
