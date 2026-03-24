"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  MeasuringStrategy,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type CollisionDetection,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import StageForm from "./StageForm";
import {
  createTransaction,
  deleteTransaction,
  updateStageStatus,
  deleteStage,
  createOrderFromContact,
  type StageInput,
} from "@/lib/actions";
import { fmtGBP, fmtDate } from "@/lib/utils";

/* ══════════════════════════════════════════
   Types
   ══════════════════════════════════════════ */

type Stage = {
  id: string;
  stageKey: string;
  title: string;
  description: string;
  status: string;
  estimatedDate: string | null;
  completedAt: string | null;
  details: string[];
  deliverables: string[];
  assignedTo: string | null;
  sortOrder: number;
};

type Transaction = {
  id: string;
  orderId: string;
  bookedAt: string;
  order: {
    id: string;
    customerName: string;
    customerEmail: string;
    totalPrice: number;
    status: string;
    product: { name: string };
  };
  stages: Stage[];
};

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  product: { name: string };
};

type LinkedContact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  timeAgo: string;
};

type ProductOption = {
  id: string;
  name: string;
};

type AllContact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

type RevStats = {
  totalRevenue: number;
  paidCount: number;
  pendingRevenue: number;
  pendingCount: number;
  cancelledCount: number;
};

type Props = {
  transactions: Transaction[];
  ordersWithoutTxn: Order[];
  rev: RevStats;
  contacts: LinkedContact[];
  products: ProductOption[];
  allContacts: AllContact[];
};

const STATUS_BADGE: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const COLUMNS: { key: string; label: string; color: string; dot: string; bg: string; dropBg: string; icon: string }[] = [
  { key: "upcoming", label: "Upcoming", color: "border-t-slate-400", dot: "bg-slate-400", bg: "bg-slate-50/60", dropBg: "bg-slate-100/80 ring-2 ring-slate-200/60", icon: "📋" },
  { key: "in-progress", label: "In Progress", color: "border-t-blue-500", dot: "bg-blue-500", bg: "bg-blue-50/30", dropBg: "bg-blue-100/60 ring-2 ring-blue-200/60", icon: "⚡" },
  { key: "completed", label: "Completed", color: "border-t-emerald-500", dot: "bg-emerald-500", bg: "bg-emerald-50/30", dropBg: "bg-emerald-100/60 ring-2 ring-emerald-200/60", icon: "✅" },
];

/* ══════════════════════════════════════════
   Main component
   ══════════════════════════════════════════ */

