import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Edit3,
  Eye,
  Flag,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { ActionMenu } from "@/components/core/action-menu";

type OutcomeStatus = "Active" | "Completed" | "Pending" | "On Hold";
type OutcomePriority = "High" | "Medium" | "Low";

type Outcome = {
  id: number;
  name: string;
  description: string;
  indicators: number;
  status: OutcomeStatus;
  priority: OutcomePriority;
  owner: string;
  dueDate: string;
  progress: number;
  department: string;
};

type OutcomeForm = Omit<Outcome, "id" | "progress">;

const initialOutcomes: Outcome[] = [
  {
    id: 1,
    name: "An industrialised and diversified economy",
    description: "Increase industrial productivity, export competitiveness, and domestic value addition.",
    indicators: 5,
    status: "Active",
    priority: "High",
    owner: "Policy and Planning",
    dueDate: "2026-06-30",
    progress: 75,
    department: "Economic Transformation",
  },
  {
    id: 2,
    name: "Enhanced citizenry participation in the economy",
    description: "Improve access to productive employment, enterprise support, and inclusive economic services.",
    indicators: 3,
    status: "Active",
    priority: "High",
    owner: "Monitoring and Evaluation",
    dueDate: "2026-09-15",
    progress: 48,
    department: "Inclusive Growth",
  },
  {
    id: 3,
    name: "Competitive private sector",
    description: "Strengthen market access, productivity, and enabling conditions for private sector growth.",
    indicators: 8,
    status: "Completed",
    priority: "Medium",
    owner: "Research",
    dueDate: "2026-03-01",
    progress: 100,
    department: "Private Sector Development",
  },
  {
    id: 4,
    name: "Improved district service delivery",
    description: "Track local service access, timeliness, and satisfaction across priority districts.",
    indicators: 6,
    status: "Pending",
    priority: "Medium",
    owner: "District Coordination",
    dueDate: "2026-11-20",
    progress: 18,
    department: "Local Governance",
  },
];

const emptyForm: OutcomeForm = {
  name: "",
  description: "",
  indicators: 1,
  status: "Pending",
  priority: "Medium",
  owner: "",
  dueDate: "",
  department: "",
};

const statuses: Array<OutcomeStatus | "All"> = ["All", "Active", "Completed", "Pending", "On Hold"];
const priorities: Array<OutcomePriority | "All"> = ["All", "High", "Medium", "Low"];

