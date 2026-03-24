"use client";

import { useState, useTransition, useCallback, useEffect, useRef } from "react";
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
import {
  updateCharityStatus,
  updateCharityTaskStatus,
  deleteCharityTask,
  deleteCharityProject,
  createCharityTask,
  type CharityTaskInput,
} from "@/lib/actions";

/* ══════════════════════════════════════════
   Types
   ══════════════════════════════════════════ */

type Task = {
  id: string;
  taskKey: string;
  title: string;
  description: string;
  status: string;
  completedAt: string | null;
  estimatedDate: string | null;
  deliverables: string[];
  assignedTo: string | null;
  sortOrder: number;
};

type Project = {
  id: string;
  charityName: string;
  charityNumber: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  website: string | null;
  description: string;
  status: string;
  needsLogo: boolean;
  needsColours: boolean;
  needsWebsite: boolean;
  needsDonations: boolean;
  needsPayments: boolean;
  notes: string | null;
  createdAt: string;
  tasks: Task[];
};

type Stats = {
  applied: number;
  accepted: number;
  inProgress: number;
  completed: number;
  rejected: number;
  activeCount: number;
  limit: number;
};

type Props = {
  projects: Project[];
  stats: Stats;
};

/* ══════════════════════════════════════════
   Constants
   ══════════════════════════════════════════ */

