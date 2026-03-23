/* ──────────────────────────────────────────────
 *  Configure Step — enhanced inline configurator
 *  Quality, turnaround, quantity, live price summary.
 *  Better visual feedback and information hierarchy.
 * ────────────────────────────────────────────── */

"use client";

import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/orderStore";
import { fetchProductById, fetchProductConfig, computePricing, type ProductConfig } from "@/services/api";
import type { Product, PricingSummary } from "@/types/pricing";

export default function ConfigureStep() {
  const config = useOrderStore((s) => s.config);
  const setQuantity = useOrderStore((s) => s.setQuantity);
  const setQuality = useOrderStore((s) => s.setQuality);
  const setTurnaround = useOrderStore((s) => s.setTurnaround);
  const setStep = useOrderStore((s) => s.setStep);
  const reset = useOrderStore((s) => s.reset);

  const [product, setProduct] = useState<Product | null>(null);
  const [refData, setRefData] = useState<ProductConfig | null>(null);
  const [summary, setSummary] = useState<PricingSummary | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchProductConfig();
      setRefData(data);
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!config.productId) return;
      const p = await fetchProductById(config.productId);
      setProduct(p ?? null);
    };
    load();
  }, [config.productId]);

  useEffect(() => {
    const load = async () => {
      if (!config.productId) return;
      const data = await computePricing(config.productId, config);
      setSummary(data);
    };
    load();
  }, [config.productId, config]);

  if (!product || !summary || !refData) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back to catalog */}
      <button
        onClick={() => setStep("select")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 group"
      >
        <span className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </span>
        Back to products
      </button>

      {/* Product header card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1a8d1a]/10 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-lg">{product.name}</h2>
            <p className="text-sm text-[#1a8d1a] font-medium">{product.subtitle}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-extrabold text-gray-900">£{product.basePrice}</span>
            <span className="text-sm text-gray-400 font-medium"> / {product.billingCycle}</span>
          </div>
        </div>
      </div>

      {/* Configuration card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-8">

        {/* Quantity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-bold text-gray-800">Quantity</label>
            <span className="text-xs text-gray-400 font-medium">How many licenses?</span>
          </div>
          <div className="flex items-center gap-5 bg-gray-50 rounded-xl p-4 w-fit">
            <StepperButton onClick={() => setQuantity(config.quantity - 1)} disabled={config.quantity <= 1}>−</StepperButton>
            <span className="text-3xl font-extrabold text-gray-900 w-14 text-center tabular-nums select-none">
              {config.quantity}
            </span>
            <StepperButton onClick={() => setQuantity(config.quantity + 1)}>+</StepperButton>
          </div>
        </div>

        {/* Quality Tier */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-bold text-gray-800">Quality Tier</label>
            <span className="text-xs text-gray-400 font-medium">Affects pricing multiplier</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {refData.qualityTiers.map((tier) => {
              const isActive = config.quality === tier.key;
              return (
                <button
                  key={tier.key}
                  onClick={() => setQuality(tier.key)}
                  className={`relative py-4 px-3 rounded-xl text-center transition-all duration-200 border-2 ${
                    isActive
                      ? "border-[#1a8d1a] bg-[#1a8d1a]/5 shadow-sm"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                  }`}
                >
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#1a8d1a] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                  <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                    isActive ? "text-[#1a8d1a]" : "text-gray-500"
                  }`}>
                    {tier.label}
                  </span>
                  <span className={`block text-[11px] ${isActive ? "text-[#1a8d1a]/70" : "text-gray-400"}`}>
                    ×{tier.multiplier} rate
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Turnaround */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-bold text-gray-800">Turnaround</label>
            <span className="text-xs text-gray-400 font-medium">Speed of delivery</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {refData.turnaroundOptions.map((opt) => {
              const isActive = config.turnaround === opt.key;
              const isExpress = opt.key === "express";
              return (
                <button
                  key={opt.key}
                  onClick={() => setTurnaround(opt.key)}
                  className={`relative py-4 px-4 rounded-xl transition-all duration-200 border-2 text-left ${
                    isActive
                      ? isExpress
                        ? "border-orange-400 bg-orange-50 shadow-sm"
                        : "border-gray-800 bg-gray-50 shadow-sm"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                  }`}
                >
                  {isActive && (
                    <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                      isExpress ? "bg-orange-500" : "bg-gray-800"
                    }`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                  <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                    isActive
                      ? isExpress ? "text-orange-600" : "text-gray-800"
                      : "text-gray-500"
                  }`}>
                    {isExpress && "⚡ "}{opt.label}
                  </span>
                  <span className={`block text-sm font-semibold mb-0.5 ${
                    isActive ? "text-gray-800" : "text-gray-600"
                  }`}>
                    {opt.deliveryDays} days
                  </span>
                  <span className="block text-[11px] text-gray-400">
                    {opt.surchargePercent > 0 ? `+${opt.surchargePercent}% surcharge` : "No extra charge"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Price summary */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Base</span>
            <span className="text-gray-600 font-medium">£{summary.baseTotal.toFixed(2)}</span>
          </div>
          {summary.qualityMultiplier > 1 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Quality (×{summary.qualityMultiplier})</span>
              <span className="text-gray-600 font-medium">+£{(summary.baseTotal * summary.qualityMultiplier - summary.baseTotal).toFixed(2)}</span>
            </div>
          )}
          {summary.turnaroundSurcharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Express surcharge</span>
              <span className="text-orange-500 font-medium">+£{summary.turnaroundSurcharge.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Delivery</span>
            <span className="text-gray-700 font-semibold">{summary.deliveryDays} Days</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold text-gray-700">Total</span>
            <span className="text-3xl font-extrabold text-[#1a8d1a]">£{summary.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Start Over
          </button>

          <button
            onClick={() => setStep("review")}
            className="px-8 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
          >
            Continue to Review
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stepper Button ─────────────────────────

function StepperButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1a8d1a] hover:text-[#1a8d1a] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-all text-lg bg-white font-medium select-none"
    >
      {children}
    </button>
  );
}
