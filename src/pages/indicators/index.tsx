import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Edit3,
  LineChart,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

type IndicatorStatus = "On Track" | "At Risk" | "Off Track" | "Achieved";

type Indicator = {
  id: number;
  name: string;
  description: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  owner: string;
  department: string;
  outcome: string;
  updatedAt: string;
  status: IndicatorStatus;
};

type IndicatorForm = Omit<Indicator, "id" | "updatedAt" | "status">;

const initialIndicators: Indicator[] = [
  {
    id: 1,
    name: "Share of manufacturing value-added in GDP",
    description: "Percentage of GDP contributed by manufacturing activities.",
    baseline: 3.2,
    target: 4.5,
    current: 4.1,
    unit: "%",
    owner: "Policy and Planning",
    department: "Economic Transformation",
    outcome: "An industrialised and diversified economy",
    updatedAt: "2026-03-10",
    status: "On Track",
  },
  {
    id: 2,
    name: "Growth rate in export share of manufactures and services",
    description: "Increase in export share of priority manufactured goods and service categories.",
    baseline: 65,
    target: 95,
    current: 88,
    unit: "%",
    owner: "Research",
    department: "Trade Analysis",
    outcome: "Competitive private sector",
    updatedAt: "2026-03-12",
    status: "On Track",
  },
  {
    id: 3,
    name: "Youth employment rate",
    description: "Percentage of youth aged 15-24 who are employed in formal or supported work.",
    baseline: 40,
    target: 50,
    current: 45,
    unit: "%",
    owner: "Labour Statistics",
    department: "Inclusive Growth",
    outcome: "Enhanced citizenry participation in the economy",
    updatedAt: "2026-02-28",
    status: "At Risk",
  },
  {
    id: 4,
    name: "Non-extractive export earnings",
    description: "Value of non-extractive export earnings compared against the programme target.",
    baseline: 12.5,
    target: 18,
    current: 11.8,
    unit: "USD m",
    owner: "Finance",
    department: "Trade Analysis",
    outcome: "Competitive private sector",
    updatedAt: "2026-01-20",
    status: "Off Track",
  },
];

const emptyForm: IndicatorForm = {
  name: "",
  description: "",
  baseline: 0,
  target: 0,
  current: 0,
  unit: "%",
  owner: "",
  department: "",
  outcome: "",
};

const statuses: Array<IndicatorStatus | "All"> = ["All", "On Track", "At Risk", "Off Track", "Achieved"];

