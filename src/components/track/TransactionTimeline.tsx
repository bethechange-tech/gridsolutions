/* ──────────────────────────────────────────────
 *  Transaction Timeline — expandable stage pipeline
 *  Shows the consultancy lifecycle with status
 *  indicators, details, deliverables, and assignments.
 * ────────────────────────────────────────────── */

"use client";

import { useState } from "react";
import type { TrackedTransaction, ConsultancyStage, StageStatus } from "@/types/pricing";

interface Props {
  transaction: TrackedTransaction;
  onBack: () => void;
}

export default function TransactionTimeline({ transaction, onBack }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(() => {
    // Auto-expand the current in-progress stage
    const inProgress = transaction.stages.find((s) => s.status === "in-progress");
    return inProgress?.id ?? null;
  });

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const completedCount = transaction.stages.filter((s) => s.status === "completed").length;
  const totalStages = transaction.stages.length;
  const progressPercent = Math.round((completedCount / totalStages) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 group"
      >
        <span className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </span>
        Search again
      </button>

      {/* Order summary card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="bg-gray-900 px-6 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-white">{transaction.productName}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{transaction.customerName} · {transaction.email}</p>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1a8d1a] text-white">
                {transaction.orderType}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Transaction ID</p>
              <p className="font-mono font-bold text-gray-700">{transaction.transactionId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Booked</p>
              <p className="font-semibold text-gray-700">
                {new Date(transaction.bookedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Total Paid</p>
              <p className="font-extrabold text-[#1a8d1a] text-lg">£{transaction.totalPaid}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-400">Overall Progress</span>
              <span className="font-bold text-gray-700">{completedCount}/{totalStages} stages · {progressPercent}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a8d1a] rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline stages */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">Consultancy Pipeline</h2>
      <div className="space-y-0">
        {transaction.stages.map((stage, idx) => (
          <StageCard
            key={stage.id}
            stage={stage}
            index={idx}
            isLast={idx === totalStages - 1}
            expanded={expandedId === stage.id}
            onToggle={() => toggle(stage.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Stage Card ─────────────────────────────── */

function StageCard({
  stage,
  index,
  isLast,
  expanded,
  onToggle,
}: {
  stage: ConsultancyStage;
  index: number;
  isLast: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline rail */}
      <div className="flex flex-col items-center shrink-0 w-10">
        {/* Dot */}
        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${statusDotClasses(stage.status)}`}>
          {stage.status === "completed" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {stage.status === "in-progress" && (
            <>
              <span className="absolute inset-0 rounded-full bg-[#1a8d1a]/20 animate-ping" style={{ animationDuration: "2s" }} />
              <span className="w-3 h-3 rounded-full bg-[#1a8d1a]" />
            </>
          )}
          {stage.status === "upcoming" && (
            <span className="text-xs font-bold">{index + 1}</span>
          )}
        </div>
        {/* Connector line */}
        {!isLast && (
          <div className={`w-0.5 flex-1 min-h-4 ${
            stage.status === "completed" ? "bg-[#1a8d1a]" : "bg-gray-200"
          }`} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-6 ${isLast ? "pb-0" : ""}`}>
        <button
          onClick={onToggle}
          className="w-full text-left bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-bold text-gray-900">{stage.title}</h3>
                <StatusBadge status={stage.status} />
              </div>
              <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{stage.description}</p>
            </div>
            <svg
              className={`shrink-0 ml-3 w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-all duration-200 ${expanded ? "rotate-180" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {/* Expanded section */}
        <div className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-5 space-y-4">
            {/* Dates */}
            <div className="flex flex-wrap gap-4 text-xs">
              {stage.completedAt && (
                <div className="flex items-center gap-1.5 text-[#1a8d1a]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Completed {new Date(stage.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              )}
              {stage.estimatedDate && (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Est. {new Date(stage.estimatedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              )}
              {stage.assignedTo && (
                <div className="flex items-center gap-1.5 text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  {stage.assignedTo}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Details</p>
              <ul className="space-y-1.5">
                {stage.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      stage.status === "completed" ? "bg-[#1a8d1a]" : stage.status === "in-progress" ? "bg-amber-400" : "bg-gray-300"
                    }`} />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables */}
            {stage.deliverables && stage.deliverables.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Deliverables</p>
                <div className="flex flex-wrap gap-2">
                  {stage.deliverables.map((del, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                        stage.status === "completed"
                          ? "bg-[#1a8d1a]/10 text-[#1a8d1a]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      {del}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Status helpers ─────────────────────────── */

function StatusBadge({ status }: { status: StageStatus }) {
  const map = {
    completed: "bg-[#1a8d1a]/10 text-[#1a8d1a]",
    "in-progress": "bg-amber-50 text-amber-600",
    upcoming: "bg-gray-100 text-gray-400",
  };
  const labels = { completed: "Completed", "in-progress": "In Progress", upcoming: "Upcoming" };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

function statusDotClasses(status: StageStatus): string {
  switch (status) {
    case "completed":
      return "bg-[#1a8d1a] border-[#1a8d1a] text-white";
    case "in-progress":
      return "bg-white border-[#1a8d1a] text-[#1a8d1a]";
    case "upcoming":
      return "bg-gray-50 border-gray-200 text-gray-400";
  }
}
