/* ──────────────────────────────────────────────
 *  /checkout/success
 *  Stripe redirects here after a successful payment.
 *  We retrieve the session to show a confirmation.
 * ────────────────────────────────────────────── */

import { stripe } from "@/lib/stripe";
import { appEvents } from "@/lib/events";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/pricing");
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    redirect("/pricing");
  }

  const meta = session.metadata || {};
  const paid = session.payment_status === "paid";

  // Emit event — listeners handle emails asynchronously
  if (paid && session.customer_email) {
    appEvents.emit("payment.success", {
      sessionId: session.id,
      orderId: meta.orderId || session.id,
      customerName: meta.customerName || "Customer",
      customerEmail: session.customer_email,
      customerPhone: meta.customerPhone || "",
      productName: meta.productName || "Service",
      orderType: meta.orderType || "consultation",
      quantity: parseInt(meta.quantity || "1", 10),
      quality: meta.quality || "standard",
      turnaround: meta.turnaround || "standard",
      totalPrice: parseFloat(meta.totalPrice || "0"),
      currency: session.currency?.toUpperCase() || "GBP",
      deliveryDays: parseInt(meta.deliveryDays || "14", 10),
    });
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-[#1a8d1a]/10 flex items-center justify-center mb-6">
          {paid ? (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          {paid ? "Payment successful!" : "Payment pending"}
        </h1>
        <p className="text-gray-500 mb-8">
          {paid
            ? "Thank you for your order. We\u2019ll be in touch shortly to get started."
            : "Your payment is being processed. We\u2019ll send a confirmation once it\u2019s complete."}
        </p>

        {/* Order summary card */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left mb-8 space-y-3">
          {meta.orderId && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Order ID</span>
              <span className="font-mono font-medium text-gray-700 text-xs">{meta.orderId}</span>
            </div>
          )}
          {meta.productName && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Product</span>
              <span className="font-medium text-gray-700">{meta.productName}</span>
            </div>
          )}
          {meta.orderType && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Type</span>
              <span className="font-medium text-gray-700 capitalize">{meta.orderType}</span>
            </div>
          )}
          {meta.totalPrice && (
            <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
              <span className="font-bold text-gray-700">Total paid</span>
              <span className="font-extrabold text-[#1a8d1a]">
                £{parseFloat(meta.totalPrice).toFixed(2)}
              </span>
            </div>
          )}
          {meta.deliveryDays && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated delivery</span>
              <span className="font-medium text-gray-700">{meta.deliveryDays} days</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Confirmation sent to</span>
            <span className="font-medium text-gray-700">{session.customer_email}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-[#1a8d1a] text-white rounded-full px-8 py-3 text-sm font-bold hover:bg-[#157a15] transition-all shadow-lg shadow-[#1a8d1a]/20 w-full sm:w-auto text-center"
          >
            Back to Home
          </Link>
          <Link
            href="/track"
            className="border border-gray-200 text-gray-600 rounded-full px-8 py-3 text-sm font-semibold hover:border-gray-400 hover:text-gray-900 transition-all w-full sm:w-auto text-center"
          >
            Track Your Order
          </Link>
        </div>

        {/* Stripe session ID for reference */}
        <p className="mt-8 text-[11px] text-gray-300 font-mono break-all">
          Session: {session_id}
        </p>
      </div>
    </div>
  );
}
