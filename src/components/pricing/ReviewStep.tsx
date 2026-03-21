/* ──────────────────────────────────────────────
 *  Review Step — enhanced order summary
 *  Clearer visual hierarchy, security trust signals,
 *  better layout for both subscription + consultation.
 * ────────────────────────────────────────────── */

"use client";

import { useEffect, useState, useActionState } from "react";
import { useOrderStore } from "@/store/orderStore";
import { fetchProductById, fetchProductConfig, computePricing, type ProductConfig } from "@/services/api";
import type { PaymentPayload, Product, PricingSummary } from "@/types/pricing";
import { contactInfoSchema } from "@/lib/validators";
import { processPaymentAction, type PaymentActionResult } from "@/lib/actions";

const initialPayState: PaymentActionResult = { success: false };

export default function ReviewStep() {
  const config = useOrderStore((s) => s.config);
  const contactInfo = useOrderStore((s) => s.contactInfo);
  const setContactInfo = useOrderStore((s) => s.setContactInfo);
  const setStep = useOrderStore((s) => s.setStep);
  const setTransactionId = useOrderStore((s) => s.setTransactionId);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [product, setProduct] = useState<Product | null>(null);
  const [refData, setRefData] = useState<ProductConfig | null>(null);
  const [summary, setSummary] = useState<PricingSummary | null>(null);

  const [payState, payAction, isPaying] = useActionState(processPaymentAction, initialPayState);

  // Handle successful payment result
  useEffect(() => {
    if (payState.success && payState.data?.transactionId) {
      setTransactionId(payState.data.transactionId);
      setStep("confirmation");
    }
  }, [payState, setTransactionId, setStep]);

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

  const qualityLabel = refData?.qualityTiers.find((t) => t.key === config.quality)?.label;
  const turnaroundLabel = refData?.turnaroundOptions.find((t) => t.key === config.turnaround)?.label;
  const isConsultation = config.orderType === "consultation";

  if (!product || !summary || !refData) return null;

  const validate = (): boolean => {
    const result = contactInfoSchema.safeParse(contactInfo);
    if (result.success) {
      setErrors({});
      return true;
    }
    const newErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (!newErrors[field]) newErrors[field] = issue.message;
    }
    setErrors(newErrors);
    return false;
  };

  // Build payload for hidden input
  const buildPayload = (): string => {
    const payload: PaymentPayload = {
      orderId: `ORD-${Date.now()}`,
      config,
      summary: summary!,
      product: product!,
      contact: contactInfo,
      timestamp: new Date().toISOString(),
    };
    return JSON.stringify(payload);
  };

  const handleFormAction = (formData: FormData) => {
    if (!validate()) return;
    payAction(formData);
  };

  const goBack = () => {
    if (isConsultation) {
      setStep("select");
    } else {
      setStep("configure");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Back */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 group"
      >
        <span className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </span>
        Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header bar */}
        <div className="bg-gray-900 px-6 sm:px-8 py-5">
          <h2 className="text-lg font-bold text-white">Review Order</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {isConsultation
              ? "One-off consultation — confirm and pay."
              : "Verify your configuration before payment."}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Product info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#1a8d1a]/10 flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="1.8">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900">{product.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isConsultation
                    ? "bg-[#1a8d1a]/10 text-[#1a8d1a]"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {isConsultation ? "Consultation" : "Subscription"}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              {isConsultation ? (
                <span className="text-xl font-extrabold text-gray-900">£{product.consultationPrice}</span>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-gray-900">£{product.basePrice}</span>
                  <span className="text-sm text-gray-400 font-medium"> / {product.billingCycle}</span>
                </>
              )}
            </div>
          </div>

          {/* Line items */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-3 mb-6">
            {!isConsultation && (
              <>
                <LineItem label="Quantity" value={config.quantity.toString()} />
                <LineItem label="Quality Tier" value={qualityLabel ?? config.quality} />
                <LineItem label="Turnaround" value={turnaroundLabel ?? config.turnaround} />
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <LineItem label="Base total" value={`£${summary.baseTotal.toFixed(2)}`} />
                  {summary.qualityMultiplier > 1 && (
                    <LineItem label={`Quality ×${summary.qualityMultiplier}`} value={`+£${(summary.baseTotal * summary.qualityMultiplier - summary.baseTotal).toFixed(2)}`} />
                  )}
                  {summary.turnaroundSurcharge > 0 && (
                    <LineItem label="Express surcharge" value={`+£${summary.turnaroundSurcharge.toFixed(2)}`} accent />
                  )}
                </div>
              </>
            )}
            {isConsultation && (
              <>
                <LineItem label="Type" value="One-off session" />
                <LineItem label="Product" value={product.name} />
              </>
            )}
          </div>

          {/* Contact details */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 mb-1">Your Details</h3>
            <p className="text-xs text-gray-400 mb-4">We&apos;ll use this to confirm your booking.</p>
            <div className="space-y-3">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="John Smith"
                  value={contactInfo.name}
                  onChange={(e) => { setContactInfo("name", e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                  className={`w-full px-4 py-3 text-sm rounded-xl border bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a]/40 transition-all ${errors.name ? "border-red-300 bg-red-50/30" : "border-gray-200"}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="john@example.com"
                  value={contactInfo.email}
                  onChange={(e) => { setContactInfo("email", e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                  className={`w-full px-4 py-3 text-sm rounded-xl border bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a]/40 transition-all ${errors.email ? "border-red-300 bg-red-50/30" : "border-gray-200"}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="contact-phone" className="block text-xs font-medium text-gray-500 mb-1">
                  Phone Number
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="+44 7700 900000"
                  value={contactInfo.phone}
                  onChange={(e) => { setContactInfo("phone", e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
                  className={`w-full px-4 py-3 text-sm rounded-xl border bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a]/40 transition-all ${errors.phone ? "border-red-300 bg-red-50/30" : "border-gray-200"}`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Delivery + Total */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Delivery estimate</span>
            <span className="text-sm font-bold text-gray-700">{summary.deliveryDays} Days</span>
          </div>
          <div className="flex items-center justify-between py-4 border-t border-gray-100">
            <span className="text-base font-bold text-gray-700">Total</span>
            <span className="text-3xl font-extrabold text-[#1a8d1a]">£{summary.totalPrice.toFixed(2)}</span>
          </div>

          {/* Pay button */}
          <form action={handleFormAction}>
            <input type="hidden" name="payload" value={buildPayload()} />
            <button
              type="submit"
              disabled={isPaying}
              className="w-full mt-4 py-4 rounded-full bg-[#1a8d1a] text-white text-sm font-bold hover:bg-[#157a15] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#1a8d1a]/20 flex items-center justify-center gap-2.5"
            >
              {isPaying ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing payment…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Pay £{summary.totalPrice.toFixed(2)}
                </>
              )}
            </button>
          </form>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              SSL Encrypted
            </span>
            <span className="w-0.5 h-3 bg-gray-200 rounded-full" />
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Secure Payment
            </span>
            <span className="w-0.5 h-3 bg-gray-200 rounded-full" />
            <span>Mock Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LineItem({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={`font-medium ${accent ? "text-orange-500" : "text-gray-700"}`}>{value}</span>
    </div>
  );
}
