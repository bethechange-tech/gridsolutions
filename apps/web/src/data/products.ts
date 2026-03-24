/* ──────────────────────────────────────────────
 *  Product Catalog (Hardcoded)
 *  ★ Swap this file for a DB/API fetch later.
 *  Structured exactly like a DB resultset so
 *  migration is a straight 1→1 replacement.
 * ────────────────────────────────────────────── */

import type { Product, ProductCategory, QualityTier, OrderType } from "@/types/pricing";

// ─── Catalog ────────────────────────────────
export const PRODUCTS: Product[] = [
  {
    id: "strategy-session",
    name: "Strategy Session",
    subtitle: "One-Off",
    description: "A focused 90-minute technical strategy session — stack advice, architecture direction, and next steps.",
    category: "consulting",
    basePrice: 299,
    consultationPrice: 49,
    currency: "GBP",
    billingCycle: "mo",
    features: ["90-min deep-dive", "Written recommendations", "Follow-up call"],
  },
  {
    id: "code-audit",
    name: "Code & Architecture Audit",
    subtitle: "Standard",
    description: "Comprehensive codebase review covering quality, security, and scalability — with a clear action plan.",
    category: "consulting",
    basePrice: 599,
    consultationPrice: 99,
    currency: "GBP",
    billingCycle: "mo",
    features: ["Full repo audit", "Security review", "Prioritised roadmap"],
    popular: true,
  },
  {
    id: "fractional-cto",
    name: "Fractional CTO",
    subtitle: "Retainer",
    description: "Part-time senior technical leadership — hiring, architecture, and engineering culture on tap.",
    category: "consulting",
    basePrice: 2999,
    consultationPrice: 149,
    currency: "GBP",
    billingCycle: "mo",
    features: ["Weekly syncs", "Hiring support", "Vendor evaluation"],
  },
  {
    id: "brand-identity",
    name: "Brand Identity Package",
    subtitle: "Complete",
    description: "Logo, colour system, typography, and a brand guidelines document — everything you need to look the part.",
    category: "branding",
    basePrice: 1499,
    consultationPrice: 79,
    currency: "GBP",
    billingCycle: "mo",
    features: ["Logo design", "Colour & type system", "Brand guidelines PDF"],
  },
  {
    id: "website-build",
    name: "Marketing Website",
    subtitle: "Starter",
    description: "A high-performance Next.js marketing site — designed to convert visitors into customers.",
    category: "branding",
    basePrice: 999,
    consultationPrice: 69,
    currency: "GBP",
    billingCycle: "mo",
    features: ["Custom design", "Mobile responsive", "SEO optimised"],
  },
  {
    id: "brand-support",
    name: "Ongoing Brand Support",
    subtitle: "Retainer",
    description: "Monthly design and content support so your brand evolves as your business grows.",
    category: "branding",
    basePrice: 499,
    consultationPrice: 49,
    currency: "GBP",
    billingCycle: "mo",
    features: ["Design requests", "Content updates", "Quarterly brand review"],
  },
];

// ─── Category metadata (tabs) ───────────────
export const CATEGORIES: { key: ProductCategory; label: string }[] = [
  { key: "all", label: "All Services" },
  { key: "consulting", label: "Consultancy" },
  { key: "branding", label: "Brand Building" },
];

// ─── Quality tiers ──────────────────────────
export const QUALITY_TIERS: { key: QualityTier; label: string; multiplier: number }[] = [
  { key: "standard", multiplier: 1.0, label: "Standard" },
  { key: "premium", multiplier: 1.5, label: "Premium" },
  { key: "expert", multiplier: 2.2, label: "Expert" },
];

// ─── Turnaround options ─────────────────────
export const TURNAROUND_OPTIONS: {
  key: "standard" | "express";
  label: string;
  surchargePercent: number;
  deliveryDays: number;
}[] = [
  { key: "standard", label: "Standard", surchargePercent: 0, deliveryDays: 14 },
  { key: "express", label: "Express", surchargePercent: 30, deliveryDays: 7 },
];

// ─── Defaults ───────────────────────────────
export const DEFAULT_ORDER_CONFIG = {
  productId: null as string | null,
  orderType: "subscription" as OrderType,
  quantity: 1,
  wordCount: 1500,
  images: 0,
  quality: "standard" as QualityTier,
  turnaround: "standard" as "standard" | "express",
};
