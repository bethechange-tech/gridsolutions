/* ──────────────────────────────────────────────
 *  Event Listeners
 *  Registers all side-effect handlers for app events.
 *  Imported via instrumentation.ts on server startup.
 *
 *  Each listener runs async and catches its own errors
 *  so it never blocks the emitting code.
 *
 *  Uses a globalThis flag to prevent double-registration.
 * ────────────────────────────────────────────── */

import { appEvents, type PaymentSuccessEvent, type ContactSubmittedEvent } from "@/lib/events";
import { sendOrderConfirmationEmail, sendContactEmail } from "@/lib/mailtrap";

const REGISTERED_KEY = "__tenuq_listeners_registered__";

if (!(globalThis as Record<string, unknown>)[REGISTERED_KEY]) {
  (globalThis as Record<string, unknown>)[REGISTERED_KEY] = true;

  /* ─── Payment Success ──────────────────────── */

  appEvents.on("payment.success", async (data: PaymentSuccessEvent) => {
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    console.log(`📧 [event] payment.success → sending confirmation for ${data.orderId}`);

    try {
      await sendOrderConfirmationEmail({
        orderId: data.orderId,
        transactionId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        productName: data.productName,
        orderType: data.orderType,
        quantity: data.quantity,
        quality: data.quality,
        turnaround: data.turnaround,
        totalPrice: data.totalPrice,
        currency: data.currency,
        deliveryDays: data.deliveryDays,
        timestamp: new Date().toISOString(),
      });
      console.log(`✅ [event] Order confirmation email sent for ${data.orderId}`);
    } catch (err) {
      console.error(`❌ [event] Failed to send order email for ${data.orderId}:`, err);
    }
  });

  /* ─── Contact Form Submitted ───────────────── */

  appEvents.on("contact.submitted", async (data: ContactSubmittedEvent) => {
    console.log(`📧 [event] contact.submitted → sending email from ${data.email}`);

    try {
      await sendContactEmail(data);
      console.log(`✅ [event] Contact email sent for ${data.email}`);
    } catch (err) {
      console.error(`❌ [event] Failed to send contact email for ${data.email}:`, err);
    }
  });

  console.log("🔌 Event listeners registered");
} else {
  console.log("🔌 Event listeners already registered — skipping");
}