export default function OutcomesPage() {
  const [outcomes, setOutcomes] = useState<Outcome[]>(initialOutcomes);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OutcomeStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<OutcomePriority | "All">("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<Outcome | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
  const [form, setForm] = useState<OutcomeForm>(emptyForm);

  const filteredOutcomes = useMemo(() => {
    const needle = searchTerm.toLowerCase().trim();
    return outcomes.filter((outcome) => {
      const matchesSearch =
        !needle ||
        outcome.name.toLowerCase().includes(needle) ||
        outcome.description.toLowerCase().includes(needle) ||
        outcome.department.toLowerCase().includes(needle) ||
        outcome.owner.toLowerCase().includes(needle);
      const matchesStatus = statusFilter === "All" || outcome.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || outcome.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [outcomes, priorityFilter, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = outcomes.length;
    const active = outcomes.filter((outcome) => outcome.status === "Active").length;
    const completed = outcomes.filter((outcome) => outcome.status === "Completed").length;
    const avgProgress = Math.round(outcomes.reduce((sum, outcome) => sum + outcome.progress, 0) / Math.max(total, 1));
    return { total, active, completed, avgProgress };
  }, [outcomes]);

  const openCreate = () => {
    setEditingOutcome(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (outcome: Outcome) => {
    setEditingOutcome(outcome);
    setForm({
      name: outcome.name,
      description: outcome.description,
      indicators: outcome.indicators,
      status: outcome.status,
      priority: outcome.priority,
      owner: outcome.owner,
      dueDate: outcome.dueDate,
      department: outcome.department,
    });
    setModalOpen(true);
  };

  const saveOutcome = () => {
    if (!form.name.trim() || !form.description.trim() || !form.department.trim()) return;

    if (editingOutcome) {
      setOutcomes((items) => items.map((item) => (item.id === editingOutcome.id ? { ...item, ...form } : item)));
    } else {
      const nextId = Math.max(0, ...outcomes.map((outcome) => outcome.id)) + 1;
      setOutcomes((items) => [...items, { id: nextId, progress: 0, ...form }]);
    }
    setModalOpen(false);
  };

  const deleteOutcome = (id: number) => {
    setOutcomes((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Outcomes</h1>
            <p className="mt-2 text-gray-400">Define project results, monitor progress, and connect each outcome to measurable indicators.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            Add Outcome
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label="Total Outcomes" value={stats.total} icon={<Target className="h-5 w-5 text-blue-300" />} />
          <StatCard label="Active" value={stats.active} icon={<TrendingUp className="h-5 w-5 text-emerald-300" />} />
          <StatCard label="Completed" value={stats.completed} icon={<CheckCircle2 className="h-5 w-5 text-violet-300" />} />
          <StatCard label="Average Progress" value={`${stats.avgProgress}%`} icon={<BarChart3 className="h-5 w-5 text-amber-300" />} />
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800">
          <div className="grid gap-3 border-b border-gray-700 p-5 lg:grid-cols-[1fr_180px_180px] lg:items-center">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-blue-500"
                placeholder="Search outcomes, departments, owners"
              />
            </label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OutcomeStatus | "All")} className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500">
              {statuses.map((status) => (
                <option key={status} value={status}>{status === "All" ? "All statuses" : status}</option>
              ))}
            </select>
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as OutcomePriority | "All")} className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500">
              {priorities.map((priority) => (
                <option key={priority} value={priority}>{priority === "All" ? "All priorities" : priority}</option>
              ))}
            </select>
          </div>

          <div className="p-3">
            <table className="w-full table-fixed">
              <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="w-[34%] px-3 py-3 font-semibold">Outcome</th>
                  <th className="w-[11%] px-3 py-3 font-semibold">Indicators</th>
                  <th className="w-[13%] px-3 py-3 font-semibold">Status</th>
                  <th className="w-[12%] px-3 py-3 font-semibold">Priority</th>
                  <th className="w-[17%] px-3 py-3 font-semibold">Progress</th>
                  <th className="w-[13%] px-3 py-3 font-semibold">Due</th>
                  <th className="w-[96px] px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOutcomes.map((outcome) => (
                  <tr key={outcome.id} className="align-top text-sm transition hover:bg-gray-700/35">
                    <td className="px-3 py-4">
                      <p className="font-semibold leading-5 text-white">{outcome.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">{outcome.description}</p>
                      <p className="mt-2 text-xs text-gray-500">{outcome.department}</p>
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 px-2 py-1 text-sm font-semibold text-blue-200">
                        <BarChart3 className="h-4 w-4" />
                        {outcome.indicators}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(outcome.status)}`}>{outcome.status}</span>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${priorityClass(outcome.priority)}`}>
                        <AlertCircle className="h-4 w-4" />
                        {outcome.priority}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Completion</span>
                          <span className="font-semibold text-white">{outcome.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-700">
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: `${outcome.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-gray-300">{formatDate(outcome.dueDate)}</td>
                    <td className="px-3 py-4">
                      <ActionMenu
                        label={`Actions for ${outcome.name}`}
                        items={[
                          { label: "View details", icon: <Eye />, onClick: () => setSelectedOutcome(outcome) },
                          { label: "Edit outcome", icon: <Edit3 />, onClick: () => openEdit(outcome) },
                          { label: "Delete outcome", icon: <Trash2 />, tone: "danger", onClick: () => deleteOutcome(outcome.id) },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOutcomes.length === 0 && <div className="p-10 text-center text-gray-400">No outcomes match your search or filters.</div>}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div onClick={() => setModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between border-b border-slate-700 px-6 py-5">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300">
                  <Flag className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{editingOutcome ? "Update outcome" : "Create outcome"}</h2>
                  <p className="mt-1 text-sm text-slate-400">Capture the result area, accountable department, due date, and tracking priority.</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Close outcome form">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
              <Field label="Outcome name" className="sm:col-span-2">
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input-dark h-11" placeholder="Competitive private sector" />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="input-dark min-h-24 resize-none" placeholder="Describe what success looks like for this outcome." />
              </Field>
              <Field label="Department">
                <input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="input-dark h-11" placeholder="Economic Transformation" />
              </Field>
              <Field label="Owner">
                <input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} className="input-dark h-11" placeholder="Monitoring and Evaluation" />
              </Field>
              <Field label="Indicators">
                <input type="number" min={1} value={form.indicators} onChange={(event) => setForm({ ...form, indicators: Number(event.target.value) || 1 })} className="input-dark h-11" />
              </Field>
              <Field label="Due date">
                <input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="input-dark h-11" />
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as OutcomeStatus })} className="input-dark h-11">
                  {statuses.filter((status) => status !== "All").map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </Field>
              <Field label="Priority">
                <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as OutcomePriority })} className="input-dark h-11">
                  {priorities.filter((priority) => priority !== "All").map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                </select>
              </Field>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-950/45 px-6 py-5">
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">Cancel</button>
              <button onClick={saveOutcome} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">{editingOutcome ? "Save Changes" : "Create Outcome"}</button>
            </div>
          </div>
        </div>
      )}
      {selectedOutcome && <OutcomeDetailModal outcome={selectedOutcome} onClose={() => setSelectedOutcome(null)} onEdit={(outcome) => { setSelectedOutcome(null); openEdit(outcome); }} />}
    </div>
  );
}

function OutcomeDetailModal({ outcome, onClose, onEdit }: { outcome: Outcome; onClose: () => void; onEdit: (outcome: Outcome) => void }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div onClick={(event) => event.stopPropagation()} className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between border-b border-slate-700 px-6 py-5">
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><Flag className="h-6 w-6" /></div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{outcome.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{outcome.department} - owned by {outcome.owner}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Close outcome details"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid gap-5 p-6 lg:grid-cols-[1fr_260px]">
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
              <p className="text-sm leading-6 text-slate-300">{outcome.description}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Outcome progress</span>
                <span className="font-semibold text-white">{outcome.progress}%</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-slate-700"><div className="h-3 rounded-full bg-blue-500" style={{ width: `${outcome.progress}%` }} /></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <DetailMetric label="Indicators" value={outcome.indicators} />
              <DetailMetric label="Priority" value={outcome.priority} />
              <DetailMetric label="Due date" value={formatDate(outcome.dueDate)} />
            </div>
          </div>
          <aside className="space-y-3">
            <DetailMetric label="Status" value={outcome.status} />
            <DetailMetric label="Department" value={outcome.department} />
            <DetailMetric label="Owner" value={outcome.owner} />
            <DetailMetric label="Review posture" value={outcome.progress >= 80 ? "Healthy" : outcome.progress >= 50 ? "Watch" : "Needs attention"} />
          </aside>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-950/45 px-6 py-5">
          <button onClick={onClose} className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">Close</button>
          <button onClick={() => onEdit(outcome)} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">Edit Outcome</button>
        </div>
      </div>
    </div>
  );
}

function DetailMetric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-white">{value}</p></div>;
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>
      {children}
    </label>
  );
}

function statusClass(status: OutcomeStatus) {
  switch (status) {
    case "Active":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
    case "Completed":
      return "border-blue-500/40 bg-blue-500/10 text-blue-200";
    case "Pending":
      return "border-amber-500/40 bg-amber-500/10 text-amber-200";
    case "On Hold":
      return "border-red-500/40 bg-red-500/10 text-red-200";
  }
}

function priorityClass(priority: OutcomePriority) {
  switch (priority) {
    case "High":
      return "text-red-300";
    case "Medium":
      return "text-amber-300";
    case "Low":
      return "text-emerald-300";
  }
}

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
