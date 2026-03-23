/* ──────────────────────────────────────────────
 *  GET /api/transactions?txnId=...&email=...
 *  Two-factor lookup for tracked transactions.
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@repo/db";

export async function GET(req: NextRequest) {
  const txnId = req.nextUrl.searchParams.get("txnId") ?? "";
  const email = req.nextUrl.searchParams.get("email") ?? "";

  if (!txnId || !email) {
    return NextResponse.json(
      { error: "Both txnId and email are required" },
      { status: 400 }
    );
  }

  const txn = await db.transaction.findFirst({
    where: {
      id: { equals: txnId.trim(), mode: "insensitive" },
      order: { customerEmail: { equals: email.trim(), mode: "insensitive" } },
    },
    include: {
      order: true,
      stages: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!txn) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }

  // Map to the shape the frontend expects
  const mapped = {
    transactionId: txn.id,
    email: txn.order.customerEmail,
    customerName: txn.order.customerName,
    phone: txn.order.customerPhone,
    productName: txn.order.productId,
    orderType: txn.order.orderType,
    totalPaid: txn.order.totalPrice / 100,
    currency: txn.order.currency,
    bookedAt: txn.bookedAt.toISOString(),
    stages: txn.stages.map((s) => ({
      id: s.stageKey,
      title: s.title,
      description: s.description,
      status: s.status,
      completedAt: s.completedAt?.toISOString(),
      estimatedDate: s.estimatedDate?.toISOString(),
      details: s.details,
      deliverables: s.deliverables,
      assignedTo: s.assignedTo ?? undefined,
    })),
  };

  return NextResponse.json(mapped);
}
