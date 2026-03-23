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
import { db } from "@repo/db";

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
        // Persist to database
        await db.contactSubmission.create({
            data: {
                name: result.data.name,
                email: result.data.email,
                phone: result.data.phone || null,
                subject: result.data.subject,
                message: result.data.message,
            },
        });

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

    const txn = await db.transaction.findFirst({
        where: {
            id: { equals: txnId, mode: "insensitive" },
            order: { customerEmail: { equals: email, mode: "insensitive" } },
        },
        include: {
            order: true,
            stages: { orderBy: { sortOrder: "asc" } },
        },
    });

    if (!txn) {
        return {
            success: false,
            message: "No transaction found. Please check your Transaction ID and email address.",
        };
    }

    return {
        success: true,
        data: {
            transactionId: txn.id,
            email: txn.order.customerEmail,
            customerName: txn.order.customerName,
            phone: txn.order.customerPhone,
            productName: txn.order.productId,
            orderType: txn.order.orderType,
            totalPaid: txn.order.totalPrice / 100,
            currency: txn.order.currency,
            bookedAt: txn.bookedAt.toISOString(),
            stages: txn.stages.map((s) => ({
                id: s.stageKey,
                title: s.title,
                description: s.description,
                status: s.status,
                completedAt: s.completedAt?.toISOString(),
                estimatedDate: s.estimatedDate?.toISOString(),
                details: s.details,
                deliverables: s.deliverables,
                assignedTo: s.assignedTo ?? undefined,
            })),
        },
    };
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

/* ─── Charity Application ──────────────────── */

const charityApplicationSchema = z.object({
  charityName: z.string().min(1, "Charity name is required").max(200),
  charityNumber: z.string().max(30).optional().or(z.literal("")),
  contactName: z.string().min(1, "Your name is required").max(120),
  contactEmail: z.string().min(1, "Email is required").email("Enter a valid email"),
  contactPhone: z.string().max(30).optional().or(z.literal("")),
  website: z.string().max(300).optional().or(z.literal("")),
  description: z.string().min(10, "Tell us about your charity (at least 10 characters)").max(5000),
});

export async function submitCharityApplication(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    charityName: formData.get("charityName") as string,
    charityNumber: formData.get("charityNumber") as string,
    contactName: formData.get("contactName") as string,
    contactEmail: formData.get("contactEmail") as string,
    contactPhone: formData.get("contactPhone") as string,
    website: formData.get("website") as string,
    description: formData.get("description") as string,
  };

  const result = charityApplicationSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { success: false, errors: fieldErrors };
  }

  try {
    // Check current active count (accepted + in-progress)
    const activeCount = await db.charityProject.count({
      where: { status: { in: ["accepted", "in-progress"] } },
    });

    const LIMIT = 5;
    if (activeCount >= LIMIT) {
      // Still accept the application — it queues as "applied"
    }

    await db.charityProject.create({
      data: {
        charityName: result.data.charityName,
        charityNumber: result.data.charityNumber || null,
        contactName: result.data.contactName,
        contactEmail: result.data.contactEmail,
        contactPhone: result.data.contactPhone || null,
        website: result.data.website || null,
        description: result.data.description,
        status: "applied",
        needsLogo: (formData.get("needsLogo") === "on"),
        needsColours: (formData.get("needsColours") === "on"),
        needsWebsite: (formData.get("needsWebsite") === "on"),
        needsDonations: (formData.get("needsDonations") === "on"),
        needsPayments: (formData.get("needsPayments") === "on"),
      },
    });

    return { success: true, message: "Application submitted! We'll be in touch soon." };
  } catch (err) {
    console.error("Charity application error:", err);
    return { success: false, message: "Failed to submit application. Please try again." };
  }
}
