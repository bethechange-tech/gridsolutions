/* ──────────────────────────────────────────────
 *  /track — Transaction Tracking Page
 *  Two-factor lookup (TXN ID + email) then
 *  expandable consultancy pipeline view.
 * ────────────────────────────────────────────── */

"use client";

import { useState } from "react";
import { TransactionSearch, TransactionTimeline } from "@/components/track";
import type { TrackedTransaction } from "@/types/pricing";

export default function TrackPage() {
  const [transaction, setTransaction] = useState<TrackedTransaction | null>(null);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {transaction ? (
          <TransactionTimeline
            transaction={transaction}
            onBack={() => setTransaction(null)}
          />
        ) : (
          <TransactionSearch onResult={setTransaction} />
        )}
    </main>
  );
}
