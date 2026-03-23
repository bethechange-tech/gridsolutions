"use client";

import { useTransition, useState } from "react";
import SlideOver from "@/components/SlideOver";
import { createStage, updateStage, type StageInput } from "@/lib/actions";

type Props = {
  open: boolean;
  onClose: () => void;
  transactionId: string;
  stageCount: number;
  initial?: { id: string } & StageInput;
};

const STAGE_KEY_OPTIONS = [
  { value: "booking", label: "Booking" },
  { value: "discovery", label: "Discovery" },
  { value: "strategy", label: "Strategy" },
  { value: "design", label: "Design" },
  { value: "development", label: "Development" },
  { value: "review", label: "Review" },
  { value: "delivery", label: "Delivery" },
  { value: "follow-up", label: "Follow-up" },
  { value: "custom", label: "Custom" },
];

const STATUS_OPTIONS = ["upcoming", "in-progress", "completed"] as const;

const empty: StageInput = {
  stageKey: "booking",
  title: "",
  description: "",
  status: "upcoming",
  estimatedDate: "",
  details: [],
  deliverables: [],
  assignedTo: "",
  sortOrder: 0,
};

export default function StageForm({
  open,
  onClose,
  transactionId,
  stageCount,
  initial,
}: Props) {
  const isEdit = !!initial;
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<StageInput>(
    initial ?? { ...empty, sortOrder: stageCount }
  );
  const [detailsText, setDetailsText] = useState(
    (initial?.details ?? []).join("\n")
  );
  const [deliverablesText, setDeliverablesText] = useState(
    (initial?.deliverables ?? []).join("\n")
  );

  const set = <K extends keyof StageInput>(field: K, value: StageInput[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: StageInput = {
      ...form,
      details: detailsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      deliverables: deliverablesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    startTransition(async () => {
      if (isEdit) {
        await updateStage(initial!.id, payload);
      } else {
        await createStage(transactionId, payload);
      }
      onClose();
    });
  }

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Stage" : "Add Stage"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Stage key */}
        <Field label="Stage Type" required>
          <select
            value={form.stageKey}
            onChange={(e) => set("stageKey", e.target.value)}
            className={INPUT}
          >
            {STAGE_KEY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Title */}
        <Field label="Title" required>
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={INPUT}
            placeholder="e.g. Initial Discovery Call"
          />
        </Field>

        {/* Description */}
        <Field label="Description" required>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={INPUT}
            placeholder="What happens in this stage…"
          />
        </Field>

        {/* Status */}
        <Field label="Status" required>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("status", s)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors capitalize ${
                  form.status === s
                    ? s === "completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : s === "in-progress"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>

        {/* Assigned To */}
        <Field label="Assigned To">
          <input
            value={form.assignedTo ?? ""}
            onChange={(e) => set("assignedTo", e.target.value)}
            className={INPUT}
            placeholder="Team member name"
          />
        </Field>

        {/* Estimated Date */}
        <Field label="Estimated Date">
          <input
            type="date"
            value={form.estimatedDate ?? ""}
            onChange={(e) => set("estimatedDate", e.target.value)}
            className={INPUT}
          />
        </Field>

        {/* Sort Order */}
        <Field label="Sort Order">
          <input
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", parseInt(e.target.value) || 0)}
            className={INPUT}
          />
        </Field>

        {/* Details (multi-line) */}
        <Field label="Details (one per line)">
          <textarea
            rows={3}
            value={detailsText}
            onChange={(e) => setDetailsText(e.target.value)}
            className={INPUT}
            placeholder="Detail item 1&#10;Detail item 2"
          />
        </Field>

        {/* Deliverables (multi-line) */}
        <Field label="Deliverables (one per line)">
          <textarea
            rows={3}
            value={deliverablesText}
            onChange={(e) => setDeliverablesText(e.target.value)}
            className={INPUT}
            placeholder="Deliverable 1&#10;Deliverable 2"
          />
        </Field>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-[#1a8d1a] text-white text-sm font-medium rounded-lg hover:bg-[#157a15] transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving…" : isEdit ? "Update Stage" : "Add Stage"}
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
