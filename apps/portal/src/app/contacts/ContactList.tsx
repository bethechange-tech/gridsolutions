"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteContact, createOrderFromContact } from "@/lib/actions";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
  initials: string;
  timeAgo: string;
};

type LinkedTransaction = {
  id: string;
  customerEmail: string;
  customerName: string;
  productName: string;
  totalPrice: string;
  status: string;
  stagesDone: number;
  stagesTotal: number;
};

type ProductOption = {
  id: string;
  name: string;
};

const AVATAR_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-amber-500",
];

export default function ContactList({
  contacts,
  linkedTransactions,
  products,
}: {
  contacts: Contact[];
  linkedTransactions: LinkedTransaction[];
  products: ProductOption[];
}) {
  const [selected, setSelected] = useState<string | null>(
    contacts[0]?.id ?? null
  );
  const active = contacts.find((c) => c.id === selected);
  const [isPending, startTransition] = useTransition();

  /* On mobile, show detail view when a contact is selected */
  const [showDetail, setShowDetail] = useState(false);

  /* Create Order state */
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [createProductId, setCreateProductId] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);

  function selectContact(id: string) {
    setSelected(id);
    setShowDetail(true);
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-4 h-[calc(100vh-140px)]">
      {/* ── Contact list (inbox) ── */}
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-y-auto ${showDetail ? "hidden xl:block" : ""}`}>
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Inbox ({contacts.length})
          </p>
        </div>
        {contacts.map((c, i) => {
          const isActive = selected === c.id;
          return (
            <button
              key={c.id}
              onClick={() => selectContact(c.id)}
              className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-colors ${
                isActive
                  ? "bg-[#1a8d1a]/5 border-l-2 border-l-[#1a8d1a]"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-9 h-9 rounded-lg ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                >
                  {c.initials}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                      {c.timeAgo}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-700 truncate mt-0.5">
                    {c.subject}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {c.message.slice(0, 80)}…
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Message detail ── */}
      {active ? (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden ${!showDetail ? "hidden xl:flex" : ""}`}>
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Back button (mobile) */}
              <button
                onClick={() => setShowDetail(false)}
                className="xl:hidden text-gray-400 hover:text-gray-600 shrink-0"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {active.subject}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  From <span className="font-medium text-gray-700">{active.name}</span>{" "}
                  &lt;{active.email}&gt;{" "}
                  {active.phone && <>&middot; {active.phone}</>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className="text-[10px] text-gray-400 hidden sm:inline">{active.createdAt}</span>
              <button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteContact(active.id);
                    setSelected(
                      contacts.find((c) => c.id !== active.id)?.id ?? null
                    );
                    setShowDetail(false);
                  })
                }
                className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
              >
                {isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {active.message}
            </p>

            {/* Linked Transactions */}
            {(() => {
              const linked = linkedTransactions.filter(
                (t) => t.customerEmail === active.email
              );
              if (linked.length === 0) return null;

              const STATUS_BADGE: Record<string, string> = {
                paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
                pending: "bg-amber-50 text-amber-700 border-amber-200",
                cancelled: "bg-red-50 text-red-700 border-red-200",
              };

              return (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a8d1a]">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    Linked Transactions ({linked.length})
                  </h3>
                  <div className="space-y-2">
                    {linked.map((txn) => {
                      const progress =
                        txn.stagesTotal > 0
                          ? Math.round((txn.stagesDone / txn.stagesTotal) * 100)
                          : 0;
                      return (
                        <Link
                          key={txn.id}
                          href="/orders"
                          className="block px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900 group-hover:text-[#1a8d1a] transition-colors">
                              {txn.productName}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${STATUS_BADGE[txn.status] ?? ""}`}
                            >
                              {txn.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {txn.id} · {txn.totalPrice}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#1a8d1a] rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-gray-500">
                              {txn.stagesDone}/{txn.stagesTotal}
                            </span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ─── Create Order for this Contact ─── */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              {!showCreateOrder ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setShowCreateOrder(true); setOrderCreated(false); }}
                    className="text-xs px-4 py-2 bg-[#1a8d1a] text-white font-medium rounded-xl hover:bg-[#157a15] transition-all hover:shadow-md active:scale-[0.97] flex items-center gap-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Create Order
                  </button>
                  <Link
                    href="/orders"
                    className="text-xs px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                    Go to Orders
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </Link>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    Create Order for {active.name}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Product</label>
                      <select
                        value={createProductId ?? ""}
                        onChange={(e) => setCreateProductId(e.target.value || null)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a] transition-all bg-white"
                      >
                        <option value="">Select a product…</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    {orderCreated && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        <span className="text-xs font-medium text-emerald-700">Order created! View in Orders & Transactions →</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        disabled={!createProductId || isPending}
                        onClick={() => {
                          if (!createProductId) return;
                          startTransition(async () => {
                            await createOrderFromContact({
                              customerName: active.name,
                              customerEmail: active.email,
                              customerPhone: active.phone ?? undefined,
                              productId: createProductId,
                            });
                            setOrderCreated(true);
                            setCreateProductId(null);
                          });
                        }}
                        className="text-xs px-4 py-2 bg-[#1a8d1a] text-white font-medium rounded-xl hover:bg-[#157a15] transition-all hover:shadow-md active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        {isPending ? "Creating…" : "Create Order"}
                      </button>
                      <button
                        onClick={() => { setShowCreateOrder(false); setCreateProductId(null); setOrderCreated(false); }}
                        className="text-xs px-3 py-2 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer info */}
          <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-4">
            <span className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">{active.email}</span>
            </span>
            {active.phone && (
              <span className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">{active.phone}</span>
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center ${!showDetail ? "hidden xl:flex" : ""}`}>
          <p className="text-sm text-gray-400">Select a contact to view their message</p>
        </div>
      )}
    </div>
  );
}
