/* ──────────────────────────────────────────────
 *  GET /api/services/[slug]
 *  Returns a single service by slug.
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { getServiceBySlug } from "@/data/services";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json(service);
}