export default function KanbanBoard({ transactions, ordersWithoutTxn, rev, contacts, products, allContacts }: Props) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);

  /* ── Typeahead: Add Contact as Order ── */
  const [showTypeahead, setShowTypeahead] = useState(false);
  const [typeaheadQuery, setTypeaheadQuery] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const typeaheadRef = useRef<HTMLDivElement>(null);

  // Filter contacts by query
  const filteredContacts = typeaheadQuery.trim().length > 0
    ? allContacts.filter(
        (c) =>
          c.name.toLowerCase().includes(typeaheadQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(typeaheadQuery.toLowerCase())
      )
    : allContacts;

  const selectedContact = allContacts.find((c) => c.id === selectedContactId);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (typeaheadRef.current && !typeaheadRef.current.contains(e.target as Node)) {
        setShowTypeahead(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── Stage form state ── */
  const [stageForm, setStageForm] = useState<{
    open: boolean;
    txnId: string;
    stageCount: number;
    initial?: { id: string } & StageInput;
  }>({ open: false, txnId: "", stageCount: 0 });

  /* ── Selected transaction ── */
  const [expandedTxn, setExpandedTxn] = useState<string | null>(
    transactions[0]?.id ?? null
  );
  const activeTxn = transactions.find((t) => t.id === expandedTxn);

  /* ── DnD: local optimistic stage list ── */
  const [localStages, setLocalStages] = useState<Stage[]>(activeTxn?.stages ?? []);
  useEffect(() => {
    setLocalStages(activeTxn?.stages ?? []);
  }, [activeTxn]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const draggedStage = localStages.find((s) => s.id === activeId);

  /* Keep a ref so drag handlers always read the freshest stages */
  const stagesRef = useRef(localStages);
  useEffect(() => { stagesRef.current = localStages; }, [localStages]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  /* Custom collision: prefer pointer-within (intuitive for Kanban), fall back to closest-center */
  const collisionDetection: CollisionDetection = useCallback((args) => {
    const pw = pointerWithin(args);
    if (pw.length > 0) return pw;
    return closestCenter(args);
  }, []);

  /* ── Escape to exit expanded when pressing Escape ── */
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [expanded]);

  /* ── DnD handlers ── */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeStageId = active.id as string;

    // Use the `data` we attached to droppables / sortables
    const overData = over.data.current as
      | { type: "column"; status: string }
      | { type: "stage"; status: string }
      | undefined;

    const targetColumn = overData?.status ?? null;
    if (!targetColumn) return;

    setLocalStages((prev) => {
      const idx = prev.findIndex((s) => s.id === activeStageId);
      if (idx === -1) return prev;
      if (prev[idx].status === targetColumn) return prev; // same column, no update
      const updated = [...prev];
      updated[idx] = { ...updated[idx], status: targetColumn };
      return updated;
    });
  }, []); // no external deps — reads container from `data`, writes via functional setState

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const activeStageId = active.id as string;
      const overId = over.id as string;

      // Read the freshest stages from the ref
      const stages = stagesRef.current;
      const stage = stages.find((s) => s.id === activeStageId);
      if (!stage) return;

      // Reorder within same column if dropped on another stage in same col
      const overData = over.data.current as
        | { type: "column"; status: string }
        | { type: "stage"; status: string }
        | undefined;

      if (overData?.type === "stage" && overId !== activeStageId) {
        const overStage = stages.find((s) => s.id === overId);
        if (overStage && overStage.status === stage.status) {
          const colStages = stages.filter((s) => s.status === stage.status);
          const oldIdx = colStages.findIndex((s) => s.id === activeStageId);
          const newIdx = colStages.findIndex((s) => s.id === overId);
          if (oldIdx !== -1 && newIdx !== -1) {
            const reordered = arrayMove(colStages, oldIdx, newIdx);
            setLocalStages((prev) => {
              const others = prev.filter((s) => s.status !== stage.status);
              return [...others, ...reordered];
            });
          }
        }
      }

      // Find original stage from server data to compare status
      const originalStage = activeTxn?.stages.find((s) => s.id === activeStageId);
      if (originalStage && originalStage.status !== stage.status) {
        startTransition(() => updateStageStatus(activeStageId, stage.status));
      }
    },
    [activeTxn, startTransition]
  );

  /* ── Render ── */
  const boardContent = activeTxn ? (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-3 overflow-hidden flex-1">
        {/* Transaction header — customer card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-[#1a8d1a] flex items-center justify-center text-sm font-bold text-white shrink-0">
                {activeTxn.order.customerName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-gray-900 truncate">
                  {activeTxn.order.customerName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-gray-400 font-mono truncate max-w-[120px] sm:max-w-none">{activeTxn.id}</span>
                  <span className="text-gray-300 hidden sm:inline">·</span>
                  <span className="text-xs text-gray-500">{activeTxn.order.product.name}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs font-semibold text-gray-700">{fmtGBP(activeTxn.order.totalPrice)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_BADGE[activeTxn.order.status] ?? ""}`}>
                {activeTxn.order.status}
              </span>
              <span className="text-[10px] text-gray-400">Booked {fmtDate(activeTxn.bookedAt)}</span>
              <div className="hidden sm:block h-4 w-px bg-gray-200" />
              <button
                onClick={() =>
                  setStageForm({
                    open: true,
                    txnId: activeTxn.id,
                    stageCount: activeTxn.stages.length,
                  })
                }
                className="text-xs px-3 py-1.5 bg-[#1a8d1a] text-white font-medium rounded-lg hover:bg-[#157a15] transition-all hover:shadow-md active:scale-[0.97] flex items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Stage
              </button>
              <button
                onClick={() => setExpanded((p) => !p)}
                className="text-xs p-1.5 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
                title={expanded ? "Collapse board" : "Expand board"}
              >
                {expanded ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>
              <button
                disabled={isPending}
                onClick={() => {
                  if (!confirm("Delete this transaction and all its stages?")) return;
                  startTransition(() => deleteTransaction(activeTxn.id));
                }}
                className="text-xs p-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                title="Delete transaction"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Linked contacts — within the header card */}
          {(() => {
            const linked = contacts.filter(
              (c) => c.email === activeTxn.order.customerEmail
            );
            if (linked.length === 0) return null;
            return (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap">
                <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  </svg>
                  Linked:
                </span>
                {linked.map((c) => (
                  <Link
                    key={c.id}
                    href="/contacts"
                    className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 bg-blue-50/80 text-blue-700 border border-blue-100 rounded-full hover:bg-blue-100 transition-colors font-medium"
                    title={`${c.subject} · ${c.timeAgo}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-blue-200/80 flex items-center justify-center text-[8px] font-bold text-blue-800">
                      {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </span>
                    {c.name}
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Kanban columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 overflow-hidden sm:overflow-hidden overflow-y-auto">
          {COLUMNS.map((col) => {
            const colStages = localStages
              .filter((s) => s.status === col.key)
              .sort((a, b) => a.sortOrder - b.sortOrder);

            return (
              <DroppableColumn key={col.key} id={col.key} col={col} count={colStages.length}>
                <SortableContext
                  items={colStages.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
                    {colStages.map((stage) => (
                      <SortableStageCard
                        key={stage.id}
                        stage={stage}
                        columnKey={col.key}
                        onEdit={() =>
                          setStageForm({
                            open: true,
                            txnId: activeTxn.id,
                            stageCount: activeTxn.stages.length,
                            initial: {
                              id: stage.id,
                              stageKey: stage.stageKey,
                              title: stage.title,
                              description: stage.description,
                              status: stage.status,
                              estimatedDate: stage.estimatedDate ?? "",
                              details: stage.details,
                              deliverables: stage.deliverables,
                              assignedTo: stage.assignedTo ?? "",
                              sortOrder: stage.sortOrder,
                            },
                          })
                        }
                        onStatusChange={(newStatus) =>
                          startTransition(() => updateStageStatus(stage.id, newStatus))
                        }
                        onDelete={() =>
                          startTransition(() => deleteStage(stage.id))
                        }
                        isPending={isPending}
                      />
                    ))}
                    {colStages.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-6">
                        Drop stages here
                      </p>
                    )}
                  </div>
                </SortableContext>
              </DroppableColumn>
            );
          })}
        </div>
      </div>

      {/* Drag overlay — ghost that follows cursor */}
      <DragOverlay dropAnimation={null}>
        {draggedStage ? (
          <div className="w-[280px] opacity-90 rotate-2">
            <StageCardContent stage={draggedStage} columnKey={draggedStage.status} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  ) : (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center flex-1">
      <p className="text-sm text-gray-400">Select a transaction to view its stages</p>
    </div>
  );

  /* ── Expanded (fullscreen) mode ── */
  if (expanded && activeTxn) {
    return (
      <>
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
          {/* Top bar */}
          <div className="h-auto sm:h-14 bg-white border-b border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-2 sm:py-0 shrink-0 shadow-sm gap-1 sm:gap-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 bg-[#1a8d1a] rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <svg width="14" height="14" viewBox="0 0 40 44" fill="none">
                  <path d="M5 4 L33 2 L35 31 L7 33 Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
                  <line x1="19" y1="3" x2="21" y2="32" stroke="white" strokeWidth="2" />
                  <line x1="6" y1="18" x2="34" y2="16" stroke="white" strokeWidth="2" />
                </svg>
              </span>
              <div className="min-w-0">
                <h1 className="text-sm font-semibold text-gray-900 leading-tight truncate">
                  {activeTxn.order.customerName}
                </h1>
                <p className="text-[11px] text-gray-400 leading-tight truncate">
                  {activeTxn.order.product.name} · {fmtGBP(activeTxn.order.totalPrice)} · {activeTxn.stages.filter((s) => s.status === "completed").length}/{activeTxn.stages.length} stages
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                activeTxn.order.status === "paid" ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : activeTxn.order.status === "pending" ? "bg-amber-50 text-amber-600 border border-amber-100"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {activeTxn.order.status}
              </span>
              <button
                onClick={() => setExpanded(false)}
                className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 14 10 14 10 20" />
                  <polyline points="20 10 14 10 14 4" />
                  <line x1="14" y1="10" x2="21" y2="3" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                <span className="hidden sm:inline">Exit</span>
                <kbd className="ml-1 text-[10px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded hidden sm:inline">Esc</kbd>
              </button>
            </div>
          </div>
          {/* Board fills remaining space */}
          <div className="flex-1 p-3 sm:p-4 overflow-hidden flex">
            {boardContent}
          </div>
        </div>

        {/* Stage form needs to render outside the fullscreen overlay */}
        <StageForm
          open={stageForm.open}
          onClose={() => setStageForm({ open: false, txnId: "", stageCount: 0 })}
          transactionId={stageForm.txnId}
          stageCount={stageForm.stageCount}
          initial={stageForm.initial}
        />
      </>
    );
  }

  /* ── Normal mode ── */
  return (
    <div className="space-y-6">
      {/* ─── Revenue KPIs ─── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <Kpi
          label="Total Revenue"
          value={fmtGBP(rev.totalRevenue)}
          accent="text-emerald-600"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
          iconBg="bg-emerald-100 text-emerald-600"
          sub={`from ${rev.paidCount} paid order${rev.paidCount !== 1 ? "s" : ""}`}
        />
        <Kpi
          label="Paid Orders"
          value={String(rev.paidCount)}
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
          iconBg="bg-blue-100 text-blue-600"
        />
        <Kpi
          label="Pending Revenue"
          value={fmtGBP(rev.pendingRevenue)}
          accent="text-amber-600"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
          iconBg="bg-amber-100 text-amber-600"
          sub={`${rev.pendingCount} pending`}
        />
        <Kpi
          label="Cancelled"
          value={String(rev.cancelledCount)}
          accent="text-red-500"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
          iconBg="bg-red-100 text-red-500"
        />
      </div>

      {/* ─── Add Contact to Orders (Typeahead) ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-[#1a8d1a]/10 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a8d1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </span>
            Add Contact as Order
          </h2>
          {allContacts.length > 0 && (
            <span className="text-[10px] text-gray-400">
              {allContacts.length} contact{allContacts.length !== 1 ? "s" : ""} available
            </span>
          )}
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Contact typeahead */}
            <div className="flex-1 relative" ref={typeaheadRef}>
              <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Contact</label>
              {selectedContact ? (
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50">
                  <span className="w-7 h-7 rounded-lg bg-[#1a8d1a] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {selectedContact.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{selectedContact.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{selectedContact.email}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedContactId(null); setTypeaheadQuery(""); }}
                    className="w-6 h-6 rounded-md hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    <input
                      type="text"
                      value={typeaheadQuery}
                      onChange={(e) => { setTypeaheadQuery(e.target.value); setShowTypeahead(true); }}
                      onFocus={() => setShowTypeahead(true)}
                      placeholder="Search contacts by name or email…"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a] transition-all placeholder:text-gray-400"
                    />
                  </div>
                  {showTypeahead && (
                    <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                      {filteredContacts.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-400 text-center">No contacts found</div>
                      ) : (
                        filteredContacts.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setSelectedContactId(c.id);
                              setTypeaheadQuery("");
                              setShowTypeahead(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-2.5 border-b border-gray-50 last:border-b-0"
                          >
                            <span className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">
                              {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                              <p className="text-[11px] text-gray-400 truncate">{c.email}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Product dropdown */}
            <div className="sm:w-56">
              <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Product</label>
              <select
                value={selectedProductId ?? ""}
                onChange={(e) => setSelectedProductId(e.target.value || null)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a8d1a]/20 focus:border-[#1a8d1a] transition-all bg-white appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                <option value="">Select product…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Create button */}
            <div className="sm:self-end">
              <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1.5 block sm:invisible">Action</label>
              <button
                disabled={!selectedContact || !selectedProductId || isPending}
                onClick={() => {
                  if (!selectedContact || !selectedProductId) return;
                  startTransition(async () => {
                    await createOrderFromContact({
                      customerName: selectedContact.name,
                      customerEmail: selectedContact.email,
                      customerPhone: selectedContact.phone ?? undefined,
                      productId: selectedProductId,
                    });
                    setSelectedContactId(null);
                    setSelectedProductId(null);
                    setTypeaheadQuery("");
                  });
                }}
                className="w-full sm:w-auto px-5 py-2 bg-[#1a8d1a] text-white text-sm font-medium rounded-xl hover:bg-[#157a15] transition-all hover:shadow-md active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                {isPending ? "Creating…" : "Create Order"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Orders without Transaction ─── */}
      {ordersWithoutTxn.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </span>
              Awaiting Transaction
            </h2>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              {ordersWithoutTxn.length} order{ordersWithoutTxn.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {ordersWithoutTxn.map((o) => (
              <div
                key={o.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                    {o.customerName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{o.customerName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{o.product.name}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs font-semibold text-gray-700">{fmtGBP(o.totalPrice)}</span>
                      <span
                        className={`font-medium px-1.5 py-0.5 rounded-full border text-[10px] ${STATUS_BADGE[o.status] ?? ""}`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  disabled={isPending}
                  onClick={() => startTransition(async () => { await createTransaction(o.id); })}
                  className="text-xs px-4 py-2 bg-[#1a8d1a] text-white font-medium rounded-lg hover:bg-[#157a15] transition-all hover:shadow-md active:scale-[0.97] disabled:opacity-50 flex items-center gap-1.5 self-start sm:self-center"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {isPending ? "Creating…" : "Start Transaction"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Empty state ─── */}
      {transactions.length === 0 && ordersWithoutTxn.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1.5">No orders or transactions</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">Orders from the website will appear here. Start by creating a product and sharing the checkout link.</p>
        </div>
      )}

      {/* ─── Transactions sidebar + Kanban ─── */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4 xl:h-[calc(100vh-340px)] xl:min-h-[500px]">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col max-h-[300px] xl:max-h-none">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Transactions
              </p>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {transactions.length}
              </span>
            </div>
            <div className="overflow-y-auto flex-1">
              {transactions.map((txn) => {
                const stages = txn.stages;
                const doneCount = stages.filter((s) => s.status === "completed").length;
                const inProgressCount = stages.filter((s) => s.status === "in-progress").length;
                const progress = stages.length > 0 ? Math.round((doneCount / stages.length) * 100) : 0;
                const isActive = expandedTxn === txn.id;
                const hasLinked = contacts.some((c) => c.email === txn.order.customerEmail);

                return (
                  <button
                    key={txn.id}
                    onClick={() => setExpandedTxn(txn.id)}
                    className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-all ${
                      isActive
                        ? "bg-[#1a8d1a]/[0.04] border-l-[3px] border-l-[#1a8d1a]"
                        : "hover:bg-gray-50/80 border-l-[3px] border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <span className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-[11px] font-bold text-white ${
                        isActive ? "bg-[#1a8d1a]" : "bg-gray-300"
                      } transition-colors`}>
                        {txn.order.customerName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {txn.order.customerName}
                          </span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${STATUS_BADGE[txn.order.status] ?? ""}`}>
                            {txn.order.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {txn.order.product.name} · <span className="font-medium text-gray-600">{fmtGBP(txn.order.totalPrice)}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? "bg-emerald-500" : "bg-[#1a8d1a]"}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-gray-400 shrink-0 tabular-nums">
                            {doneCount}/{stages.length}
                          </span>
                        </div>
                        {/* Micro-metadata row */}
                        <div className="flex items-center gap-2 mt-1.5">
                          {inProgressCount > 0 && (
                            <span className="text-[10px] text-blue-600 font-medium flex items-center gap-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                              {inProgressCount} active
                            </span>
                          )}
                          {hasLinked && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                              linked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kanban */}
          {boardContent}
        </div>
      )}

      {/* Stage form */}
      <StageForm
        open={stageForm.open}
        onClose={() => setStageForm({ open: false, txnId: "", stageCount: 0 })}
        transactionId={stageForm.txnId}
        stageCount={stageForm.stageCount}
        initial={stageForm.initial}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Droppable Column wrapper
   ═══════════════════════════════════════════════ */

function DroppableColumn({
  id,
  col,
  children,
  count,
}: {
  id: string;
  col: { key: string; label: string; color: string; dot: string; bg: string; dropBg: string; icon: string };
  children: React.ReactNode;
  count: number;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "column" as const, status: id },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-t-[3px] ${col.color} flex flex-col overflow-hidden transition-all duration-200 ${
        isOver ? col.dropBg : col.bg
      }`}
    >
      <div className="px-3 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{col.icon}</span>
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {col.label}
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          count > 0
            ? col.key === "completed" ? "bg-emerald-100 text-emerald-700"
              : col.key === "in-progress" ? "bg-blue-100 text-blue-700"
              : "bg-gray-200 text-gray-600"
            : "bg-gray-100 text-gray-400"
        }`}>
          {count}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Sortable Stage Card (draggable wrapper)
   ═══════════════════════════════════════════════ */

function SortableStageCard({
  stage,
  columnKey,
  onEdit,
  onStatusChange,
  onDelete,
  isPending,
}: {
  stage: Stage;
  columnKey: string;
  onEdit: () => void;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: stage.id,
    data: { type: "stage" as const, status: stage.status },
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <StageCardContent
        stage={stage}
        columnKey={columnKey}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        isPending={isPending}
        dragListeners={listeners}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Stage Card visual content (shared by card + overlay)
   ═══════════════════════════════════════════════ */

function StageCardContent({
  stage,
  columnKey,
  onEdit,
  onStatusChange,
  onDelete,
  isPending,
  dragListeners,
}: {
  stage: Stage;
  columnKey: string;
  onEdit?: () => void;
  onStatusChange?: (status: string) => void;
  onDelete?: () => void;
  isPending?: boolean;
  dragListeners?: Record<string, unknown>;
}) {
  const STAGE_ICON: Record<string, string> = {
    booking: "📅",
    discovery: "🔍",
    strategy: "🎯",
    design: "🎨",
    development: "💻",
    review: "📝",
    delivery: "🚀",
    "follow-up": "🤝",
  };

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-3.5 group transition-all hover:shadow-md ${
      columnKey === "completed" ? "border-emerald-100" : columnKey === "in-progress" ? "border-blue-100" : "border-gray-100"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <button
            {...dragListeners}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0 -ml-0.5"
            title="Drag to move"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8" cy="4" r="2" />
              <circle cx="16" cy="4" r="2" />
              <circle cx="8" cy="12" r="2" />
              <circle cx="16" cy="12" r="2" />
              <circle cx="8" cy="20" r="2" />
              <circle cx="16" cy="20" r="2" />
            </svg>
          </button>
          <span className="text-sm">{STAGE_ICON[stage.stageKey] ?? "📋"}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
            columnKey === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : columnKey === "in-progress" ? "bg-blue-50 text-blue-700 border border-blue-100"
              : "bg-gray-100 text-gray-500"
          }`}>
            {stage.stageKey}
          </span>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={onEdit}
                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                title="Edit"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm(`Delete stage "${stage.title}"?`)) onDelete();
                }}
                disabled={isPending}
                className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Delete"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Title & description */}
      <h3 className="text-[13px] font-semibold text-gray-900 mb-1 leading-snug">{stage.title}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-2.5 leading-relaxed">{stage.description}</p>

      {/* Assigned to */}
      {stage.assignedTo && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">
            {stage.assignedTo.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </span>
          <span className="text-[11px] text-gray-500">{stage.assignedTo}</span>
        </div>
      )}

      {/* Deliverables */}
      {stage.deliverables.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {stage.deliverables.slice(0, 2).map((d, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-medium"
            >
              {d}
            </span>
          ))}
          {stage.deliverables.length > 2 && (
            <span className="text-[10px] text-gray-400 self-center">+{stage.deliverables.length - 2}</span>
          )}
        </div>
      )}

      {/* Footer: Date + move buttons */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
        {stage.estimatedDate ? (
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {fmtDate(stage.estimatedDate)}
          </span>
        ) : (
          <span />
        )}
        {onStatusChange && (
          <div className="flex gap-1">
            {columnKey !== "upcoming" && (
              <button
                disabled={isPending}
                onClick={() =>
                  onStatusChange(columnKey === "completed" ? "in-progress" : "upcoming")
                }
                className="text-[10px] w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 font-medium transition-colors disabled:opacity-50"
                title="Move left"
              >
                ←
              </button>
            )}
            {columnKey !== "completed" && (
              <button
                disabled={isPending}
                onClick={() =>
                  onStatusChange(columnKey === "upcoming" ? "in-progress" : "completed")
                }
                className="text-[10px] w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 font-medium transition-colors disabled:opacity-50"
                title="Move right"
              >
                →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   KPI card
   ═══════════════════════════════════════════════ */

function Kpi({
  label,
  value,
  accent = "text-gray-900",
  icon,
  iconBg = "bg-gray-100",
  sub,
}: {
  label: string;
  value: string;
  accent?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow group/kpi">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs sm:text-sm font-medium text-gray-500">{label}</p>
        {icon && (
          <span className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center text-white shrink-0 group-hover/kpi:scale-110 transition-transform`}>
            {icon}
          </span>
        )}
      </div>
      <p className={`text-xl sm:text-2xl font-bold tracking-tight ${accent}`}>{value}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