export default function IndicatorsPage() {
  const [indicators, setIndicators] = useState<Indicator[]>(initialIndicators);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<IndicatorStatus | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);
  const [form, setForm] = useState<IndicatorForm>(emptyForm);

  const departments = useMemo(() => Array.from(new Set(indicators.map((indicator) => indicator.department))), [indicators]);

  const filteredIndicators = useMemo(() => {
    const needle = searchTerm.toLowerCase().trim();
    return indicators.filter((indicator) => {
      const matchesSearch =
        !needle ||
        indicator.name.toLowerCase().includes(needle) ||
        indicator.description.toLowerCase().includes(needle) ||
        indicator.outcome.toLowerCase().includes(needle) ||
        indicator.owner.toLowerCase().includes(needle);
      const matchesStatus = statusFilter === "All" || indicator.status === statusFilter;
      const matchesDepartment = departmentFilter === "All" || indicator.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [departmentFilter, indicators, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const total = indicators.length;
    const achieved = indicators.filter((indicator) => indicator.status === "Achieved").length;
    const atRisk = indicators.filter((indicator) => indicator.status === "At Risk" || indicator.status === "Off Track").length;
    const avgPerformance = Math.round(
      indicators.reduce((sum, indicator) => sum + calculateProgress(indicator.baseline, indicator.target, indicator.current), 0) / Math.max(total, 1)
    );
    return { total, achieved, atRisk, avgPerformance };
  }, [indicators]);

  const openCreate = () => {
    setEditingIndicator(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (indicator: Indicator) => {
    setEditingIndicator(indicator);
    setForm({
      name: indicator.name,
      description: indicator.description,
      baseline: indicator.baseline,
      target: indicator.target,
      current: indicator.current,
      unit: indicator.unit,
      owner: indicator.owner,
      department: indicator.department,
      outcome: indicator.outcome,
    });
    setModalOpen(true);
  };

  const saveIndicator = () => {
    if (!form.name.trim() || !form.description.trim() || !form.outcome.trim()) return;

    const status = statusFromProgress(calculateProgress(form.baseline, form.target, form.current));
    if (editingIndicator) {
      setIndicators((items) =>
        items.map((item) =>
          item.id === editingIndicator.id ? { ...item, ...form, status, updatedAt: new Date().toISOString().slice(0, 10) } : item
        )
      );
    } else {
      const nextId = Math.max(0, ...indicators.map((indicator) => indicator.id)) + 1;
      setIndicators((items) => [...items, { id: nextId, ...form, status, updatedAt: new Date().toISOString().slice(0, 10) }]);
    }
    setModalOpen(false);
  };

  const deleteIndicator = (id: number) => {
    setIndicators((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Indicators</h1>
            <p className="mt-2 text-gray-400">Track baselines, targets, current values, and computed performance across each outcome.</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-5 w-5" />
            Add Indicator
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label="Total Indicators" value={stats.total} icon={<BarChart3 className="h-5 w-5 text-blue-300" />} />
          <StatCard label="Achieved" value={stats.achieved} icon={<CheckCircle2 className="h-5 w-5 text-emerald-300" />} />
          <StatCard label="Needs Attention" value={stats.atRisk} icon={<AlertTriangle className="h-5 w-5 text-amber-300" />} />
          <StatCard label="Avg Performance" value={`${stats.avgPerformance}%`} icon={<Target className="h-5 w-5 text-violet-300" />} />
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800">
          <div className="grid gap-3 border-b border-gray-700 p-5 lg:grid-cols-[1fr_180px_220px] lg:items-center">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-blue-500"
                placeholder="Search indicators, outcomes, owners"
              />
            </label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as IndicatorStatus | "All")} className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500">
              {statuses.map((status) => (
                <option key={status} value={status}>{status === "All" ? "All statuses" : status}</option>
              ))}
            </select>
            <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500">
              <option value="All">All departments</option>
              {departments.map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
          </div>

          <div className="p-3">
            <table className="w-full table-fixed">
              <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="w-[30%] px-3 py-3 font-semibold">Indicator</th>
                  <th className="w-[16%] px-3 py-3 font-semibold">Metrics</th>
                  <th className="w-[13%] px-3 py-3 font-semibold">Status</th>
                  <th className="w-[18%] px-3 py-3 font-semibold">Performance</th>
                  <th className="w-[13%] px-3 py-3 font-semibold">Owner</th>
                  <th className="w-[10%] px-3 py-3 font-semibold">Updated</th>
                  <th className="w-[72px] px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredIndicators.map((indicator) => {
                  const progress = calculateProgress(indicator.baseline, indicator.target, indicator.current);
                  return (
                    <tr key={indicator.id} className="align-top text-sm transition hover:bg-gray-700/35">
                      <td className="px-3 py-4">
                        <p className="font-semibold leading-5 text-white">{indicator.name}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">{indicator.description}</p>
                        <p className="mt-2 line-clamp-1 text-xs text-gray-500">{indicator.outcome}</p>
                      </td>
                      <td className="px-3 py-4">
                        <div className="space-y-2 rounded-lg border border-gray-700 bg-gray-900/45 p-3 text-xs">
                          <MetricLine label="Baseline" value={`${indicator.baseline} ${indicator.unit}`} />
                          <MetricLine label="Target" value={`${indicator.target} ${indicator.unit}`} />
                          <MetricLine label="Current" value={`${indicator.current} ${indicator.unit}`} />
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass(indicator.status)}`}>
                          {statusIcon(indicator.status)}
                          {indicator.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">Progress to target</span>
                            <span className="font-semibold text-white">{progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-700">
                            <div className={`h-2 rounded-full ${progressColor(progress)}`} style={{ width: `${Math.min(progress, 100)}%` }} />
                          </div>
                          <p className="text-xs text-gray-500">{indicator.current} of {indicator.target} {indicator.unit}</p>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <p className="font-medium text-white">{indicator.owner}</p>
                        <p className="mt-1 text-xs text-gray-500">{indicator.department}</p>
                      </td>
                      <td className="px-3 py-4 text-gray-300">{formatDate(indicator.updatedAt)}</td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(indicator)} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-blue-300" aria-label={`Edit ${indicator.name}`}>
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteIndicator(indicator.id)} className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-red-300" aria-label={`Delete ${indicator.name}`}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredIndicators.length === 0 && <div className="p-10 text-center text-gray-400">No indicators match your search or filters.</div>}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div onClick={() => setModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between border-b border-slate-700 px-6 py-5">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300">
                  <LineChart className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{editingIndicator ? "Update indicator" : "Create indicator"}</h2>
                  <p className="mt-1 text-sm text-slate-400">Set the indicator definition and metric values used for automatic performance tracking.</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Close indicator form">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
              <Field label="Indicator name" className="sm:col-span-2">
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="input-dark h-11" placeholder="Youth employment rate" />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="input-dark min-h-24 resize-none" placeholder="Describe what this indicator measures." />
              </Field>
              <Field label="Related outcome" className="sm:col-span-2">
                <input value={form.outcome} onChange={(event) => setForm({ ...form, outcome: event.target.value })} className="input-dark h-11" placeholder="Enhanced citizenry participation in the economy" />
              </Field>
              <Field label="Baseline">
                <input type="number" step="0.01" value={form.baseline} onChange={(event) => setForm({ ...form, baseline: Number(event.target.value) || 0 })} className="input-dark h-11" />
              </Field>
              <Field label="Target">
                <input type="number" step="0.01" value={form.target} onChange={(event) => setForm({ ...form, target: Number(event.target.value) || 0 })} className="input-dark h-11" />
              </Field>
              <Field label="Current">
                <input type="number" step="0.01" value={form.current} onChange={(event) => setForm({ ...form, current: Number(event.target.value) || 0 })} className="input-dark h-11" />
              </Field>
              <Field label="Unit">
                <input value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} className="input-dark h-11" placeholder="%, USD m, score" />
              </Field>
              <Field label="Owner">
                <input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} className="input-dark h-11" placeholder="Policy and Planning" />
              </Field>
              <Field label="Department">
                <input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} className="input-dark h-11" placeholder="Economic Transformation" />
              </Field>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-950/45 px-6 py-5">
              <button onClick={() => setModalOpen(false)} className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">Cancel</button>
              <button onClick={saveIndicator} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">{editingIndicator ? "Save Changes" : "Create Indicator"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-gray-400">{label}</span>
      <span className="text-right font-semibold text-white">{value}</span>
    </div>
  );
}

function calculateProgress(baseline: number, target: number, current: number) {
  if (target === baseline) return 0;
  return Math.round(Math.max(0, ((current - baseline) / (target - baseline)) * 100));
}

function statusFromProgress(progress: number): IndicatorStatus {
  if (progress >= 100) return "Achieved";
  if (progress >= 80) return "On Track";
  if (progress >= 50) return "At Risk";
  return "Off Track";
}

function statusClass(status: IndicatorStatus) {
  switch (status) {
    case "On Track":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
    case "Achieved":
      return "border-blue-500/40 bg-blue-500/10 text-blue-200";
    case "At Risk":
      return "border-amber-500/40 bg-amber-500/10 text-amber-200";
    case "Off Track":
      return "border-red-500/40 bg-red-500/10 text-red-200";
  }
}

function statusIcon(status: IndicatorStatus) {
  switch (status) {
    case "On Track":
      return <TrendingUp className="h-4 w-4" />;
    case "Achieved":
      return <CheckCircle2 className="h-4 w-4" />;
    case "At Risk":
      return <AlertTriangle className="h-4 w-4" />;
    case "Off Track":
      return <TrendingDown className="h-4 w-4" />;
  }
}

function progressColor(progress: number) {
  if (progress >= 100) return "bg-blue-500";
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function formatDate(value: string) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
