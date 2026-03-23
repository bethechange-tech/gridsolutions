/* ──────────────────────────────────────────────
 *  Confirmation Step — enhanced success screen
 *  Celebration feel, pulsing ring, better layout.
 * ────────────────────────────────────────────── */

"use client";

import Link from "next/link";
import { useOrderStore } from "@/store/orderStore";

export default function ConfirmationStep() {
  const transactionId = useOrderStore((s) => s.transactionId);
  const reset = useOrderStore((s) => s.reset);

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Green success banner */}
        <div className="bg-gradient-to-br from-[#1a8d1a] to-[#147114] px-8 pt-10 pb-14 relative">
          {/* Decorative rings */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-white/10" />
            <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full border border-white/10" />
          </div>

          {/* Animated success icon */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg shadow-black/10">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-1">Payment Successful!</h2>
          <p className="text-sm text-white/70">
            Your order is confirmed and being processed.
          </p>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 -mt-6 relative">
          {/* Transaction card */}
          {transactionId && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm mb-6">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">Transaction ID</p>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1a8d1a] animate-pulse" />
                <p className="text-sm font-mono font-bold text-gray-800 break-all">{transactionId}</p>
              </div>
            </div>
          )}

          {/* Tracking hint */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1a8d1a]/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-700 mb-0.5">Track your order progress</p>
                <p className="text-[11px] text-gray-400">
                  Use your Transaction ID and email to track the consultancy stages anytime on the <span className="font-semibold text-[#1a8d1a]">Track Order</span> page.
                </p>
              </div>
            </div>
          </div>

          {/* Info hint */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Full payment details logged in browser console
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/track"
              className="block w-full py-3.5 rounded-full bg-[#1a8d1a] text-white text-sm font-bold text-center hover:bg-[#157a15] transition-colors shadow-lg shadow-[#1a8d1a]/20"
            >
              Track Your Order
            </Link>
            <button
              onClick={reset}
              className="w-full py-3.5 rounded-full bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
              </svg>
              Place Another Order
            </button>
            <Link
              href="/"
              className="block w-full py-3.5 rounded-full border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
