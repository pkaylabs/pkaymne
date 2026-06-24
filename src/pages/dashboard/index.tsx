import {
  Activity,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  FolderKanban,
  RefreshCw,
  Target,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-location";
import { apiRequest } from "@/lib/api/client";

type ActivityItem = {
  id: string;
  type: "project" | "submission";
  title: string;
  description: string;
  created_at: string;
  href: string;
};

type DashboardSummary = {
  projects: number;
  active_projects: number;
  outcomes: number;
  indicators: number;
  forms: number;
  submissions: number;
  pending_submissions: number;
  avg_actual: number;
  project_status: Record<string, number>;
  recent_activity: ActivityItem[];
};

const emptySummary: DashboardSummary = {
  projects: 0,
  active_projects: 0,
  outcomes: 0,
  indicators: 0,
  forms: 0,
  submissions: 0,
  pending_submissions: 0,
  avg_actual: 0,
  project_status: {},
  recent_activity: [],
};

export default function DashboardPage() {
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSummary(await apiRequest<DashboardSummary>("/dashboard/summary"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load the dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const statusTotal = useMemo(
    () => Object.values(summary.project_status).reduce((total, value) => total + value, 0),
    [summary.project_status],
  );

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-full bg-gray-900 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-300">Portfolio intelligence</p>
            <h1 className="mt-1 text-3xl font-semibold text-white">Monitoring overview</h1>
            <p className="mt-2 text-sm text-gray-400">Live results, data collection, and delivery signals across your institution.</p>
          </div>
          <button onClick={() => void load()} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 text-sm font-semibold text-gray-200 transition hover:bg-gray-700">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </header>

        {error && (
          <div className="flex items-center justify-between rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            <span>{error}</span>
            <button onClick={() => void load()} className="font-semibold underline">Try again</button>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Active projects" value={summary.active_projects} detail={`${summary.projects} total`} icon={<FolderKanban />} />
          <Metric label="Outcomes" value={summary.outcomes} detail="Results being monitored" icon={<Target />} />
          <Metric label="Indicators" value={summary.indicators} detail={`${formatNumber(summary.avg_actual)} average actual`} icon={<BarChart3 />} />
          <Metric label="Submissions" value={summary.submissions} detail={`${summary.pending_submissions} awaiting review`} icon={<ClipboardCheck />} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-lg border border-gray-700 bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-700 p-5">
              <div>
                <h2 className="font-semibold text-white">Project portfolio</h2>
                <p className="mt-1 text-sm text-gray-400">Distribution by implementation status</p>
              </div>
              <Link to="/dashboard/projects" className="text-sm font-semibold text-blue-300 hover:text-blue-200">View projects</Link>
            </div>
            <div className="space-y-5 p-5">
              {statusTotal === 0 ? (
                <EmptyState icon={<FolderKanban />} title="No projects yet" body="Create a project to begin monitoring delivery." action="/dashboard/projects" />
              ) : (
                Object.entries(summary.project_status).map(([status, count]) => {
                  const percentage = Math.round((count / statusTotal) * 100);
                  return (
                    <div key={status}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="capitalize text-gray-300">{status}</span>
                        <span className="font-semibold text-white">{count} <span className="font-normal text-gray-500">({percentage}%)</span></span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                        <div className={statusColor(status)} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-800">
            <div className="border-b border-gray-700 p-5">
              <h2 className="font-semibold text-white">Collection readiness</h2>
              <p className="mt-1 text-sm text-gray-400">Forms and review workload</p>
            </div>
            <div className="grid gap-3 p-5">
              <Readiness label="Collection forms" value={summary.forms} icon={<FileText />} href="/dashboard/projects" />
              <Readiness label="Accepted submissions" value={Math.max(summary.submissions - summary.pending_submissions, 0)} icon={<CheckCircle2 />} href="/dashboard/operations/submissions" />
              <Readiness label="Pending review" value={summary.pending_submissions} icon={<Activity />} href="/dashboard/operations/submissions" attention={summary.pending_submissions > 0} />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-700 p-5">
            <div>
              <h2 className="font-semibold text-white">Recent activity</h2>
              <p className="mt-1 text-sm text-gray-400">The latest portfolio and field-data changes</p>
            </div>
          </div>
          {summary.recent_activity.length === 0 ? (
            <EmptyState icon={<Activity />} title="No recent activity" body="Project and submission events will appear here." />
          ) : (
            <div className="divide-y divide-gray-700">
              {summary.recent_activity.slice(0, 8).map((item) => (
                <Link key={item.id} to={item.href} className="flex items-center gap-4 p-5 transition hover:bg-gray-700/40">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-300">
                    {item.type === "project" ? <FolderKanban className="h-5 w-5" /> : <ClipboardCheck className="h-5 w-5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-white">{item.title}</span>
                    <span className="mt-1 block text-sm text-gray-400">{item.description}</span>
                  </span>
                  <time className="hidden shrink-0 text-xs text-gray-500 sm:block">{formatDate(item.created_at)}</time>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, detail, icon }: { label: string; value: number; detail: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{label}</p>
        <span className="text-blue-300 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-white">{formatNumber(value)}</p>
      <p className="mt-1 text-xs text-gray-500">{detail}</p>
    </div>
  );
}

function Readiness({ label, value, icon, href, attention = false }: { label: string; value: number; icon: React.ReactNode; href: string; attention?: boolean }) {
  return (
    <Link to={href} className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/35 p-4 transition hover:border-gray-600">
      <span className={`grid h-10 w-10 place-items-center rounded-lg [&>svg]:h-5 [&>svg]:w-5 ${attention ? "bg-amber-500/10 text-amber-300" : "bg-blue-500/10 text-blue-300"}`}>{icon}</span>
      <span className="flex-1 text-sm text-gray-300">{label}</span>
      <strong className="text-xl text-white">{value}</strong>
    </Link>
  );
}

function EmptyState({ icon, title, body, action }: { icon: React.ReactNode; title: string; body: string; action?: string }) {
  const content = (
    <div className="p-8 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-lg bg-gray-700 text-gray-300 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <p className="mt-3 font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-gray-400">{body}</p>
    </div>
  );
  return action ? <Link to={action} className="block">{content}</Link> : content;
}

function DashboardSkeleton() {
  return <div className="grid min-h-full place-items-center bg-gray-900 text-sm text-gray-400">Loading monitoring overview...</div>;
}

function statusColor(status: string) {
  const color = status === "active" ? "bg-emerald-500" : status === "completed" ? "bg-blue-500" : status === "paused" ? "bg-amber-500" : "bg-slate-500";
  return `h-full rounded-full ${color}`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(Math.round(value * 100) / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
