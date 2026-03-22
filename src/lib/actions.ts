/* ──────────────────────────────────────────────
 *  Server Actions
 *  All form submissions run server-side. Each
 *  action returns a typed state object consumed
 *  by useActionState on the client.
 * ────────────────────────────────────────────── */

"use server";

import { contactSchema, paymentPayloadSchema } from "@/lib/validators";
import { appEvents } from "@/lib/events";
import { z } from "zod";
import { MOCK_TRANSACTIONS as transactions } from "@/data/transactions";

/* ─── Shared result type ───────────────────── */

export type ActionState<T = null> = {
    success: boolean;
    errors?: Record<string, string>;
    message?: string;
    data?: T;
};

/* ─── Contact Form ─────────────────────────── */

export async function submitContactForm(
    _prev: ActionState,
    formData: FormData
): Promise<ActionState> {
    const raw = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
    };

    const result = contactSchema.safeParse(raw);

    if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
            const field = issue.path[0] as string;
            if (!fieldErrors[field]) fieldErrors[field] = issue.message;
        }
        return { success: false, errors: fieldErrors };
    }

    try {
        appEvents.emit("contact.submitted", {
            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone || "",
            subject: result.data.subject,
            message: result.data.message,
        });
        return { success: true, message: "Message sent successfully" };
    } catch (err) {
        console.error("Contact email error:", err);
        return { success: false, message: "Failed to send message. Please try again." };
    }
}

/* ─── Transaction Lookup ───────────────────── */

const transactionLookupSchema = z.object({
    txnId: z.string().min(1, "Transaction ID is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export type TransactionLookupResult = ActionState<{
    transactionId: string;
    email: string;
    customerName: string;
    phone: string;
    productName: string;
    orderType: string;
    totalPaid: number;
    currency: string;
    bookedAt: string;
    stages: Array<{
        id: string;
        title: string;
        description: string;
        status: string;
        completedAt?: string;
        estimatedDate?: string;
        details: string[];
        deliverables?: string[];
        assignedTo?: string;
    }>;
}>;

export async function lookupTransactionAction(
    _prev: TransactionLookupResult,
    formData: FormData
): Promise<TransactionLookupResult> {
    const raw = {
        txnId: formData.get("txnId") as string,
        email: formData.get("email") as string,
    };

    const result = transactionLookupSchema.safeParse(raw);

    if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
            const field = issue.path[0] as string;
            if (!fieldErrors[field]) fieldErrors[field] = issue.message;
        }
        return { success: false, errors: fieldErrors };
    }

    const { txnId, email } = result.data;

    const txn = transactions.find(
        (t) =>
            t.transactionId.toLowerCase() === txnId.toLowerCase() &&
            t.email.toLowerCase() === email.toLowerCase()
    );

    if (!txn) {
        return {
            success: false,
            message: "No transaction found. Please check your Transaction ID and email address.",
        };
    }

    return { success: true, data: txn };
}

/* ─── Payment Processing (Stripe Checkout) ── */

export type PaymentActionResult = ActionState<{
    sessionUrl: string;
}>;

export async function processPaymentAction(
    _prev: PaymentActionResult,
    formData: FormData
): Promise<PaymentActionResult> {
    const rawPayload = formData.get("payload") as string;

    let parsed: unknown;
    try {
        parsed = JSON.parse(rawPayload);
    } catch {
        return { success: false, message: "Invalid payment data" };
    }

    const result = paymentPayloadSchema.safeParse(parsed);

    if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
            const field = issue.path.join(".") as string;
            if (!fieldErrors[field]) fieldErrors[field] = issue.message;
        }
        return { success: false, errors: fieldErrors, message: "Validation failed" };
    }

    const payload = result.data;

    // Console logging
    console.group("🧾 Creating Stripe Checkout Session");
    console.table({
        "Order ID": payload.orderId,
        "Customer Name": payload.contact.name,
        "Customer Email": payload.contact.email,
        "Order Type": payload.config.orderType,
        Product: payload.product.name,
        "Total Price": `£${payload.summary.totalPrice}`,
    });
    console.groupEnd();

    try {
        // Import stripe server-side only
        const { stripe } = await import("@/lib/stripe");

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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

        return {
            success: true,
            data: { sessionUrl: session.url! },
            message: "Redirecting to Stripe Checkout…",
        };
    } catch (err) {
        console.error("Stripe checkout error:", err);
        return {
            success: false,
            message: "Failed to create checkout session. Please try again.",
        };
    }
}