const STATUS_BADGE: Record<string, string> = {
  applied: "bg-purple-50 text-purple-700 border-purple-200",
  accepted: "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_OPTIONS = ["applied", "accepted", "in-progress", "completed", "rejected"] as const;

const TASK_COLUMNS: { key: string; label: string; color: string; dot: string; bg: string; dropBg: string; icon: string }[] = [
  { key: "upcoming", label: "Upcoming", color: "border-t-slate-400", dot: "bg-slate-400", bg: "bg-slate-50/60", dropBg: "bg-slate-100/80 ring-2 ring-slate-200/60", icon: "📋" },
  { key: "in-progress", label: "In Progress", color: "border-t-blue-400", dot: "bg-blue-400", bg: "bg-blue-50/40", dropBg: "bg-blue-100/60 ring-2 ring-blue-200/60", icon: "⚡" },
  { key: "completed", label: "Completed", color: "border-t-emerald-400", dot: "bg-emerald-400", bg: "bg-emerald-50/40", dropBg: "bg-emerald-100/60 ring-2 ring-emerald-200/60", icon: "✅" },
];

const TASK_KEY_OPTIONS = [
  { value: "logo", label: "Logo Design", icon: "🎨" },
  { value: "colours", label: "Colour Scheme", icon: "🌈" },
  { value: "website", label: "Website", icon: "🌐" },
  { value: "donations", label: "Donations Portal", icon: "💝" },
  { value: "payments", label: "Payment Portal", icon: "💳" },
  { value: "review", label: "Review", icon: "📝" },
  { value: "handover", label: "Handover", icon: "🤝" },
];

const TASK_ICON: Record<string, string> = Object.fromEntries(TASK_KEY_OPTIONS.map((o) => [o.value, o.icon]));

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/* ══════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════ */

export default function CharityBoard({ projects, stats }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(projects.find((p) => p.status === "in-progress" || p.status === "accepted")?.id ?? projects[0]?.id ?? null);
  const activeProject = projects.find((p) => p.id === selectedId);
  const [expanded, setExpanded] = useState(false);

  /* ── Task form state ── */
  const [taskForm, setTaskForm] = useState(false);
  const [taskKey, setTaskKey] = useState("logo");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

  /* ── DnD: local optimistic task list ── */
  const [localTasks, setLocalTasks] = useState<Task[]>(activeProject?.tasks ?? []);
  useEffect(() => { setLocalTasks(activeProject?.tasks ?? []); }, [activeProject]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const draggedTask = localTasks.find((t) => t.id === activeId);

  const tasksRef = useRef(localTasks);
  useEffect(() => { tasksRef.current = localTasks; }, [localTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const collisionDetection: CollisionDetection = useCallback((args) => {
    const pw = pointerWithin(args);
    return pw.length > 0 ? pw : closestCenter(args);
  }, []);

  function handleDragStart(e: DragStartEvent) { setActiveId(e.active.id as string); }

  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const current = tasksRef.current;
    const activeTask = current.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overCol = TASK_COLUMNS.find((c) => c.key === over.id);
    if (overCol && activeTask.status !== overCol.key) {
      setLocalTasks((prev) => prev.map((t) => t.id === active.id ? { ...t, status: overCol.key } : t));
      return;
    }

    const overTask = current.find((t) => t.id === over.id);
    if (overTask && overTask.id !== activeTask.id) {
      if (activeTask.status !== overTask.status) {
        setLocalTasks((prev) => prev.map((t) => t.id === active.id ? { ...t, status: overTask.status } : t));
      }
      setLocalTasks((prev) => {
        const oldIdx = prev.findIndex((t) => t.id === active.id);
        const newIdx = prev.findIndex((t) => t.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active } = e;
    const task = tasksRef.current.find((t) => t.id === active.id);
    if (!task) { setActiveId(null); return; }
    const original = activeProject?.tasks.find((t) => t.id === active.id);
    if (original && original.status !== task.status) {
      startTransition(() => updateCharityTaskStatus(task.id, task.status));
    }
    setActiveId(null);
  }

  /* ── Kanban board content ── */
  const boardContent = activeProject && (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 min-h-0 overflow-hidden">
        {TASK_COLUMNS.map((col) => {
          const colTasks = localTasks.filter((t) => t.status === col.key);
          return (
            <DroppableColumn key={col.key} id={col.key} col={col} count={colTasks.length}>
              <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 p-2 overflow-y-auto flex-1">
                  {colTasks.map((task) => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      columnKey={col.key}
                      onStatusChange={(status) => startTransition(() => updateCharityTaskStatus(task.id, status))}
                      onDelete={() => startTransition(() => deleteCharityTask(task.id))}
                      isPending={isPending}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="py-8 text-center text-xs text-gray-400">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </SortableContext>
            </DroppableColumn>
          );
        })}
      </div>
      <DragOverlay>
        {draggedTask ? (
          <div className="bg-white rounded-xl border shadow-lg p-3 opacity-90 max-w-[280px]">
            <span className="text-sm font-semibold text-gray-900">{draggedTask.title}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  /* ── Expanded (fullscreen) mode ── */
  if (expanded && activeProject) {
    return (
      <>
        <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col">
          <div className="h-auto sm:h-14 bg-white border-b border-gray-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-2 sm:py-0 shrink-0 shadow-sm gap-1 sm:gap-0">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
                {activeProject.charityName.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h1 className="text-sm font-semibold text-gray-900 leading-tight truncate">{activeProject.charityName}</h1>
                <p className="text-[11px] text-gray-400 leading-tight truncate">
                  {activeProject.contactName} · {localTasks.filter((t) => t.status === "completed").length}/{localTasks.length} tasks
                </p>
              </div>
            </div>
            <button onClick={() => setExpanded(false)} className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 self-end sm:self-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
              <span className="hidden sm:inline">Exit</span> <kbd className="ml-1 text-[10px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded hidden sm:inline">Esc</kbd>
            </button>
          </div>
          <div className="flex-1 p-3 sm:p-4 overflow-hidden flex">{boardContent}</div>
        </div>
      </>
    );
  }

  /* ── Normal mode ── */
  return (
    <div className="space-y-6">
      {/* ─── Stats KPIs ─── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
        <Kpi label="Applied" value={String(stats.applied)} accent="text-purple-600" icon="📥" iconBg="bg-purple-100" />
        <Kpi label="Accepted" value={String(stats.accepted)} accent="text-blue-600" icon="✅" iconBg="bg-blue-100" />
        <Kpi label="In Progress" value={String(stats.inProgress)} accent="text-amber-600" icon="⚡" iconBg="bg-amber-100" />
        <Kpi label="Completed" value={String(stats.completed)} accent="text-emerald-600" icon="🎉" iconBg="bg-emerald-100" />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow col-span-2 xl:col-span-1">
          <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Capacity</p>
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              {stats.activeCount}<span className="text-gray-300 text-lg">/{stats.limit}</span>
            </p>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${stats.activeCount >= stats.limit ? "bg-red-500" : "bg-[#1a8d1a]"}`}
              style={{ width: `${Math.min(100, (stats.activeCount / stats.limit) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {stats.activeCount >= stats.limit ? "At capacity — new projects queued" : `${stats.limit - stats.activeCount} slot${stats.limit - stats.activeCount !== 1 ? "s" : ""} available`}
          </p>
        </div>
      </div>

      {/* ─── Applications Awaiting Review ─── */}
      {projects.filter((p) => p.status === "applied").length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-sm">📥</span>
              New Applications
            </h2>
            <span className="text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
              {projects.filter((p) => p.status === "applied").length} pending
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {projects.filter((p) => p.status === "applied").map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xs font-bold text-purple-600 shrink-0">
                    {p.charityName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.charityName}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {p.contactName} · {p.contactEmail}
                      {p.charityNumber && <> · Reg #{p.charityNumber}</>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    disabled={isPending || stats.activeCount >= stats.limit}
                    onClick={() => startTransition(() => updateCharityStatus(p.id, "accepted"))}
                    className="text-xs px-4 py-2 bg-[#1a8d1a] text-white font-medium rounded-lg hover:bg-[#157a15] transition-all hover:shadow-md active:scale-[0.97] disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    Accept
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => { if (confirm(`Reject "${p.charityName}"?`)) startTransition(() => updateCharityStatus(p.id, "rejected")); }}
                    className="text-xs px-3 py-2 border border-gray-200 text-gray-500 font-medium rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Empty state ─── */}
      {projects.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">💜</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1.5">No charity projects yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">Charity applications from the website will appear here. Share the application page to get started.</p>
        </div>
      )}

      {/* ─── Projects sidebar + Kanban ─── */}
      {projects.filter((p) => p.status !== "applied" && p.status !== "rejected").length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-4 xl:h-[calc(100vh-380px)] xl:min-h-[500px]">
          {/* Sidebar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col max-h-[300px] xl:max-h-none">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</p>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {projects.filter((p) => p.status !== "applied" && p.status !== "rejected").length}
              </span>
            </div>
            <div className="overflow-y-auto flex-1">
              {projects.filter((p) => p.status !== "applied" && p.status !== "rejected").map((proj) => {
                const isActive = selectedId === proj.id;
                const doneCount = proj.tasks.filter((t) => t.status === "completed").length;
                const progress = proj.tasks.length > 0 ? Math.round((doneCount / proj.tasks.length) * 100) : 0;
                return (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedId(proj.id)}
                    className={`w-full text-left px-4 py-3.5 border-b border-gray-50 transition-all ${
                      isActive ? "bg-purple-50/50 border-l-[3px] border-l-purple-500" : "hover:bg-gray-50/80 border-l-[3px] border-l-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-[11px] font-bold text-white ${
                        isActive ? "bg-purple-600" : "bg-gray-300"
                      } transition-colors`}>
                        {proj.charityName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-gray-900 truncate">{proj.charityName}</span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${STATUS_BADGE[proj.status] ?? ""}`}>
                            {proj.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{proj.contactName} · {proj.contactEmail}</p>
                        {proj.tasks.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? "bg-emerald-500" : "bg-purple-500"}`} style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 shrink-0 tabular-nums">{doneCount}/{proj.tasks.length}</span>
                          </div>
                        )}
                        {/* Deliverable pills */}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {proj.needsLogo && <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full">🎨 Logo</span>}
                          {proj.needsWebsite && <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full">🌐 Web</span>}
                          {proj.needsDonations && <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full">💝 Donate</span>}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Board panel */}
          <div className="flex flex-col min-h-0 gap-4">
            {/* Project header */}
            {activeProject && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                      {activeProject.charityName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-gray-900 truncate">{activeProject.charityName}</h2>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500">{activeProject.contactName}</span>
                        <span className="text-gray-300 hidden sm:inline">·</span>
                        <span className="text-xs text-gray-400 truncate">{activeProject.contactEmail}</span>
                        {activeProject.charityNumber && (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-[11px] text-gray-400">Reg #{activeProject.charityNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status dropdown */}
                    <select
                      value={activeProject.status}
                      disabled={isPending}
                      onChange={(e) => startTransition(() => updateCharityStatus(activeProject.id, e.target.value))}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full border appearance-none cursor-pointer ${STATUS_BADGE[activeProject.status] ?? ""}`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {/* Add task */}
                    <button
                      onClick={() => setTaskForm(true)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                      title="Add task"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    {/* Expand */}
                    <button
                      onClick={() => setExpanded(true)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                      title="Fullscreen"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => { if (confirm(`Delete "${activeProject.charityName}" and all tasks?`)) startTransition(() => deleteCharityProject(activeProject.id)); }}
                      disabled={isPending}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete project"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-3 leading-relaxed line-clamp-2">{activeProject.description}</p>

                {/* Deliverables needed */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeProject.needsLogo && <span className="text-[10px] px-2 py-0.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-full font-medium">🎨 Logo</span>}
                  {activeProject.needsColours && <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full font-medium">🌈 Colours</span>}
                  {activeProject.needsWebsite && <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full font-medium">🌐 Website</span>}
                  {activeProject.needsDonations && <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-medium">💝 Donations</span>}
                  {activeProject.needsPayments && <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full font-medium">💳 Payments</span>}
                </div>
              </div>
            )}

            {/* Kanban */}
            {activeProject ? (
              activeProject.tasks.length > 0 || taskForm ? (
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-3">
                  {boardContent}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-center p-8">
                    <span className="text-4xl mb-4 block">📋</span>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">No tasks yet</h3>
                    <p className="text-sm text-gray-400 mb-4">Add tasks to start tracking deliverables for this charity.</p>
                    <button
                      onClick={() => setTaskForm(true)}
                      className="text-xs px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      + Add First Task
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-400">Select a project to view tasks</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Add Task Modal ─── */}
      {taskForm && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setTaskForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-sm">📋</span>
              Add Task
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Task Type</label>
                <select
                  value={taskKey}
                  onChange={(e) => setTaskKey(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                >
                  {TASK_KEY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.icon} {o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Title</label>
                <input
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Design charity logo"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Description</label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  rows={3}
                  placeholder="What does this task involve?"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all resize-none"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  disabled={!taskTitle.trim() || isPending}
                  onClick={() => {
                    startTransition(async () => {
                      await createCharityTask(activeProject.id, {
                        taskKey,
                        title: taskTitle.trim(),
                        description: taskDesc.trim(),
                        status: "upcoming",
                        deliverables: [],
                        sortOrder: localTasks.length,
                      });
                      setTaskForm(false);
                      setTaskTitle("");
                      setTaskDesc("");
                      setTaskKey("logo");
                    });
                  }}
                  className="text-xs px-4 py-2 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-all disabled:opacity-40 flex items-center gap-1.5"
                >
                  {isPending ? "Creating…" : "Create Task"}
                </button>
                <button
                  onClick={() => { setTaskForm(false); setTaskTitle(""); setTaskDesc(""); }}
                  className="text-xs px-3 py-2 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Droppable Column
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
  const { setNodeRef, isOver } = useDroppable({ id, data: { type: "column", status: id } });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-t-[3px] ${col.color} flex flex-col overflow-hidden transition-all duration-200 ${isOver ? col.dropBg : col.bg}`}
    >
      <div className="px-3 py-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{col.icon}</span>
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{col.label}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          count > 0
            ? col.key === "completed" ? "bg-emerald-100 text-emerald-700" : col.key === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"
            : "bg-gray-100 text-gray-400"
        }`}>{count}</span>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Sortable Task Card
   ═══════════════════════════════════════════════ */

function SortableTaskCard({
  task,
  columnKey,
  onStatusChange,
  onDelete,
  isPending,
}: {
  task: Task;
  columnKey: string;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task, status: columnKey },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCardContent task={task} columnKey={columnKey} dragListeners={listeners} onStatusChange={onStatusChange} onDelete={onDelete} isPending={isPending} />
    </div>
  );
}

function TaskCardContent({
  task,
  columnKey,
  dragListeners,
  onStatusChange,
  onDelete,
  isPending,
}: {
  task: Task;
  columnKey: string;
  dragListeners: Record<string, unknown> | undefined;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm p-3.5 group transition-all hover:shadow-md ${
      columnKey === "completed" ? "border-emerald-100" : columnKey === "in-progress" ? "border-blue-100" : "border-gray-100"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            {...dragListeners}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing shrink-0 -ml-0.5"
            title="Drag to move"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="4" r="2" /><circle cx="16" cy="4" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="8" cy="20" r="2" /><circle cx="16" cy="20" r="2" /></svg>
          </button>
          <span className="text-sm">{TASK_ICON[task.taskKey] ?? "📋"}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
            columnKey === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : columnKey === "in-progress" ? "bg-blue-50 text-blue-700 border border-blue-100"
              : "bg-gray-100 text-gray-500"
          }`}>{task.taskKey}</span>
        </div>
        <button
          onClick={() => { if (confirm(`Delete "${task.title}"?`)) onDelete(); }}
          disabled={isPending}
          className="w-6 h-6 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
          title="Delete"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
        </button>
      </div>

      <h3 className="text-[13px] font-semibold text-gray-900 mb-1 leading-snug">{task.title}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-2.5 leading-relaxed">{task.description}</p>

      {task.assignedTo && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center text-[8px] font-bold text-purple-700">
            {task.assignedTo.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </span>
          <span className="text-[11px] text-gray-500">{task.assignedTo}</span>
        </div>
      )}

      {task.deliverables.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.deliverables.slice(0, 2).map((d, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full font-medium">{d}</span>
          ))}
          {task.deliverables.length > 2 && <span className="text-[10px] text-gray-400 self-center">+{task.deliverables.length - 2}</span>}
        </div>
      )}

      <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
        {task.estimatedDate ? (
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            {fmtDate(task.estimatedDate)}
          </span>
        ) : <span />}
        <div className="flex gap-1">
          {columnKey !== "upcoming" && (
            <button disabled={isPending} onClick={() => onStatusChange(columnKey === "completed" ? "in-progress" : "upcoming")} className="text-[10px] w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50" title="Move left">←</button>
          )}
          {columnKey !== "completed" && (
            <button disabled={isPending} onClick={() => onStatusChange(columnKey === "upcoming" ? "in-progress" : "completed")} className="text-[10px] w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50" title="Move right">→</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   KPI card
   ═══════════════════════════════════════════════ */

function Kpi({ label, value, accent = "text-gray-900", icon, iconBg = "bg-gray-100" }: {
  label: string; value: string; accent?: string; icon?: string; iconBg?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs sm:text-sm font-medium text-gray-500">{label}</p>
        {icon && <span className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center text-base`}>{icon}</span>}
      </div>
      <p className={`text-xl sm:text-2xl font-bold tracking-tight ${accent}`}>{value}</p>
    </div>
  );
}
