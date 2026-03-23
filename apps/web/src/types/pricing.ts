/* ──────────────────────────────────────────────
 *  Pricing Domain Types
 *  Single source of truth — every layer imports from here.
 *  When you move to a DB, the shapes stay the same;
 *  only the data source changes.
 * ────────────────────────────────────────────── */

/** Product categories for filtering */
export type ProductCategory = "all" | "consulting" | "branding";

/** Quality tiers affect pricing multiplier */
export type QualityTier = "standard" | "premium" | "expert";

/** Turnaround speed affects delivery estimate & surcharge */
export type TurnaroundSpeed = "standard" | "express";

/** Order type — subscription or one-off consultation */
export type OrderType = "subscription" | "consultation";

/** A single product in the catalog */
export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  basePrice: number;            // monthly price in GBP
  consultationPrice: number;    // one-off consultation price in GBP
  currency: string;             // e.g. "GBP"
  billingCycle: "mo" | "yr";
  features: string[];
  popular?: boolean;
}

/** Adjustments applied to the order */
export interface OrderConfig {
  productId: string | null;
  orderType: OrderType;
  quantity: number;
  wordCount: number;
  images: number;
  quality: QualityTier;
  turnaround: TurnaroundSpeed;
}

/** Computed pricing summary (derived, never stored) */
export interface PricingSummary {
  baseTotal: number;
  qualityMultiplier: number;
  turnaroundSurcharge: number;
  deliveryDays: number;
  totalPrice: number;
  currency: string;
}

/** Contact details collected at checkout */
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

/** Mock payment payload */
export interface PaymentPayload {
  orderId: string;
  config: OrderConfig;
  summary: PricingSummary;
  product: Product;
  contact: ContactInfo;
  timestamp: string;
}

/** Payment result from mock gateway */
export interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

/** Step identifiers for the flow */
export type FlowStep = "select" | "configure" | "review" | "confirmation";

/* ──────────────────────────────────────────────
 *  Transaction Tracking Types
 * ────────────────────────────────────────────── */

/** Consultancy lifecycle stage status */
export type StageStatus = "completed" | "in-progress" | "upcoming";

/** A single stage in the consultancy pipeline */
export interface ConsultancyStage {
  id: string;
  title: string;
  description: string;
  status: StageStatus;
  completedAt?: string;       // ISO date string
  estimatedDate?: string;     // ISO date for upcoming
  details: string[];          // expandable bullet points
  deliverables?: string[];    // files / artefacts produced
  assignedTo?: string;        // consultant name
}

/** A tracked transaction / booking */
export interface TrackedTransaction {
  transactionId: string;
  email: string;
  customerName: string;
  phone: string;
  productName: string;
  orderType: OrderType;
  totalPaid: number;
  currency: string;
  bookedAt: string;           // ISO date string
  stages: ConsultancyStage[];
}
