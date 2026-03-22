/* ──────────────────────────────────────────────
 *  Zod Validation Schemas
 *  Shared between client & server for consistent
 *  validation across the contact form and payments.
 * ────────────────────────────────────────────── */

import { z } from "zod";

/* ─── Contact Form ─────────────────────────── */

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().max(30, "Phone number is too long").optional().or(z.literal("")),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long"),
  message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/* ─── Payment Payload ──────────────────────── */

export const orderConfigSchema = z.object({
  productId: z.string().nullable(),
  orderType: z.enum(["subscription", "consultation"]),
  quantity: z.number().int().min(1),
  wordCount: z.number().int().min(0),
  images: z.number().int().min(0),
  quality: z.enum(["standard", "premium", "expert"]),
  turnaround: z.enum(["standard", "express"]),
});

export const pricingSummarySchema = z.object({
  baseTotal: z.number().min(0),
  qualityMultiplier: z.number().min(0),
  turnaroundSurcharge: z.number().min(0),
  deliveryDays: z.number().int().min(0),
  totalPrice: z.number().min(0),
  currency: z.string(),
});

export const contactInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().min(1, "Phone number is required").regex(/^[\d\s\-+()]{7,}$/, "Enter a valid phone number"),
});

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  subtitle: z.string(),
  description: z.string(),
  category: z.enum(["all", "consulting", "branding"]),
  basePrice: z.number(),
  consultationPrice: z.number(),
  currency: z.string(),
  billingCycle: z.enum(["mo", "yr"]),
  features: z.array(z.string()),
  popular: z.boolean().optional(),
});

export const paymentPayloadSchema = z.object({
  orderId: z.string().min(1),
  config: orderConfigSchema,
  summary: pricingSummarySchema,
  product: productSchema,
  contact: contactInfoSchema,
  timestamp: z.string().datetime(),
});

export type PaymentPayloadData = z.infer<typeof paymentPayloadSchema>;
