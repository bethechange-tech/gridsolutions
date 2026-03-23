/* ──────────────────────────────────────────────
 *  POST /api/payments
 *  Mock payment processor. Logs full order
 *  details to console.table and returns a TXN ID.
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import type { PaymentPayload } from "@/types/pricing";
import { sendOrderConfirmationEmail } from "@/lib/mailtrap";
import { paymentPayloadSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = paymentPayloadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", issues: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const payload = result.data as PaymentPayload;

  // ── Console logging (requirement) ──
  console.group("🧾 Payment Processed");
  console.table({
    "Order ID": payload.orderId,
    "Customer Name": payload.contact.name,
    "Customer Email": payload.contact.email,
    "Customer Phone": payload.contact.phone,
    "Order Type": payload.config.orderType,
    Product: payload.product.name,
    Quantity: payload.config.quantity,
    Quality: payload.config.quality,
    Turnaround: payload.config.turnaround,
    "Word Count": payload.config.wordCount,
    Images: payload.config.images,
    "Base Total": `£${payload.summary.baseTotal}`,
    "Quality Multiplier": `×${payload.summary.qualityMultiplier}`,
    "Turnaround Surcharge": `£${payload.summary.turnaroundSurcharge}`,
    "Total Price": `£${payload.summary.totalPrice}`,
    "Delivery (days)": payload.summary.deliveryDays,
    Timestamp: payload.timestamp,
  });
  console.groupEnd();

  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Send order confirmation emails (non-blocking)
  sendOrderConfirmationEmail({
    orderId: payload.orderId,
    transactionId,
    customerName: payload.contact.name,
    customerEmail: payload.contact.email,
    customerPhone: payload.contact.phone,
    productName: payload.product.name,
    orderType: payload.config.orderType,
    quantity: payload.config.quantity,
    quality: payload.config.quality,
    turnaround: payload.config.turnaround,
    totalPrice: payload.summary.totalPrice,
    currency: payload.summary.currency,
    deliveryDays: payload.summary.deliveryDays,
    timestamp: payload.timestamp,
  }).catch((err) => console.error("Order email error:", err));

  return NextResponse.json({
    success: true,
    transactionId,
    message: "Payment processed successfully",
  });
}
