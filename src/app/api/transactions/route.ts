/* ──────────────────────────────────────────────
 *  GET /api/transactions?txnId=...&email=...
 *  Two-factor lookup for tracked transactions.
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { MOCK_TRANSACTIONS } from "@/data/transactions";

export async function GET(req: NextRequest) {
  const txnId = req.nextUrl.searchParams.get("txnId") ?? "";
  const email = req.nextUrl.searchParams.get("email") ?? "";

  if (!txnId || !email) {
    return NextResponse.json(
      { error: "Both txnId and email are required" },
      { status: 400 }
    );
  }

  const match = MOCK_TRANSACTIONS.find(
    (t) =>
      t.transactionId.toLowerCase() === txnId.trim().toLowerCase() &&
      t.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!match) {
    return NextResponse.json(
      { error: "Transaction not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(match);
}
