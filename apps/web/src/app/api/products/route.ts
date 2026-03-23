/* ──────────────────────────────────────────────
 *  GET /api/products?category=all
 *  Returns filtered product catalog.
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";
import type { ProductCategory } from "@/types/pricing";

export async function GET(req: NextRequest) {
  const category = (req.nextUrl.searchParams.get("category") ?? "all") as ProductCategory;

  const data = await db.product.findMany({
    where: category === "all" ? {} : { category },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(data);
}
