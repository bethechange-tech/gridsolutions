/* ──────────────────────────────────────────────
 *  Mailtrap Email Service
 *  Centralised email sending via Mailtrap API.
 *  All outbound emails route through here.
 * ────────────────────────────────────────────── */

import { MailtrapClient } from "mailtrap";

const TOKEN = "4cbf6f5e76a213e3cab3fecea1fd1ba6";

const client = new MailtrapClient({ token: TOKEN });

const sender = {
  email: "hello@tenuq.com",
  name: "TENUQ",
};

const ADMIN_EMAIL = "rasulomeni@gmail.com";

/* ─── Contact Form Email ───────────────────── */

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/** Send contact form submission to admin + confirmation to sender */
export async function sendContactEmail(data: ContactEmailData) {
  // 1. Notify admin
  await client.send({
    from: sender,
    to: [{ email: ADMIN_EMAIL }],
    subject: `[TENUQ Contact] ${data.subject} — ${data.name}`,
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #111; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; font-size: 20px; margin: 0;">New Contact Form Submission</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: 600; color: #6b7280; width: 120px;">Name</td>
              <td style="padding: 8px 12px; color: #111;">${data.name}</td>
            </tr>
            <tr style="background: #fff;">
              <td style="padding: 8px 12px; font-weight: 600; color: #6b7280;">Email</td>
              <td style="padding: 8px 12px; color: #111;"><a href="mailto:${data.email}" style="color: #1a8d1a;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: 600; color: #6b7280;">Phone</td>
              <td style="padding: 8px 12px; color: #111;">${data.phone || "—"}</td>
            </tr>
            <tr style="background: #fff;">
              <td style="padding: 8px 12px; font-weight: 600; color: #6b7280;">Subject</td>
              <td style="padding: 8px 12px; color: #111;">${data.subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;">
            <p style="font-size: 12px; font-weight: 600; color: #6b7280; margin: 0 0 8px;">Message</p>
            <p style="font-size: 14px; color: #111; margin: 0; white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
          </div>
        </div>
      </div>
    `,
    category: "Contact Form",
  });

  // 2. Confirmation to sender
  await client.send({
    from: sender,
    to: [{ email: data.email }],
    subject: `We received your message — TENUQ`,
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #111; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; font-size: 20px; margin: 0;">Thanks for reaching out, ${data.name.split(" ")[0]}!</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
            We've received your message regarding <strong>${data.subject}</strong> and our team will get back to you within 24 hours.
          </p>
          <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 24px;">
            In the meantime, feel free to explore our services or check the status of an existing order.
          </p>
          <a href="https://tenuq.com" style="display: inline-block; background: #1a8d1a; color: #fff; padding: 12px 28px; border-radius: 999px; font-size: 14px; font-weight: 600; text-decoration: none;">
            Visit TENUQ
          </a>
          <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
            — The TENUQ Team
          </p>
        </div>
      </div>
    `,
    category: "Contact Confirmation",
  });
}

/* ─── Order Confirmation Email ─────────────── */

interface OrderEmailData {
  orderId: string;
  transactionId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  orderType: string;
  quantity: number;
  quality: string;
  turnaround: string;
  totalPrice: number;
  currency: string;
  deliveryDays: number;
  timestamp: string;
}

/** Send order confirmation to customer + notification to admin */
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const formattedPrice = `£${data.totalPrice.toFixed(2)}`;
  const formattedDate = new Date(data.timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 1. Order confirmation to customer
  await client.send({
    from: sender,
    to: [{ email: data.customerEmail }],
    subject: `Order Confirmed — ${data.transactionId}`,
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #111; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; font-size: 20px; margin: 0;">Order Confirmed ✓</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 20px;">
            Hi ${data.customerName.split(" ")[0]}, thank you for your order! Here's a summary:
          </p>

          <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
            <div style="padding: 16px 20px; background: #f3f4f6; border-bottom: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280;">Transaction ID</p>
              <p style="margin: 4px 0 0; font-size: 16px; font-weight: 700; color: #111; font-family: 'JetBrains Mono', monospace;">${data.transactionId}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 10px 20px; font-weight: 600; color: #6b7280;">Service</td>
                <td style="padding: 10px 20px; color: #111;">${data.productName}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 10px 20px; font-weight: 600; color: #6b7280;">Type</td>
                <td style="padding: 10px 20px; color: #111; text-transform: capitalize;">${data.orderType}</td>
              </tr>
              <tr>
                <td style="padding: 10px 20px; font-weight: 600; color: #6b7280;">Quality</td>
                <td style="padding: 10px 20px; color: #111; text-transform: capitalize;">${data.quality}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 10px 20px; font-weight: 600; color: #6b7280;">Turnaround</td>
                <td style="padding: 10px 20px; color: #111; text-transform: capitalize;">${data.turnaround}</td>
              </tr>
              <tr>
                <td style="padding: 10px 20px; font-weight: 600; color: #6b7280;">Delivery</td>
                <td style="padding: 10px 20px; color: #111;">${data.deliveryDays} business days</td>
              </tr>
              <tr style="background: #f0fdf4;">
                <td style="padding: 12px 20px; font-weight: 700; color: #111; font-size: 15px;">Total</td>
                <td style="padding: 12px 20px; font-weight: 700; color: #1a8d1a; font-size: 15px;">${formattedPrice}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 20px;">
            You can track your order status at any time:
          </p>
          <a href="https://tenuq.com/track" style="display: inline-block; background: #1a8d1a; color: #fff; padding: 12px 28px; border-radius: 999px; font-size: 14px; font-weight: 600; text-decoration: none;">
            Track Your Order
          </a>
          <p style="font-size: 12px; color: #9ca3af; margin: 24px 0 0;">
            Ordered on ${formattedDate} — ${data.currency}<br/>
            — The TENUQ Team
          </p>
        </div>
      </div>
    `,
    category: "Order Confirmation",
  });

  // 2. Notify admin of new order
  await client.send({
    from: sender,
    to: [{ email: ADMIN_EMAIL }],
    subject: `[TENUQ Order] ${data.transactionId} — ${formattedPrice} — ${data.productName}`,
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a8d1a; padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; font-size: 20px; margin: 0;">💰 New Order Received</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">TXN ID</td><td style="padding: 6px 0; color: #111; font-family: monospace;">${data.transactionId}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Order ID</td><td style="padding: 6px 0; color: #111;">${data.orderId}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Customer</td><td style="padding: 6px 0; color: #111;">${data.customerName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Email</td><td style="padding: 6px 0; color: #111;">${data.customerEmail}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Phone</td><td style="padding: 6px 0; color: #111;">${data.customerPhone}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Product</td><td style="padding: 6px 0; color: #111;">${data.productName}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Type</td><td style="padding: 6px 0; color: #111;">${data.orderType}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Qty</td><td style="padding: 6px 0; color: #111;">${data.quantity}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Quality</td><td style="padding: 6px 0; color: #111;">${data.quality}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Turnaround</td><td style="padding: 6px 0; color: #111;">${data.turnaround}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Delivery</td><td style="padding: 6px 0; color: #111;">${data.deliveryDays} days</td></tr>
            <tr style="border-top: 2px solid #e5e7eb;"><td style="padding: 10px 0; font-weight: 700; color: #111; font-size: 15px;">Total</td><td style="padding: 10px 0; font-weight: 700; color: #1a8d1a; font-size: 15px;">${formattedPrice}</td></tr>
          </table>
        </div>
      </div>
    `,
    category: "Order Notification",
  });
}
