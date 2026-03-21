/* ──────────────────────────────────────────────
 *  Product Catalog — polished card grid
 *  Matches homepage style: green accents, rounded,
 *  subtle borders. Enhanced hover, badges, micro-copy.
 * ────────────────────────────────────────────── */

"use client";

import { useEffect, useState } from "react";
import { useOrderStore } from "@/store/orderStore";
import { fetchProducts, fetchProductConfig, type ProductConfig } from "@/services/api";
import type { Product, ProductCategory } from "@/types/pricing";

export default function ProductCatalog() {
  const activeCategory = useOrderStore((s) => s.activeCategory);
  const setCategory = useOrderStore((s) => s.setCategory);
  const selectProduct = useOrderStore((s) => s.selectProduct);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refData, setRefData] = useState<ProductConfig | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchProductConfig();
      setRefData(data);
    };
    load();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const data = await fetchProducts(activeCategory);
      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  const filtered = products.filter((p) =>
    true
  );

  return (
    <section>
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-medium text-gray-500 mb-5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a8d1a] animate-pulse" />
          Pricing
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3">
          Choose your plan
        </h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-lg mx-auto">
          Subscribe monthly or book a one-off consultation. Transparent pricing, no surprises.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-1 bg-white rounded-full p-1 border border-gray-100 shadow-sm mb-8 max-w-5xl mx-auto w-fit">
        {(refData?.categories ?? []).map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key as ProductCategory)}
            className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-200 ${
              activeCategory === cat.key
                ? "bg-[#1a8d1a] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="w-11 h-11 rounded-xl bg-gray-100 mb-4" />
              <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
              <div className="h-3 w-20 bg-gray-50 rounded mb-3" />
              <div className="h-3 w-full bg-gray-50 rounded mb-2" />
              <div className="h-3 w-3/4 bg-gray-50 rounded mb-6" />
              <div className="h-8 w-24 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">No products found</p>
          <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onSubscribe={() => selectProduct(product.id, "subscription")}
              onConsult={() => selectProduct(product.id, "consultation")}
            />
          ))}
        </div>
      )}

      {/* Trust bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-14 max-w-3xl mx-auto opacity-40">
        <TrustItem icon="shield" text="Secure Payments" />
        <TrustItem icon="clock" text="Cancel Anytime" />
        <TrustItem icon="chat" text="24/7 Support" />
        <TrustItem icon="refund" text="Money-Back Guarantee" />
      </div>
    </section>
  );
}

// ─── Product Card ───────────────────────────

function ProductCard({
  product,
  index,
  onSubscribe,
  onConsult,
}: {
  product: Product;
  index: number;
  onSubscribe: () => void;
  onConsult: () => void;
}) {
  return (
    <div
      className={`relative bg-white rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
        product.popular
          ? "border-[#1a8d1a]/30 shadow-md shadow-[#1a8d1a]/5 ring-1 ring-[#1a8d1a]/10"
          : "border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Popular badge */}
      {product.popular && (
        <div className="absolute -top-3 inset-x-0 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold bg-[#1a8d1a] text-white uppercase tracking-wider shadow-sm shadow-[#1a8d1a]/30">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Most Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
        product.popular ? "bg-[#1a8d1a]/10" : "bg-gray-50"
      }`}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={product.popular ? "#1a8d1a" : "#6b7280"}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        </svg>
      </div>

      {/* Title + subtitle */}
      <h3 className="font-bold text-gray-900 text-base mb-0.5">{product.name}</h3>
      <span className={`text-xs font-semibold mb-3 ${product.popular ? "text-[#1a8d1a]" : "text-gray-400"}`}>
        {product.subtitle}
      </span>
      <p className="text-[13px] text-gray-400 leading-relaxed mb-5 flex-1">{product.description}</p>

      {/* Features */}
      <ul className="space-y-2 mb-6">
        {product.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] text-gray-600">
            <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {/* Pricing */}
      <div className="flex items-baseline gap-1.5 mb-6">
        <span className="text-3xl font-extrabold text-gray-900">£{product.basePrice}</span>
        <span className="text-sm text-gray-400 font-medium">/ {product.billingCycle}</span>
      </div>

      {/* CTAs */}
      <div className="space-y-2.5 mt-auto">
        <button
          onClick={onSubscribe}
          className={`w-full py-3 rounded-full text-[13px] font-semibold transition-all duration-200 ${
            product.popular
              ? "bg-[#1a8d1a] text-white hover:bg-[#157a15] shadow-md shadow-[#1a8d1a]/20"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          Get Started
        </button>
        <button
          onClick={onConsult}
          className="w-full py-2.5 rounded-full border border-gray-200 text-gray-600 text-[13px] font-medium hover:border-[#1a8d1a] hover:text-[#1a8d1a] hover:bg-[#1a8d1a]/5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          Book Consultation · £{product.consultationPrice}
        </button>
      </div>
    </div>
  );
}

// ─── Trust Bar Items ────────────────────────

function TrustItem({ icon, text }: { icon: string; text: string }) {
  const icons: Record<string, React.ReactNode> = {
    shield: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ),
    clock: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    ),
    chat: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
    ),
    refund: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
    ),
  };

  return (
    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
      {icons[icon]}
      {text}
    </div>
  );
}
