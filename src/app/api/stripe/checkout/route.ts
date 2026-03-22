/* ──────────────────────────────────────────────
 *  POST /api/stripe/checkout
 *  Creates a Stripe Checkout Session and returns
 *  the session URL for redirect.
 * ────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { paymentPayloadSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = paymentPayloadSchema.safeParse(body);
  
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const payload = result.data;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: payload.config.orderType === "subscription" ? "subscription" : "payment",
      customer_email: payload.contact.email,
      line_items: [
        {
          price_data: {
            currency: payload.summary.currency.toLowerCase(),
            product_data: {
              name: payload.product.name,
              description: `${payload.product.subtitle} — ${payload.config.orderType === "consultation" ? "One-off consultation" : `${payload.config.quality} tier, ${payload.config.turnaround} turnaround`}`,
              metadata: {
                productId: payload.product.id,
                orderId: payload.orderId,
              },
            },
            ...(payload.config.orderType === "subscription"
              ? {
                  unit_amount: Math.round(payload.summary.totalPrice * 100),
                  recurring: { interval: "month" as const },
                }
              : {
                  unit_amount: Math.round(payload.summary.totalPrice * 100),
                }),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: payload.orderId,
        customerName: payload.contact.name,
        customerPhone: payload.contact.phone,
        productName: payload.product.name,
        orderType: payload.config.orderType,
        quality: payload.config.quality,
        turnaround: payload.config.turnaround,
        quantity: payload.config.quantity.toString(),
        deliveryDays: payload.summary.deliveryDays.toString(),
        totalPrice: payload.summary.totalPrice.toString(),
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
