import TopBar from "@/components/TopBar";
import { getContacts, getTransactionsByEmails, getProductsList, fmtDateTime, fmtGBP, relativeTime } from "@/lib/data";
import { deleteContact } from "@/lib/actions";
import ContactList from "./ContactList";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const [contacts, productsList] = await Promise.all([
    getContacts(),
    getProductsList(),
  ]);

  // Fetch linked transactions for all contact emails
  const emails = [...new Set(contacts.map((c) => c.email))];
  const transactions = await getTransactionsByEmails(emails);

  const mapped = contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    subject: c.subject,
    message: c.message,
    createdAt: fmtDateTime(c.createdAt),
    initials: c.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    timeAgo: relativeTime(c.createdAt),
  }));

  const linkedTxns = transactions.map((t) => ({
    id: t.id,
    customerEmail: t.order.customerEmail,
    customerName: t.order.customerName,
    productName: t.order.product.name,
    totalPrice: fmtGBP(t.order.totalPrice),
    status: t.order.status,
    stagesDone: t.stages.filter((s) => s.status === "completed").length,
    stagesTotal: t.stages.length,
  }));

  return (
    <>
      <TopBar title="Contacts" />
      <div className="p-4 sm:p-6">
        {contacts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No contacts yet</h3>
            <p className="text-sm text-gray-500">Contact submissions from the website will appear here.</p>
          </div>
        ) : (
          <ContactList contacts={mapped} linkedTransactions={linkedTxns} products={productsList} />
        )}
      </div>
    </>
  );
}
