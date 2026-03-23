"use client";

import { useTransition, useState } from "react";
import SlideOver from "@/components/SlideOver";
import { updateContact, type ContactInput } from "@/lib/actions";

type Props = {
  open: boolean;
  onClose: () => void;
  initial: { id: string } & ContactInput;
};

export default function ContactForm({ open, onClose, initial }: Props) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<ContactInput>(initial);

  const set = (field: keyof ContactInput, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await updateContact(initial.id, form);
      onClose();
    });
  }

  return (
    <SlideOver open={open} onClose={onClose} title="Edit Contact">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name" required>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="Email" required>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="Phone">
          <input
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="Subject" required>
          <input
            required
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            className={INPUT}
          />
        </Field>
        <Field label="Message" required>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            className={INPUT}
          />
        </Field>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-[#1a8d1a] text-white text-sm font-medium rounded-lg hover:bg-[#157a15] transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Update Contact"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </SlideOver>
  );
}

const INPUT =
  "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a] transition-all";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600 mb-1 block">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
