"use client";

import Link from "next/link";
import { fmtGBP, relativeTime } from "@/lib/utils";

type DashboardStats = {
  totalContacts: number;
  totalOrders: number;
  paidOrders: number;
  totalTransactions: number;
  totalRevenue: number;
  recentContacts: { id: string; name: string; subject: string; createdAt: Date }[];
  recentOrders: {
    id: string;
    customerName: string;
    totalPrice: number;
    status: string;
    createdAt: Date;
    product: { name: string };
  }[];
};

function StatusBadge({ status }: { status: string }) {
  const c: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${c[status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

export default function DashboardContent({ stats }: { stats: DashboardStats }) {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <Kpi label="Contacts" value={stats.totalContacts} href="/contacts" />
        <Kpi label="Orders" value={stats.totalOrders} href="/orders" />
        <Kpi label="Transactions" value={stats.totalTransactions} accent="text-blue-600" href="/orders" />
        <Kpi label="Paid" value={stats.paidOrders} accent="text-emerald-600" href="/orders" />
        <Kpi label="Revenue" value={fmtGBP(stats.totalRevenue)} accent="text-emerald-600" href="/orders" />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/orders" className="text-xs font-medium text-[#1a8d1a] hover:text-[#157a15] transition-colors">View all →</Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {initials(o.customerName)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <strong>{o.customerName}</strong> — {o.product.name} · {fmtGBP(o.totalPrice)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={o.status} />
                      <span className="text-xs text-gray-400">{relativeTime(o.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent contacts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Contacts</h2>
            <Link href="/contacts" className="text-xs font-medium text-[#1a8d1a] hover:text-[#157a15] transition-colors">View all →</Link>
          </div>
          {stats.recentContacts.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No contacts yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentContacts.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {initials(c.name)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <strong>{c.name}</strong> — {c.subject}
                    </p>
                    <span className="text-xs text-gray-400">{relativeTime(c.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, accent = "text-gray-900", href }: { label: string; value: string | number; accent?: string; href?: string }) {
  const inner = (
    <>
      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold tracking-tight ${accent}`}>{typeof value === "number" ? value.toLocaleString() : value}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:border-[#1a8d1a]/30 hover:shadow-md transition-all group">
        {inner}
        <p className="text-[10px] text-gray-400 mt-1 group-hover:text-[#1a8d1a] transition-colors">View →</p>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
      {inner}
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
