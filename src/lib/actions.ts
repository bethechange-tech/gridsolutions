/* ──────────────────────────────────────────────
 *  Server Actions
 *  All form submissions run server-side. Each
 *  action returns a typed state object consumed
 *  by useActionState on the client.
 * ────────────────────────────────────────────── */

"use server";

import { contactSchema, paymentPayloadSchema } from "@/lib/validators";
import { sendContactEmail, sendOrderConfirmationEmail } from "@/lib/mailtrap";
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
        await sendContactEmail({
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

/* ─── Payment Processing ──────────────────── */

export type PaymentActionResult = ActionState<{
    transactionId: string;
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

    return {
        success: true,
        data: { transactionId },
        message: "Payment processed successfully",
    };
}
