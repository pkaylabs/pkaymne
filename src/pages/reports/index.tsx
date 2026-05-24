import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  LineChart,
  PieChart,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  Target,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";

type IndicatorStatus = "On Track" | "At Risk" | "Off Track" | "Achieved";
type ReportTemplate = "Executive Summary" | "Indicator Performance" | "Field Collection" | "Donor Brief";

type IndicatorData = {
  id: number;
  name: string;
  baseline: number;
  target: number;
  actual: number;
  unit: string;
  status: IndicatorStatus;
  objective: string;
  assignee: string;
  category: string;
  quality: number;
  submissions: number;
  history: number[];
};

const indicators: IndicatorData[] = [
  {
    id: 1,
    name: "Manufacturing value-added share of GDP",
    baseline: 3.2,
    target: 4.5,
    actual: 4.1,
    unit: "%",
    status: "On Track",
    objective: "Industrialised and diversified economy",
    assignee: "Sarah Johnson",
    category: "Policy and Planning",
    quality: 96,
    submissions: 428,
    history: [3.2, 3.5, 3.8, 4.1],
  },
  {
    id: 2,
    name: "Youth employment rate",
    baseline: 40,
    target: 50,
    actual: 45,
    unit: "%",
    status: "At Risk",
    objective: "Enhanced citizenry participation",
    assignee: "Mike Chen",
    category: "Employment",
    quality: 89,
    submissions: 314,
    history: [40, 42, 44, 45],
  },
  {
    id: 3,
    name: "Non-extractive export earnings",
    baseline: 12.5,
    target: 18,
    actual: 19.2,
    unit: "USD m",
    status: "Achieved",
    objective: "Competitive private sector",
    assignee: "Lisa Rodriguez",
    category: "Trade",
    quality: 98,
    submissions: 176,
    history: [12.5, 14.1, 16.4, 19.2],
  },
  {
    id: 4,
    name: "District service turnaround time",
    baseline: 9,
    target: 4,
    actual: 6,
    unit: "days",
    status: "Off Track",
    objective: "Responsive public service delivery",
    assignee: "James Smith",
    category: "Service Delivery",
    quality: 81,
    submissions: 219,
    history: [9, 8, 7, 6],
  },
];

const savedReports = [
  ["Q1 Programme Performance Pack", "Executive Summary", "May 18, 2026", "Ready"],
  ["Manufacturing Indicator Review", "Indicator Performance", "May 12, 2026", "Ready"],
  ["District Field Collection Audit", "Field Collection", "Apr 29, 2026", "Draft"],
];

