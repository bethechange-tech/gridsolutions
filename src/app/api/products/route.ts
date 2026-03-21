/* ──────────────────────────────────────────────
 *  GET /api/products?category=all
 *  Returns filtered product catalog.
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";
import type { ProductCategory } from "@/types/pricing";

export async function GET(req: NextRequest) {
  const category = (req.nextUrl.searchParams.get("category") ?? "all") as ProductCategory;

  const data =
    category === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === category);

  return NextResponse.json(data);
}
