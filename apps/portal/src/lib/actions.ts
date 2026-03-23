"use server";

import { db } from "@repo/db";
import { revalidatePath } from "next/cache";

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

function uid(prefix: string) {
  const ts = Math.floor(Date.now() / 1000);
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/contacts");
  revalidatePath("/orders");
  revalidatePath("/content");
  revalidatePath("/charities");
}

/* ═══════════════════════════════════════════
   Contacts  (read-only inbox — edit & delete only)
   ═══════════════════════════════════════════ */

export type ContactInput = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export async function updateContact(id: string, data: ContactInput) {
  await db.contactSubmission.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
    },
  });
  revalidateAll();
}

export async function deleteContact(id: string) {
  await db.contactSubmission.delete({ where: { id } });
  revalidateAll();
}

/* ═══════════════════════════════════════════
   Orders  (status management only — created from website)
   ═══════════════════════════════════════════ */

export async function updateOrderStatus(id: string, status: string) {
  await db.order.update({ where: { id }, data: { status } });
  revalidateAll();
}

/* ── Create Order from a Contact ── */

export type CreateOrderFromContactInput = {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productId: string;
  orderType?: string;
  quantity?: number;
  quality?: string;
  turnaround?: string;
};

export async function createOrderFromContact(data: CreateOrderFromContactInput) {
  const product = await db.product.findUnique({ where: { id: data.productId } });
  if (!product) throw new Error("Product not found");

  const totalPrice = product.basePrice * (data.quantity ?? 1);
  const orderId = uid("ORD");

  await db.order.create({
    data: {
      id: orderId,
      productId: data.productId,
      orderType: data.orderType ?? "consultation",
      quantity: data.quantity ?? 1,
      quality: data.quality ?? "standard",
      turnaround: data.turnaround ?? "standard",
      totalPrice,
      currency: "GBP",
      deliveryDays: 14,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone ?? "",
      status: "pending",
    },
  });
  revalidateAll();
  return orderId;
}

/* ═══════════════════════════════════════════
   Transactions  ★ core chore management ★
   ═══════════════════════════════════════════ */

export async function createTransaction(orderId: string) {
  // Guard: don't create duplicate
  const existing = await db.transaction.findUnique({ where: { orderId } });
  if (existing) throw new Error("Transaction already exists for this order.");

  const txnId = uid("TXN");
  await db.transaction.create({
    data: { id: txnId, orderId },
  });
  revalidateAll();
  return txnId;
}

export async function deleteTransaction(id: string) {
  // Cascade deletes stages via schema
  await db.transaction.delete({ where: { id } });
  revalidateAll();
}

/* ═══════════════════════════════════════════
   Consultancy Stages  (write & edit chores)
   ═══════════════════════════════════════════ */

export type StageInput = {
  stageKey: string;
  title: string;
  description: string;
  status: string;
  estimatedDate?: string; // ISO string
  details: string[];
  deliverables: string[];
  assignedTo?: string;
  sortOrder: number;
};

export async function createStage(transactionId: string, data: StageInput) {
  await db.consultancyStage.create({
    data: {
      transactionId,
      stageKey: data.stageKey,
      title: data.title,
      description: data.description,
      status: data.status,
      estimatedDate: data.estimatedDate ? new Date(data.estimatedDate) : null,
      details: data.details,
      deliverables: data.deliverables,
      assignedTo: data.assignedTo || null,
      sortOrder: data.sortOrder,
      completedAt: data.status === "completed" ? new Date() : null,
    },
  });
  revalidateAll();
}

export async function updateStage(id: string, data: StageInput) {
  await db.consultancyStage.update({
    where: { id },
    data: {
      stageKey: data.stageKey,
      title: data.title,
      description: data.description,
      status: data.status,
      estimatedDate: data.estimatedDate ? new Date(data.estimatedDate) : null,
      details: data.details,
      deliverables: data.deliverables,
      assignedTo: data.assignedTo || null,
      sortOrder: data.sortOrder,
      completedAt: data.status === "completed" ? new Date() : null,
    },
  });
  revalidateAll();
}

export async function updateStageStatus(id: string, status: string) {
  await db.consultancyStage.update({
    where: { id },
    data: { status, completedAt: status === "completed" ? new Date() : null },
  });
  revalidatePath("/orders");
  revalidatePath("/");
}

export async function deleteStage(id: string) {
  await db.consultancyStage.delete({ where: { id } });
  revalidateAll();
}

/* ═══════════════════════════════════════════
   Blog Posts
   ═══════════════════════════════════════════ */

export type BlogPostInput = {
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  category: string;
  authorName: string;
  authorAvatar?: string;
  readTime: string;
  coverGradient?: string;
  coverIcon: string;
  featured: boolean;
};

export async function createBlogPost(data: BlogPostInput) {
  await db.blogPost.create({
    data: {
      slug: data.slug || slugify(data.title),
      title: data.title,
      excerpt: data.excerpt,
      content: data.content || null,
      category: data.category,
      authorName: data.authorName,
      authorAvatar: data.authorAvatar || "bg-emerald-500",
      readTime: data.readTime,
      coverGradient: data.coverGradient || "from-emerald-500 to-teal-600",
      coverIcon: data.coverIcon,
      featured: data.featured,
    },
  });
  revalidateAll();
}

