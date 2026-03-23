/* ──────────────────────────────────────────────
 *  API Service Layer (axios)
 *  Every data-fetch or mutation goes through here.
 *  All calls hit Next.js API route handlers under /api.
 *  Callers import functions — transport is abstracted.
 * ────────────────────────────────────────────── */

import axios from "axios";

import type {
  Product,
  ProductCategory,
  OrderConfig,
  PricingSummary,
  PaymentPayload,
  PaymentResult,
  TrackedTransaction,
  QualityTier,
} from "@/types/pricing";

import type { BlogPost } from "@/data/blog";
import type { Service } from "@/data/services";

// ─── Axios instance ─────────────────────────

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Product config types ───────────────────

export interface ProductConfig {
  categories: { key: ProductCategory; label: string }[];
  qualityTiers: { key: QualityTier; label: string; multiplier: number }[];
  turnaroundOptions: {
    key: "standard" | "express";
    label: string;
    surchargePercent: number;
    deliveryDays: number;
  }[];
}

// ─── Blog response type ─────────────────────

export interface BlogResponse {
  posts: BlogPost[];
  allPosts: BlogPost[];
  categories: string[];
  featured: BlogPost;
  otherFeatured: BlogPost[];
  recent: BlogPost[];
}

// ─── Catalog queries ────────────────────────

/** Fetch all products, optionally filtered by category */
export async function fetchProducts(
  category: ProductCategory = "all"
): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/products", {
    params: { category },
  });
  return data;
}

/** Fetch a single product by ID */
export async function fetchProductById(
  id: string
): Promise<Product | undefined> {
  try {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  } catch {
    return undefined;
  }
}

/** Fetch reference data: categories, quality tiers, turnaround options */
export async function fetchProductConfig(): Promise<ProductConfig> {
  const { data } = await api.get<ProductConfig>("/products/config");
  return data;
}

// ─── Pricing engine ─────────────────────────

/** Compute pricing server-side for a product + config */
export async function computePricing(
  productId: string,
  config: OrderConfig
): Promise<PricingSummary> {
  const { data } = await api.post<PricingSummary>("/pricing", {
    productId,
    config,
  });
  return data;
}

// ─── Payment ────────────────────────────────

/** Process a payment through the API */
export async function processPayment(
  payload: PaymentPayload
): Promise<PaymentResult> {
  const { data } = await api.post<PaymentResult>("/payments", payload);
  return data;
}

// ─── Transaction lookup ─────────────────────

/** Look up a transaction by ID + email (two-factor security).
 *  Returns null when no match is found. */
export async function lookupTransaction(
  transactionId: string,
  email: string
): Promise<TrackedTransaction | null> {
  try {
    const { data } = await api.get<TrackedTransaction>("/transactions", {
      params: { txnId: transactionId, email },
    });
    return data;
  } catch {
    return null;
  }
}

// ─── Blog ───────────────────────────────────

/** Fetch blog data (posts, categories, featured) */
export async function fetchBlogData(
  category: string = "All"
): Promise<BlogResponse> {
  const { data } = await api.get<BlogResponse>("/blog", {
    params: { category },
  });
  return data;
}

// ─── Services ───────────────────────────────

/** Fetch a service by its URL slug */
export async function fetchServiceBySlug(
  slug: string
): Promise<Service | null> {
  try {
    const { data } = await api.get<Service>(`/services/${slug}`);
    return data;
  } catch {
    return null;
  }
}
