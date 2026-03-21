/* ──────────────────────────────────────────────
 *  GET /api/products/config
 *  Returns reference data: categories, quality
 *  tiers, and turnaround options.
 * ────────────────────────────────────────────── */

import { NextResponse } from "next/server";
import { CATEGORIES, QUALITY_TIERS, TURNAROUND_OPTIONS } from "@/data/products";

export async function GET() {
  return NextResponse.json({
    categories: CATEGORIES,
    qualityTiers: QUALITY_TIERS,
    turnaroundOptions: TURNAROUND_OPTIONS,
  });
}
