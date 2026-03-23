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
import { db } from "@repo/db";

const REGISTERED_KEY = "__tenuq_listeners_registered__";

if (!(globalThis as Record<string, unknown>)[REGISTERED_KEY]) {
  (globalThis as Record<string, unknown>)[REGISTERED_KEY] = true;

  /* ─── Payment Success ──────────────────────── */

  appEvents.on("payment.success", async (data: PaymentSuccessEvent) => {
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    console.log(`📧 [event] payment.success → sending confirmation for ${data.orderId}`);

    try {
      // Persist order (update to paid if pending, or create)
      await db.order.upsert({
        where: { id: data.orderId },
        update: { status: "paid" },
        create: {
          id: data.orderId,
          productId: data.productName, // best available identifier
          orderType: data.orderType,
          quantity: data.quantity,
          quality: data.quality,
          turnaround: data.turnaround,
          totalPrice: Math.round(data.totalPrice * 100),
          currency: data.currency,
          deliveryDays: data.deliveryDays,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          stripeSessionId: data.sessionId,
          status: "paid",
        },
      });

      // Create transaction record
      await db.transaction.create({
        data: {
          id: transactionId,
          orderId: data.orderId,
        },
      });

      // Seed initial consultancy pipeline stages
      const defaultStages = [
        { stageKey: "booking", title: "Booking Confirmed", description: "Your order has been received and confirmed.", status: "completed", sortOrder: 0 },
        { stageKey: "discovery", title: "Discovery", description: "Initial consultation and requirements gathering.", status: "upcoming", sortOrder: 1 },
        { stageKey: "strategy", title: "Strategy", description: "Creating a tailored plan for your project.", status: "upcoming", sortOrder: 2 },
        { stageKey: "implementation", title: "Implementation", description: "Building and executing the solution.", status: "upcoming", sortOrder: 3 },
        { stageKey: "review", title: "Review", description: "Quality assurance and client review.", status: "upcoming", sortOrder: 4 },
        { stageKey: "delivery", title: "Delivery", description: "Final deliverables handed over.", status: "upcoming", sortOrder: 5 },
        { stageKey: "support", title: "Ongoing Support", description: "Post-delivery support and maintenance.", status: "upcoming", sortOrder: 6 },
      ];

      await db.consultancyStage.createMany({
        data: defaultStages.map((s) => ({
          transactionId,
          stageKey: s.stageKey,
          title: s.title,
          description: s.description,
          status: s.status,
          completedAt: s.status === "completed" ? new Date() : null,
          details: [],
          deliverables: [],
          sortOrder: s.sortOrder,
        })),
      });

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
      // Persist contact submission
      await db.contactSubmission.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
        },
      }).catch(() => { /* may already be saved by the action */ });

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
