import { db } from "@repo/db";

export { fmtGBP, fmtDate, fmtDateTime, relativeTime } from "./utils";

/* ──────────────── Dashboard ──────────────── */

export async function getDashboardStats() {
  const [
    totalContacts,
    totalOrders,
    paidOrders,
    totalTransactions,
    recentContacts,
    recentOrders,
  ] = await Promise.all([
    db.contactSubmission.count(),
    db.order.count(),
    db.order.count({ where: { status: "paid" } }),
    db.transaction.count(),
    db.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: true },
    }),
  ]);

  const rev = await db.order.aggregate({
    _sum: { totalPrice: true },
    where: { status: "paid" },
  });

  return {
    totalContacts,
    totalOrders,
    paidOrders,
    totalTransactions,
    totalRevenue: rev._sum.totalPrice ?? 0,
    recentContacts,
    recentOrders,
  };
}

/* ──────────────── Contacts ──────────────── */

export async function getContacts() {
  return db.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
}

/* ──────────────── Orders (+ pipeline) ──────────────── */

export async function getOrders() {
  return db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
      transaction: { include: { stages: { orderBy: { sortOrder: "asc" } } } },
    },
  });
}

export async function getRevenueStats() {
  const [paid, pending, cancelledCount] = await Promise.all([
    db.order.aggregate({ _sum: { totalPrice: true }, _count: true, where: { status: "paid" } }),
    db.order.aggregate({ _sum: { totalPrice: true }, _count: true, where: { status: "pending" } }),
    db.order.count({ where: { status: "cancelled" } }),
  ]);
  return {
    totalRevenue: paid._sum.totalPrice ?? 0,
    paidCount: paid._count ?? 0,
    pendingRevenue: pending._sum.totalPrice ?? 0,
    pendingCount: pending._count ?? 0,
    cancelledCount,
  };
}

/* ──────────────── Transactions ──────────────── */

export async function getTransactions() {
  return db.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      order: { include: { product: true } },
      stages: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getOrdersWithoutTransaction() {
  return db.order.findMany({
    where: { transaction: null },
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });
}

export async function getContactsByEmails(emails: string[]) {
  if (emails.length === 0) return [];
  return db.contactSubmission.findMany({
    where: { email: { in: emails } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTransactionsByEmails(emails: string[]) {
  if (emails.length === 0) return [];

  return db.transaction.findMany({
    where: { order: { customerEmail: { in: emails } } },
    orderBy: { createdAt: "desc" },
    include: {
      order: { include: { product: true } },
      stages: { orderBy: { sortOrder: "asc" } },
    },
  });
}

/* ──────────────── Content (blog + products) ──────────────── */

export async function getBlogPosts() {
  return db.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function getBlogPostBySlug(slug: string) {
  return db.blogPost.findUnique({ where: { slug } });
}

export async function getRecentBlogPosts(excludeSlug?: string, take = 6) {
  return db.blogPost.findMany({
    where: excludeSlug ? { slug: { not: excludeSlug } } : undefined,
    orderBy: { publishedAt: "desc" },
    take,
    select: {
      slug: true,
      title: true,
      coverIcon: true,
      coverGradient: true,
      category: true,
      readTime: true,
      publishedAt: true,
    },
  });
}

export async function getProducts() {
  return db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });
}

/* ──────── Product list (for dropdowns) ──────── */

export async function getProductsList() {
  return db.product.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

/* ──────────────── Charity Projects ──────────────── */
export const CHARITY_ACTIVE_LIMIT = 5; // tweak this constant to change the cap

export async function getCharityProjects() {
  return db.charityProject.findMany({
    orderBy: { createdAt: "desc" },
    include: { tasks: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getCharityProject(id: string) {
  return db.charityProject.findUnique({
    where: { id },
    include: { tasks: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getCharityStats() {
  const [applied, accepted, inProgress, completed, rejected] = await Promise.all([
    db.charityProject.count({ where: { status: "applied" } }),
    db.charityProject.count({ where: { status: "accepted" } }),
    db.charityProject.count({ where: { status: "in-progress" } }),
    db.charityProject.count({ where: { status: "completed" } }),
    db.charityProject.count({ where: { status: "rejected" } }),
  ]);
  const activeCount = accepted + inProgress; // slots used
  return { applied, accepted, inProgress, completed, rejected, activeCount, limit: CHARITY_ACTIVE_LIMIT };
}
