/* ──────────────────────────────────────────────
 *  Transaction Search — two-factor lookup form
 *  Uses Server Action via useActionState.
 * ────────────────────────────────────────────── */

"use client";

import { useActionState, useEffect, useRef } from "react";
import type { TrackedTransaction } from "@/types/pricing";
import { lookupTransactionAction, type TransactionLookupResult } from "@/lib/actions";

interface Props {
  onResult: (txn: TrackedTransaction) => void;
}

const initialState: TransactionLookupResult = { success: false };

export default function TransactionSearch({ onResult }: Props) {
  const [state, formAction, isPending] = useActionState(lookupTransactionAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && state.data) {
      onResult(state.data as TrackedTransaction);
    }
  }, [state, onResult]);

  const errors = state.errors || {};
  const hasSubmitted = state.message !== undefined || Object.keys(errors).length > 0;

  const fillDemo = (id: string, email: string) => {
    if (!formRef.current) return;
    const txnInput = formRef.current.querySelector<HTMLInputElement>('input[name="txnId"]');
    const emailInput = formRef.current.querySelector<HTMLInputElement>('input[name="email"]');
    if (txnInput) txnInput.value = id;
    if (emailInput) emailInput.value = email;
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a8d1a]/15 to-[#1a8d1a]/5 flex items-center justify-center mx-auto mb-5 ring-1 ring-[#1a8d1a]/10 shadow-lg shadow-[#1a8d1a]/5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-sm text-gray-400 max-w-sm mx-auto">
          Enter your Transaction ID and the email address you used when booking to view your consultancy progress.
        </p>
      </div>

      {/* Form */}
      <form ref={formRef} action={formAction} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow duration-300">
        <div className="space-y-4">
          {/* Transaction ID */}
          <div>
            <label htmlFor="txn-id" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Transaction ID
            </label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <input
                id="txn-id"
                name="txnId"
                type="text"
                placeholder="TXN-1710700000-A1B2C3"
                className={`w-full pl-11 pr-4 py-3.5 text-sm font-mono rounded-xl border bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a]/40 transition-all ${
                  errors.txnId ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>
            {errors.txnId && (
              <p className="mt-1 text-xs text-red-500">{errors.txnId}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="txn-email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="txn-email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className={`w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a]/40 transition-all ${
                  errors.email ? "border-red-300" : "border-gray-200"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Error banner */}
        {state.message && !state.success && (
          <div className="mt-4 flex items-start gap-2.5 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-100">
            <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {state.message}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 py-4 rounded-full bg-[#1a8d1a] text-white text-sm font-bold hover:bg-[#157a15] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-[#1a8d1a]/20 hover:shadow-2xl hover:shadow-[#1a8d1a]/30 hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Searching…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Track Order
            </>
          )}
        </button>

        {/* Demo hint */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 text-center mb-2">Demo credentials — try one of these:</p>
          <div className="space-y-1.5">
            {[
              { id: "TXN-1710700000-A1B2C3", email: "james.carter@example.com" },
              { id: "TXN-1710500000-D4E5F6", email: "olivia.bennett@example.com" },
              { id: "TXN-1710300000-G7H8I9", email: "test@tenuq.com" },
            ].map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => fillDemo(demo.id, demo.email)}
                className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-xs group"
              >
                <span className="font-mono font-semibold text-gray-600 group-hover:text-[#1a8d1a] transition-colors">{demo.id}</span>
                <span className="text-gray-400 ml-2">{demo.email}</span>
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
