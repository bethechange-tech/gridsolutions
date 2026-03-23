/* ──────────────────────────────────────────────
 *  POST /api/pricing
 *  Computes pricing for a given product + config.
 *  Body: { productId: string, config: OrderConfig }
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";
import { QUALITY_TIERS, TURNAROUND_OPTIONS } from "@/data/products";
import type { OrderConfig, PricingSummary } from "@/types/pricing";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, config } = body as { productId: string; config: OrderConfig };

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // One-off consultation — flat price
  if (config.orderType === "consultation") {
    const turnaround = TURNAROUND_OPTIONS.find((t) => t.key === config.turnaround)!;
    const summary: PricingSummary = {
      baseTotal: product.consultationPrice,
      qualityMultiplier: 1,
      turnaroundSurcharge: 0,
      deliveryDays: turnaround.deliveryDays,
      totalPrice: product.consultationPrice,
      currency: product.currency,
    };
    return NextResponse.json(summary);
  }

  // Subscription pricing with quality + turnaround modifiers
  const qualityTier = QUALITY_TIERS.find((t) => t.key === config.quality)!;
  const turnaround = TURNAROUND_OPTIONS.find((t) => t.key === config.turnaround)!;

  const baseTotal = product.basePrice * config.quantity;
  const afterQuality = baseTotal * qualityTier.multiplier;
  const surcharge = afterQuality * (turnaround.surchargePercent / 100);
  const totalPrice = Math.round((afterQuality + surcharge) * 100) / 100;

  const summary: PricingSummary = {
    baseTotal: Math.round(baseTotal * 100) / 100,
    qualityMultiplier: qualityTier.multiplier,
    turnaroundSurcharge: Math.round(surcharge * 100) / 100,
    deliveryDays: turnaround.deliveryDays,
    totalPrice,
    currency: product.currency,
  };

  return NextResponse.json(summary);
}
