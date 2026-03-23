/* ──────────────────────────────────────────────
 *  POST /api/stripe/webhook
 *  Handles Stripe webhook events. Emits app events
 *  so listeners handle side-effects (emails, etc.)
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { appEvents } from "@/lib/events";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // If no webhook secret is configured, still process events (dev mode)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Dev fallback — parse raw event (not signature-verified)
      event = JSON.parse(body) as Stripe.Event;
      console.warn("⚠️  Stripe webhook signature not verified (STRIPE_WEBHOOK_SECRET not set)");
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook signature failed" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata || {};

      console.group("🧾 Stripe Payment Completed");
      console.table({
        "Session ID": session.id,
        "Order ID": meta.orderId,
        "Customer Name": meta.customerName,
        "Customer Email": session.customer_email,
        "Customer Phone": meta.customerPhone,
        "Product": meta.productName,
        "Order Type": meta.orderType,
        "Quality": meta.quality,
        "Turnaround": meta.turnaround,
        "Quantity": meta.quantity,
        "Total": `£${meta.totalPrice}`,
        "Delivery Days": meta.deliveryDays,
        "Stripe Payment Status": session.payment_status,
      });
      console.groupEnd();

      // Emit event — listeners handle email asynchronously
      if (session.customer_email) {
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

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`⏰ Checkout session expired: ${session.id}`);
      break;
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
