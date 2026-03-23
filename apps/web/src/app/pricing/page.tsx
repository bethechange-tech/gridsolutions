/* ──────────────────────────────────────────────
 *  /pricing — Product selection & checkout flow
 *  No sidebar — consistent with homepage layout.
 *  Steps: select → configure → review → confirmation
 * ────────────────────────────────────────────── */

"use client";

import { useOrderStore } from "@/store/orderStore";
import {
  ProductCatalog,
  ConfigureStep,
  ReviewStep,
  ConfirmationStep,
} from "@/components/pricing";
import type { FlowStep } from "@/types/pricing";

const STEPS: { key: FlowStep; label: string; num: number }[] = [
  { key: "select", label: "Choose", num: 1 },
  { key: "configure", label: "Configure", num: 2 },
  { key: "review", label: "Review", num: 3 },
  { key: "confirmation", label: "Done", num: 4 },
];

function stepIndex(step: FlowStep) {
  return STEPS.findIndex((s) => s.key === step);
}

export default function PricingPage() {
  const step = useOrderStore((s) => s.step);
  const current = stepIndex(step);

  return (
    <div>

      {/* Step Indicator */}
      {step !== "confirmation" && (
        <div className="flex justify-center px-4 pt-8 sm:pt-10">
          <div className="flex items-center gap-0 bg-white/60 backdrop-blur-sm rounded-full px-5 py-3 border border-gray-100/60 shadow-sm">
            {STEPS.slice(0, -1).map((s, i) => {
              const isActive = i === current;
              const isDone = i < current;
              return (
                <div key={s.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isDone
                          ? "bg-[#1a8d1a] text-white shadow-md shadow-[#1a8d1a]/20"
                          : isActive
                          ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 ring-4 ring-gray-900/5"
                          : "bg-gray-100 text-gray-300 border border-gray-200"
                      }`}
                    >
                      {isDone ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        s.num
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold mt-1.5 transition-colors tracking-wide ${
                        isDone
                          ? "text-[#1a8d1a]"
                          : isActive
                          ? "text-gray-900"
                          : "text-gray-300"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 2 && (
                    <div
                      className={`w-14 sm:w-24 h-0.5 rounded-full mx-3 sm:mx-4 -mt-4 transition-all duration-500 ${
                        i < current ? "bg-gradient-to-r from-[#1a8d1a] to-emerald-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <main className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20">
        {step === "select" && <ProductCatalog />}
        {step === "configure" && <ConfigureStep />}
        {step === "review" && <ReviewStep />}
        {step === "confirmation" && <ConfirmationStep />}
      </main>
    </div>
  );
}

