import TopBar from "@/components/TopBar";
import {
  getTransactions,
  getOrdersWithoutTransaction,
  getRevenueStats,
  getContactsByEmails,
  getProductsList,
  getContacts,
  relativeTime,
} from "@/lib/data";
import KanbanBoard from "./KanbanBoard";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [transactions, ordersWithoutTxn, rev, productsList, allContactsRaw] = await Promise.all([
    getTransactions(),
    getOrdersWithoutTransaction(),
    getRevenueStats(),
    getProductsList(),
    getContacts(),
  ]);

  // Collect unique customer emails to find linked contacts
  const allEmails = [
    ...new Set([
      ...transactions.map((t) => t.order.customerEmail),
      ...ordersWithoutTxn.map((o) => o.customerEmail),
    ]),
  ];
  const contacts = await getContactsByEmails(allEmails);

  // Serialise dates for client component
  const txns = transactions.map((t) => ({
    ...t,
    bookedAt: t.bookedAt.toISOString(),
    stages: t.stages.map((s) => ({
      ...s,
      estimatedDate: s.estimatedDate?.toISOString() ?? null,
      completedAt: s.completedAt?.toISOString() ?? null,
    })),
  }));

  const pending = ordersWithoutTxn.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
  }));

  const contactMap = contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    subject: c.subject,
    timeAgo: relativeTime(c.createdAt),
  }));

  const allContactsMapped = allContactsRaw.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
  }));

  return (
    <>
      <TopBar title="Orders & Transactions" />
      <div className="p-4 sm:p-6">
        <KanbanBoard
          transactions={txns}
          ordersWithoutTxn={pending}
          rev={rev}
          contacts={contactMap}
          products={productsList}
          allContacts={allContactsMapped}
        />
      </div>
    </>
  );
}