export async function updateBlogPost(id: string, data: BlogPostInput) {
  await db.blogPost.update({
    where: { id },
    data: {
      slug: data.slug || slugify(data.title),
      title: data.title,
      excerpt: data.excerpt,
      content: data.content || null,
      category: data.category,
      authorName: data.authorName,
      authorAvatar: data.authorAvatar || "bg-emerald-500",
      readTime: data.readTime,
      coverGradient: data.coverGradient || "from-emerald-500 to-teal-600",
      coverIcon: data.coverIcon,
      featured: data.featured,
    },
  });
  revalidateAll();
}

export async function deleteBlogPost(id: string) {
  await db.blogPost.delete({ where: { id } });
  revalidateAll();
}

export async function toggleBlogFeatured(id: string, featured: boolean) {
  await db.blogPost.update({ where: { id }, data: { featured } });
  revalidatePath("/content");
}

/* ═══════════════════════════════════════════
   Products
   ═══════════════════════════════════════════ */

export type ProductInput = {
  id?: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  basePrice: number;
  consultationPrice: number;
  billingCycle: string;
  features: string[];
  popular: boolean;
};

export async function createProduct(data: ProductInput) {
  await db.product.create({
    data: {
      id: data.id || slugify(data.name),
      name: data.name,
      subtitle: data.subtitle,
      description: data.description,
      category: data.category,
      basePrice: data.basePrice,
      consultationPrice: data.consultationPrice,
      currency: "GBP",
      billingCycle: data.billingCycle,
      features: data.features,
      popular: data.popular,
    },
  });
  revalidateAll();
}

export async function updateProduct(id: string, data: ProductInput) {
  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      subtitle: data.subtitle,
      description: data.description,
      category: data.category,
      basePrice: data.basePrice,
      consultationPrice: data.consultationPrice,
      billingCycle: data.billingCycle,
      features: data.features,
      popular: data.popular,
    },
  });
  revalidateAll();
}

export async function deleteProduct(id: string) {
  const count = await db.order.count({ where: { productId: id } });
  if (count > 0) throw new Error(`Cannot delete — ${count} order(s) linked.`);
  await db.product.delete({ where: { id } });
  revalidateAll();
}

export async function toggleProductPopular(id: string, popular: boolean) {
  await db.product.update({ where: { id }, data: { popular } });
  revalidatePath("/content");
}

/* ═══════════════════════════════════════════
   Charity Projects  (free branding service)
   ═══════════════════════════════════════════ */

export type CharityApplicationInput = {
  charityName: string;
  charityNumber?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  description: string;
  needsLogo?: boolean;
  needsColours?: boolean;
  needsWebsite?: boolean;
  needsDonations?: boolean;
  needsPayments?: boolean;
};

export async function submitCharityApplication(data: CharityApplicationInput) {
  const project = await db.charityProject.create({
    data: {
      charityName: data.charityName,
      charityNumber: data.charityNumber || null,
      contactName: data.contactName,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || null,
      website: data.website || null,
      description: data.description,
      status: "applied",
      needsLogo: data.needsLogo ?? true,
      needsColours: data.needsColours ?? true,
      needsWebsite: data.needsWebsite ?? true,
      needsDonations: data.needsDonations ?? true,
      needsPayments: data.needsPayments ?? false,
    },
  });
  revalidateAll();
  return project.id;
}

export async function updateCharityStatus(id: string, status: string) {
  await db.charityProject.update({ where: { id }, data: { status } });
  revalidateAll();
}

export async function updateCharityNotes(id: string, notes: string) {
  await db.charityProject.update({ where: { id }, data: { notes } });
  revalidatePath("/charities");
}

export async function deleteCharityProject(id: string) {
  await db.charityProject.delete({ where: { id } }); // cascade deletes tasks
  revalidateAll();
}

/* ── Charity Tasks (kanban items) ── */

export type CharityTaskInput = {
  taskKey: string;
  title: string;
  description: string;
  status: string;
  estimatedDate?: string;
  deliverables: string[];
  assignedTo?: string;
  sortOrder: number;
};

export async function createCharityTask(projectId: string, data: CharityTaskInput) {
  await db.charityTask.create({
    data: {
      projectId,
      taskKey: data.taskKey,
      title: data.title,
      description: data.description,
      status: data.status,
      estimatedDate: data.estimatedDate ? new Date(data.estimatedDate) : null,
      deliverables: data.deliverables,
      assignedTo: data.assignedTo || null,
      sortOrder: data.sortOrder,
      completedAt: data.status === "completed" ? new Date() : null,
    },
  });
  revalidateAll();
}

export async function updateCharityTask(id: string, data: CharityTaskInput) {
  await db.charityTask.update({
    where: { id },
    data: {
      taskKey: data.taskKey,
      title: data.title,
      description: data.description,
      status: data.status,
      estimatedDate: data.estimatedDate ? new Date(data.estimatedDate) : null,
      deliverables: data.deliverables,
      assignedTo: data.assignedTo || null,
      sortOrder: data.sortOrder,
      completedAt: data.status === "completed" ? new Date() : null,
    },
  });
  revalidateAll();
}

export async function updateCharityTaskStatus(id: string, status: string) {
  await db.charityTask.update({
    where: { id },
    data: { status, completedAt: status === "completed" ? new Date() : null },
  });
  revalidatePath("/charities");
}

export async function deleteCharityTask(id: string) {
  await db.charityTask.delete({ where: { id } });
  revalidateAll();
}