export default function ReportsPage() {
  const [template, setTemplate] = useState<ReportTemplate>("Executive Summary");
  const [status, setStatus] = useState<IndicatorStatus | "All">("All");
  const [department, setDepartment] = useState("All");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);

  const filtered = useMemo(() => {
    return indicators.filter((indicator) => {
      const matchesStatus = status === "All" || indicator.status === status;
      const matchesDepartment = department === "All" || indicator.category === department;
      return matchesStatus && matchesDepartment;
    });
  }, [status, department]);

  const stats = useMemo(() => {
    const total = filtered.length || 1;
    const achieved = filtered.filter((item) => item.status === "Achieved").length;
    const onTrack = filtered.filter((item) => item.status === "On Track").length;
    const atRisk = filtered.filter((item) => item.status === "At Risk" || item.status === "Off Track").length;
    const quality = Math.round(filtered.reduce((sum, item) => sum + item.quality, 0) / total);
    const submissions = filtered.reduce((sum, item) => sum + item.submissions, 0);
    const progress = Math.round(
      filtered.reduce((sum, item) => sum + Math.min(100, Math.max(0, ((item.actual - item.baseline) / (item.target - item.baseline)) * 100)), 0) / total
    );
    return { total: filtered.length, achieved, onTrack, atRisk, quality, submissions, progress };
  }, [filtered]);

  const departments = ["All", ...Array.from(new Set(indicators.map((item) => item.category)))];

  const generateReport = async () => {
    setIsGenerating(true);
    setGenerated(false);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsGenerating(false);
    setGenerated(true);
  };

  const exportReport = () => {
    const reportData = {
      template,
      filters: { status, department },
      generatedAt: new Date().toISOString(),
      stats,
      indicators: filtered,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pkay-mne-${template.toLowerCase().replaceAll(" ", "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">
              <Sparkles className="h-4 w-4" />
              Reporting center
            </div>
            <h1 className="mt-3 text-3xl font-bold text-white">Reports</h1>
            <p className="mt-2 max-w-3xl text-gray-400">
              Generate board-ready programme reports from indicators, field submissions, quality checks, and performance trends.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportReport} className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button onClick={generateReport} disabled={isGenerating} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:bg-gray-600">
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {isGenerating ? "Generating..." : "Generate report"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Indicators in report" value={stats.total} icon={<Target />} tone="blue" />
          <MetricCard title="On track or achieved" value={stats.onTrack + stats.achieved} icon={<CheckCircle2 />} tone="green" />
          <MetricCard title="At-risk items" value={stats.atRisk} icon={<AlertTriangle />} tone="amber" />
          <MetricCard title="Data quality score" value={`${stats.quality}%`} icon={<BarChart3 />} tone="purple" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <section className="rounded-xl border border-gray-700 bg-gray-800 p-5">
            <div className="flex items-center gap-2 text-white">
              <Filter className="h-5 w-5 text-blue-300" />
              <h2 className="text-lg font-semibold">Report setup</h2>
            </div>
            <div className="mt-5 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-300">Template</span>
                <select value={template} onChange={(event) => setTemplate(event.target.value as ReportTemplate)} className="report-control">
                  {["Executive Summary", "Indicator Performance", "Field Collection", "Donor Brief"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">Status</span>
                  <select value={status} onChange={(event) => setStatus(event.target.value as IndicatorStatus | "All")} className="report-control">
                    {["All", "On Track", "At Risk", "Off Track", "Achieved"].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">Department</span>
                  <select value={department} onChange={(event) => setDepartment(event.target.value)} className="report-control">
                    {departments.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">Start date</span>
                  <input type="date" defaultValue="2026-01-01" className="report-control" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-300">End date</span>
                  <input type="date" defaultValue="2026-05-24" className="report-control" />
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-700 bg-gray-800 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{template}</h2>
                <p className="mt-1 text-sm text-gray-400">Generated from {stats.submissions.toLocaleString()} field submissions.</p>
              </div>
              <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${generated ? "bg-emerald-500/10 text-emerald-200" : "bg-amber-500/10 text-amber-200"}`}>
                {generated ? "Ready" : "Draft"}
              </span>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <TrendPanel data={filtered} />
              <StatusPanel data={filtered} />
            </div>
          </section>
        </div>

        {isGenerating && (
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 text-blue-100">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Processing submissions, recomputing summaries, and preparing charts...
            </div>
          </div>
        )}

        {generated && (
          <section className="rounded-xl border border-gray-700 bg-gray-800 p-6">
            <div className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-blue-300" />
              <h2 className="text-lg font-semibold">Executive narrative</h2>
            </div>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="font-semibold text-white">Key findings</h3>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-gray-300">
                  <li className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />{stats.onTrack + stats.achieved} indicators are either on track or already achieved.</li>
                  <li className="flex gap-2"><BarChart3 className="mt-1 h-4 w-4 shrink-0 text-blue-400" />Average data quality is {stats.quality}%, supporting confidence in reported performance.</li>
                  <li className="flex gap-2"><AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-400" />{stats.atRisk} indicators require management attention in the next review cycle.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white">Recommended actions</h3>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-gray-300">
                  <li className="flex gap-2"><Clock className="mt-1 h-4 w-4 shrink-0 text-blue-400" />Schedule follow-up reviews for at-risk indicators within 14 days.</li>
                  <li className="flex gap-2"><Send className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />Share the executive report with project leads and donor focal points.</li>
                  <li className="flex gap-2"><Calendar className="mt-1 h-4 w-4 shrink-0 text-purple-400" />Lock data collection windows before final report export.</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-xl border border-gray-700 bg-gray-800">
          <div className="border-b border-gray-700 p-5">
            <h2 className="text-lg font-semibold text-white">Saved reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700 text-left text-gray-400">
                <tr>
                  <th className="p-4 font-medium">Report</th>
                  <th className="p-4 font-medium">Template</th>
                  <th className="p-4 font-medium">Generated</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedReports.map(([name, type, date, reportStatus]) => (
                  <tr key={name} className="border-b border-gray-700 text-gray-300 last:border-0">
                    <td className="p-4 font-medium text-white">{name}</td>
                    <td className="p-4">{type}</td>
                    <td className="p-4">{date}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-200">{reportStatus}</span>
                    </td>
                    <td className="p-4">
                      <button className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-xs font-medium text-gray-200 transition hover:bg-gray-700">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, tone }: { title: string; value: string | number; icon: React.ReactNode; tone: "blue" | "green" | "amber" | "purple" }) {
  const tones = {
    blue: "bg-blue-500/10 text-blue-300",
    green: "bg-emerald-500/10 text-emerald-300",
    amber: "bg-amber-500/10 text-amber-300",
    purple: "bg-purple-500/10 text-purple-300",
  };
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        <div className={`rounded-lg p-2 ${tones[tone]}`}>{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}

function TrendPanel({ data }: { data: IndicatorData[] }) {
  const max = Math.max(...data.flatMap((item) => item.history), 1);
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-white">
        <LineChart className="h-5 w-5 text-blue-300" />
        <h3 className="font-semibold">Performance trends</h3>
      </div>
      <div className="space-y-4">
        {data.slice(0, 4).map((indicator, index) => {
          const path = indicator.history
            .map((value, i) => `${i === 0 ? "M" : "L"} ${(i / (indicator.history.length - 1)) * 100} ${56 - (value / max) * 50}`)
            .join(" ");
          return (
            <div key={indicator.id} className="rounded-lg border border-gray-700 bg-gray-900/50 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-medium text-white">{indicator.name}</p>
                {index % 2 === 0 ? <ArrowUp className="h-4 w-4 text-emerald-400" /> : <ArrowDown className="h-4 w-4 text-amber-400" />}
              </div>
              <svg className="mt-3 h-14 w-full" viewBox="0 0 100 60" preserveAspectRatio="none">
                <path d={path} fill="none" stroke="#60a5fa" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusPanel({ data }: { data: IndicatorData[] }) {
  const statusCounts = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  const total = data.length || 1;
  const colors: Record<string, string> = {
    "On Track": "bg-emerald-400",
    "At Risk": "bg-amber-400",
    "Off Track": "bg-red-400",
    Achieved: "bg-blue-400",
  };
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-white">
        <PieChart className="h-5 w-5 text-amber-300" />
        <h3 className="font-semibold">Status distribution</h3>
      </div>
      <div className="space-y-4">
        {["On Track", "Achieved", "At Risk", "Off Track"].map((status) => {
          const count = statusCounts[status] || 0;
          const width = `${(count / total) * 100}%`;
          return (
            <div key={status}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-300">{status}</span>
                <span className="font-medium text-white">{count}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-700">
                <div className={`h-2 rounded-full ${colors[status]}`} style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
