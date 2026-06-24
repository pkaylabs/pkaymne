import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Database,
  Download,
  FileClock,
  FileSpreadsheet,
  Filter,
  KeyRound,
  Mail,
  Search,
  SlidersHorizontal,
  Upload,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-location";
import { ActionMenu } from "@/components/core/action-menu";
import { OPERATIONS } from "@/constants/page-path";
import logoUrl from "@/assets/images/logo.png";
import { apiRequest } from "@/lib/api/client";

type Section = "billing" | "notifications" | "audit" | "imports" | "permissions" | "workspace";
type ImportStatus = "Validated" | "Needs Review" | "Queued" | "Imported";
type NotificationTone = "info" | "warning" | "success" | "danger";

const tabs: Array<{ key: Section; label: string; icon: React.ElementType }> = [
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "audit", label: "Audit Log", icon: FileClock },
  { key: "imports", label: "Import / Export", icon: FileSpreadsheet },
  { key: "permissions", label: "Roles", icon: KeyRound },
  { key: "workspace", label: "Workspace", icon: SlidersHorizontal },
];

const invoices = [
  { id: "INV-2026-005", date: "May 22, 2026", amount: "$299.00", status: "Paid", method: "Visa ending 4242" },
  { id: "INV-2026-004", date: "Apr 22, 2026", amount: "$299.00", status: "Paid", method: "Visa ending 4242" },
  { id: "INV-2026-003", date: "Mar 22, 2026", amount: "$299.00", status: "Paid", method: "Bank transfer" },
];
type Invoice = (typeof invoices)[number];

const notifications = [
  { id: "1", title: "Quarterly WASH report exported", body: "Executive summary PDF is ready for review.", project: "WASH Baseline 2026", time: "12 min ago", tone: "success" as NotificationTone, unread: true },
  { id: "2", title: "Submission sync delayed", body: "23 tablet submissions are waiting for connectivity.", project: "Education Access", time: "42 min ago", tone: "warning" as NotificationTone, unread: true },
  { id: "3", title: "Indicator computation failed", body: "Completion Rate formula references a retired form field.", project: "Industrial Transformation", time: "2 hrs ago", tone: "danger" as NotificationTone, unread: false },
  { id: "4", title: "User invite accepted", body: "Ama Mensah joined as Project Analyst.", project: "Workspace", time: "Yesterday", tone: "info" as NotificationTone, unread: false },
];
type NotificationItem = (typeof notifications)[number];

const auditEvents = [
  { id: "AUD-2409", actor: "Mr. Otoo", action: "Updated indicator formula", target: "Completion Rate", area: "Indicators", time: "May 24, 2026 14:35", risk: "Medium" },
  { id: "AUD-2408", actor: "Ama Mensah", action: "Published form version", target: "Household Intake v3", area: "Forms", time: "May 24, 2026 12:10", risk: "Low" },
  { id: "AUD-2407", actor: "System", action: "Recomputed project statistics", target: "WASH Baseline 2026", area: "Reports", time: "May 24, 2026 10:05", risk: "Low" },
  { id: "AUD-2406", actor: "Kofi Boateng", action: "Changed user role", target: "Field Agent to Analyst", area: "Users", time: "May 23, 2026 17:22", risk: "High" },
  { id: "AUD-2405", actor: "Billing Bot", action: "Captured subscription payment", target: "Growth monthly", area: "Billing", time: "May 22, 2026 08:00", risk: "Low" },
];

const imports = [
  { id: "1", name: "district_indicators_may.xlsx", type: "Indicators", rows: 124, status: "Validated" as ImportStatus, owner: "Ama Mensah", updated: "15 min ago" },
  { id: "2", name: "enumerators_batch_04.csv", type: "Users", rows: 47, status: "Imported" as ImportStatus, owner: "Mr. Otoo", updated: "Today" },
  { id: "3", name: "school_submission_backfill.csv", type: "Submissions", rows: 1820, status: "Needs Review" as ImportStatus, owner: "Data Team", updated: "Yesterday" },
  { id: "4", name: "outcome_framework.xlsx", type: "Outcomes", rows: 18, status: "Queued" as ImportStatus, owner: "Policy Unit", updated: "Yesterday" },
];
type ImportItem = (typeof imports)[number];

const roles = [
  { name: "Agency Admin", users: 4, scope: "Workspace-wide", permissions: ["Manage projects", "Invite users", "Billing self-service", "Publish forms"] },
  { name: "Project Manager", users: 11, scope: "Assigned projects", permissions: ["Edit projects", "Approve submissions", "Run reports"] },
  { name: "Analyst", users: 18, scope: "Assigned projects", permissions: ["Review data", "Build reports", "Edit computation rules"] },
  { name: "Field Agent", users: 63, scope: "Assigned forms", permissions: ["Collect submissions", "Sync offline data", "View assigned forms"] },
  { name: "Viewer", users: 9, scope: "Read-only", permissions: ["View dashboards", "Download reports"] },
];

const exports = [
  { name: "Project portfolio", format: "Excel", schedule: "Manual", lastRun: "May 21, 2026" },
  { name: "Monthly donor report", format: "PDF", schedule: "Monthly", lastRun: "May 01, 2026" },
  { name: "Submission archive", format: "CSV", schedule: "Weekly", lastRun: "May 19, 2026" },
];

const usage = [
  { label: "Projects", value: 12, max: 15 },
  { label: "Indicators", value: 184, max: 250 },
  { label: "Users", value: 37, max: 50 },
  { label: "Submissions", value: 18240, max: 25000 },
];

export default function OperationsPage() {
  const section = getSection(useLocation().current.pathname);
  const [query, setQuery] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [liveInvoices, setLiveInvoices] = useState(invoices);
  const [liveNotifications, setLiveNotifications] = useState(notifications);
  const [liveAuditEvents, setLiveAuditEvents] = useState(auditEvents);
  const [liveImports, setLiveImports] = useState(imports);
  const [summary, setSummary] = useState({ currentPlan: "Growth", unreadAlerts: 0, auditEvents: 0, storageUsed: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest<{ current_plan: string; unread_alerts: number; audit_events_count: number; storage_used_percent: number }>("/operations/summary"),
      apiRequest<{ items: Array<{ id: string; date: string; amount: { amount: number; currency: string }; status: string; method: string }> }>("/operations/billing/invoices"),
      apiRequest<{ items: Array<{ id: string; title: string; body: string; project_name: string | null; tone: NotificationTone; unread: boolean; created_at: string }> }>("/operations/notifications"),
      apiRequest<{ items: Array<{ id: string; actor: { name: string }; action: string; target: string; area: string; risk: string; created_at: string }> }>("/operations/audit-events"),
      apiRequest<{ items: Array<{ id: string; name: string; type: string; rows: number; status: string; owner: string; updated: string }> }>("/operations/imports"),
    ])
      .then(([summaryRow, invoiceRows, notificationRows, auditRows, importRows]) => {
        if (!active) return;
        setSummary({
          currentPlan: summaryRow.current_plan,
          unreadAlerts: summaryRow.unread_alerts,
          auditEvents: summaryRow.audit_events_count,
          storageUsed: summaryRow.storage_used_percent,
        });
        setLiveInvoices(invoiceRows.items.map((item) => ({
          id: item.id,
          date: formatTimestamp(item.date),
          amount: new Intl.NumberFormat("en", { style: "currency", currency: item.amount.currency }).format(item.amount.amount),
          status: item.status,
          method: item.method,
        })));
        setLiveNotifications(notificationRows.items.map((item) => ({
          id: item.id,
          title: item.title,
          body: item.body,
          project: item.project_name ?? "Workspace",
          time: formatTimestamp(item.created_at),
          tone: item.tone,
          unread: item.unread,
        })));
        setLiveAuditEvents(auditRows.items.map((item) => ({
          id: item.id,
          actor: item.actor.name,
          action: item.action,
          target: item.target,
          area: item.area,
          time: formatTimestamp(item.created_at),
          risk: item.risk,
        })));
        setLiveImports(importRows.items.map((item) => ({
          id: item.id,
          name: item.name,
          type: item.type,
          rows: item.rows,
          status: normalizeImportStatus(item.status),
          owner: item.owner,
          updated: formatTimestamp(item.updated),
        })));
      })
      .catch((caught) => active && setError(caught instanceof Error ? caught.message : "Unable to load operations data."));
    return () => { active = false; };
  }, []);

  const filteredAuditEvents = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return liveAuditEvents.filter((event) => !needle || [event.actor, event.action, event.target, event.area].some((value) => value.toLowerCase().includes(needle)));
  }, [liveAuditEvents, query]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 pb-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-300">Workspace operations</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Operations Center</h1>
            <p className="mt-2 max-w-3xl text-gray-400">Billing, notifications, auditability, imports, exports, and role previews for the institution workspace.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setImportOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-800">
              <Upload className="h-4 w-4" />
              Import data
            </button>
            <button onClick={() => setUpgradeOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              <ArrowUpRight className="h-4 w-4" />
              Upgrade plan
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Current plan" value={summary.currentPlan} icon={<CreditCard />} />
          <Metric label="Unread alerts" value={summary.unreadAlerts || liveNotifications.filter((item) => item.unread).length} icon={<Bell />} />
          <Metric label="Audit events" value={summary.auditEvents} icon={<FileClock />} />
          <Metric label="Storage used" value={`${summary.storageUsed}%`} icon={<Database />} />
        </div>
        {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        <div className="flex flex-wrap gap-2 rounded-lg border border-gray-700 bg-gray-800 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link key={tab.key} to={`${OPERATIONS}/${tab.key}`} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${section === tab.key ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>

        {section === "billing" && <Billing invoices={liveInvoices} onUpgrade={() => setUpgradeOpen(true)} />}
        {section === "notifications" && <Notifications notifications={liveNotifications} />}
        {section === "audit" && <AuditLog query={query} setQuery={setQuery} events={filteredAuditEvents} />}
        {section === "imports" && <ImportExport imports={liveImports} onImport={() => setImportOpen(true)} />}
        {section === "permissions" && <Permissions />}
        {section === "workspace" && <WorkspacePreferences />}
      </div>

      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
    </div>
  );
}

function Billing({ invoices, onUpgrade }: { invoices: Invoice[]; onUpgrade: () => void }) {
  const downloadInvoice = (invoice: Invoice) => {
    void downloadInvoicePdf(invoice);
  };

  const downloadInvoicePdf = async (invoice: Invoice) => {
    const logo = await loadLogoAsJpeg(logoUrl);
    const blob = buildInvoicePdf(invoice, logo);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-gray-700 bg-gray-800">
        <div className="flex flex-col gap-3 border-b border-gray-700 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Growth plan</h2>
            <p className="mt-1 text-sm text-gray-400">$299/month. Renews on Dec 31, 2026.</p>
          </div>
          <button onClick={onUpgrade} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            <ArrowUpRight className="h-4 w-4" />
            Change plan
          </button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {usage.map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-700 bg-gray-900/45 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{item.label}</span>
                <span className="font-semibold text-white">{item.value.toLocaleString()} / {item.max.toLocaleString()}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-700">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 p-5">
          <h3 className="font-semibold text-white">Invoices</h3>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-700">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="grid gap-3 border-b border-gray-700 p-4 text-sm last:border-b-0 md:grid-cols-[1fr_120px_120px_180px_80px]">
                <span className="font-semibold text-white">{invoice.id}</span>
                <span className="text-gray-300">{invoice.date}</span>
                <span className="text-gray-300">{invoice.amount}</span>
                <span className="text-gray-400">{invoice.method}</span>
                <ActionMenu
                  label={`Actions for ${invoice.id}`}
                  items={[
                    { label: "Download invoice", icon: <Download />, onClick: () => downloadInvoice(invoice) },
                  ]}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <aside className="space-y-6">
        <Panel title="Payment method">
          <div className="rounded-lg border border-gray-700 bg-gray-900/45 p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-blue-300" />
              <div>
                <p className="font-semibold text-white">Visa ending 4242</p>
                <p className="text-sm text-gray-400">Expires 08/28</p>
              </div>
            </div>
            <button className="mt-4 w-full rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700">Update card</button>
          </div>
        </Panel>
        <Panel title="Billing contacts">
          {["finance@pkaymne.org", "admin@pkaymne.org"].map((email) => <div key={email} className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-900/45 p-3 text-sm text-gray-300"><Mail className="h-4 w-4 text-gray-500" />{email}</div>)}
          <button className="w-full rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700">Add contact</button>
        </Panel>
      </aside>
    </div>
  );
}

function Notifications({ notifications }: { notifications: NotificationItem[] }) {
  const [channel, setChannel] = useState("All");
  const [selected, setSelected] = useState<(typeof notifications)[number] | null>(null);
  const filtered = notifications.filter((item) => channel === "All" || item.tone === channel.toLowerCase());
  return (
    <>
    <section className="rounded-lg border border-gray-700 bg-gray-800">
      <div className="flex flex-col gap-3 border-b border-gray-700 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Notification center</h2>
          <p className="mt-1 text-sm text-gray-400">Track operational alerts, report exports, failed computations, and team updates.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Warning", "Danger", "Success", "Info"].map((item) => (
            <button key={item} onClick={() => setChannel(item)} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${channel === item ? "bg-blue-600 text-white" : "border border-gray-600 text-gray-300 hover:bg-gray-700"}`}>{item}</button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-700">
        {filtered.map((item) => <NotificationRow key={item.id} item={item} onOpen={setSelected} />)}
      </div>
      <div className="grid gap-4 border-t border-gray-700 p-5 lg:grid-cols-3">
        {["Email digests", "In-app alerts", "Escalations"].map((item) => (
          <div key={item} className="rounded-lg border border-gray-700 bg-gray-900/45 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">{item}</p>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">Enabled</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">Configure delivery rules and recipients later when backend preferences are wired.</p>
          </div>
        ))}
      </div>
    </section>
    {selected && <NotificationModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function AuditLog({ query, setQuery, events }: { query: string; setQuery: (value: string) => void; events: typeof auditEvents }) {
  return (
    <section className="rounded-lg border border-gray-700 bg-gray-800">
      <div className="grid gap-3 border-b border-gray-700 p-5 lg:grid-cols-[1fr_180px_180px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="input-dark h-11 !pl-10" placeholder="Search actor, action, target, module" />
        </label>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"><Filter className="h-4 w-4" />Filters</button>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"><Download className="h-4 w-4" />Export</button>
      </div>
      <div className="overflow-x-auto p-3">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
            <tr><th className="p-3">Event</th><th className="p-3">Actor</th><th className="p-3">Action</th><th className="p-3">Target</th><th className="p-3">Area</th><th className="p-3">Risk</th><th className="p-3">Time</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {events.map((event) => (
              <tr key={event.id} className="text-gray-300 transition hover:bg-gray-700/35">
                <td className="p-3 font-semibold text-white">{event.id}</td>
                <td className="p-3">{event.actor}</td>
                <td className="p-3">{event.action}</td>
                <td className="p-3">{event.target}</td>
                <td className="p-3">{event.area}</td>
                <td className="p-3"><RiskBadge risk={event.risk} /></td>
                <td className="p-3">{event.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ImportExport({ imports, onImport }: { imports: ImportItem[]; onImport: () => void }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="rounded-lg border border-gray-700 bg-gray-800">
        <div className="flex flex-col gap-3 border-b border-gray-700 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Import queue</h2>
            <p className="mt-1 text-sm text-gray-400">Validate spreadsheet uploads before they touch project data.</p>
          </div>
          <button onClick={onImport} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"><Upload className="h-4 w-4" />New import</button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {imports.map((item) => (
            <div key={item.id} className="rounded-lg border border-gray-700 bg-gray-900/45 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-sm text-gray-400">{item.type} - {item.rows.toLocaleString()} rows</p>
                </div>
                <ImportBadge status={item.status} />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
                <span>{item.owner}</span>
                <span>{item.updated}</span>
              </div>
              <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">Review mapping <ChevronRight className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </section>
      <aside className="space-y-6">
        <Panel title="Export templates">
          {exports.map((item) => (
            <div key={item.name} className="rounded-lg border border-gray-700 bg-gray-900/45 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-sm text-gray-400">{item.format} - {item.schedule}</p>
                </div>
                <ActionMenu
                  label={`Actions for ${item.name}`}
                  items={[
                    { label: "Run export", icon: <Download />, onClick: () => undefined },
                  ]}
                />
              </div>
              <p className="mt-3 text-xs text-gray-500">Last run {item.lastRun}</p>
            </div>
          ))}
        </Panel>
      </aside>
    </div>
  );
}

function Permissions() {
  return (
    <section className="rounded-lg border border-gray-700 bg-gray-800">
      <div className="border-b border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-white">Role and permission preview</h2>
        <p className="mt-1 text-sm text-gray-400">UI model for access control. Enforcement can be wired when backend policies are ready.</p>
      </div>
      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {roles.map((role) => (
          <div key={role.name} className="rounded-lg border border-gray-700 bg-gray-900/45 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{role.scope}</p>
              </div>
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-200">{role.users} users</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {role.permissions.map((permission) => (
                <span key={permission} className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-300">{permission}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkspacePreferences() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {[
        ["Saved filters", "Pin department, project status, and date ranges across reports.", "4 saved views"],
        ["Favorites", "Keep important projects, indicators, and reports one click away.", "9 pinned items"],
        ["Data retention", "Preview workspace retention rules for submissions and exports.", "7 years"],
        ["Security", "Prepare MFA, session duration, and API token controls.", "MFA planned"],
        ["Branding", "Set report logos, colors, and cover page defaults.", "PKay theme"],
        ["Command center", "Search projects, users, reports, companies, audit entries, and settings.", "Top bar ready"],
      ].map(([title, body, meta]) => (
        <section key={title} className="rounded-lg border border-gray-700 bg-gray-800 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-white">{title}</h2>
            <span className="rounded-full bg-gray-900 px-2.5 py-1 text-xs font-semibold text-gray-300">{meta}</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-400">{body}</p>
          <button className="mt-5 w-full rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700">Configure</button>
        </section>
      ))}
    </div>
  );
}

function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} title="Change subscription plan" icon={<CreditCard className="h-6 w-6" />} description="Preview the upgrade and billing changes before this is connected to payments.">
      <div className="grid gap-4 p-6 md:grid-cols-3">
        {[
          ["Starter", "$99", "3 projects"],
          ["Growth", "$299", "15 projects"],
          ["Enterprise", "Custom", "Unlimited scale"],
        ].map(([name, price, detail]) => (
          <button key={name} className={`rounded-xl border p-4 text-left transition ${name === "Growth" ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-800/60 hover:bg-slate-800"}`}>
            <p className="font-semibold text-white">{name}</p>
            <p className="mt-2 text-2xl font-bold text-white">{price}</p>
            <p className="mt-1 text-sm text-slate-400">{detail}</p>
          </button>
        ))}
      </div>
      <ModalActions onClose={onClose} primary="Save plan preview" />
    </Modal>
  );
}

function ImportModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} title="Start spreadsheet import" icon={<Upload className="h-6 w-6" />} description="Create a UI-only import job and preview validation rules.">
      <div className="grid gap-5 p-6 sm:grid-cols-2">
        <Field label="Import type">
          <select className="input-dark h-11"><option>Indicators</option><option>Outcomes</option><option>Users</option><option>Submissions</option></select>
        </Field>
        <Field label="Project">
          <select className="input-dark h-11"><option>WASH Baseline 2026</option><option>Education Access</option><option>Industrial Transformation</option></select>
        </Field>
        <Field label="File name">
          <input className="input-dark h-11" placeholder="indicators_may.xlsx" />
        </Field>
        <Field label="Validation profile">
          <select className="input-dark h-11"><option>Strict headers</option><option>Flexible mapping</option><option>Append only</option></select>
        </Field>
      </div>
      <ModalActions onClose={onClose} primary="Create import job" />
    </Modal>
  );
}

function Modal({ onClose, title, description, icon, children }: { onClose: () => void; title: string; description: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div onClick={(event) => event.stopPropagation()} className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between border-b border-slate-700 px-6 py-5">
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300">{icon}</div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-1 text-sm text-slate-400">{description}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Close modal"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ onClose, primary }: { onClose: () => void; primary: string }) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-950/45 px-6 py-5">
      <button onClick={onClose} className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">Cancel</button>
      <button onClick={onClose} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">{primary}</button>
    </div>
  );
}

function NotificationRow({ item, onOpen }: { item: (typeof notifications)[number]; onOpen: (item: (typeof notifications)[number]) => void }) {
  const Icon = item.tone === "success" ? CheckCircle2 : item.tone === "danger" ? AlertCircle : item.tone === "warning" ? Clock3 : Bell;
  const tone = item.tone === "success" ? "text-emerald-300 bg-emerald-500/10" : item.tone === "danger" ? "text-red-300 bg-red-500/10" : item.tone === "warning" ? "text-amber-300 bg-amber-500/10" : "text-blue-300 bg-blue-500/10";
  return (
    <div className="flex gap-4 p-5">
      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${tone}`}><Icon className="h-5 w-5" /></div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-white">{item.title}</h3>
          {item.unread && <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">New</span>}
        </div>
        <p className="mt-1 text-sm text-gray-400">{item.body}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500"><span>{item.project}</span><span>{item.time}</span></div>
      </div>
      <button onClick={() => onOpen(item)} className="hidden rounded-lg border border-gray-700 px-3 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-700 sm:block">Open</button>
    </div>
  );
}

function NotificationModal({ item, onClose }: { item: (typeof notifications)[number]; onClose: () => void }) {
  const Icon = item.tone === "success" ? CheckCircle2 : item.tone === "danger" ? AlertCircle : item.tone === "warning" ? Clock3 : Bell;
  return (
    <Modal onClose={onClose} title={item.title} icon={<Icon className="h-6 w-6" />} description={`${item.project} - ${item.time}`}>
      <div className="space-y-5 p-6">
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
          <p className="text-sm leading-6 text-slate-200">{item.body}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4"><p className="text-xs text-slate-500">Tone</p><p className="mt-1 font-semibold capitalize text-white">{item.tone}</p></div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4"><p className="text-xs text-slate-500">Project</p><p className="mt-1 font-semibold text-white">{item.project}</p></div>
          <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-4"><p className="text-xs text-slate-500">Status</p><p className="mt-1 font-semibold text-white">{item.unread ? "Unread" : "Read"}</p></div>
        </div>
      </div>
      <ModalActions onClose={onClose} primary="Mark as handled" />
    </Modal>
  );
}

async function loadLogoAsJpeg(src: string) {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
  const maxWidth = 150;
  const ratio = Math.min(1, maxWidth / image.width);
  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare invoice logo.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
  return { bytes: dataUrlToBytes(dataUrl), width, height };
}

function buildInvoicePdf(invoice: Invoice, logo: { bytes: Uint8Array; width: number; height: number }) {
  const rows = [
    ["Subscription plan", "Growth monthly"],
    ["Billing period", invoice.date],
    ["Payment method", invoice.method],
    ["Status", invoice.status],
  ];
  const logoWidth = 145;
  const logoHeight = Math.max(34, (logo.height / logo.width) * logoWidth);
  const lines = [
    "q",
    `${logoWidth} 0 0 ${logoHeight.toFixed(2)} 40 760 cm`,
    "/Logo Do",
    "Q",
    "0.06 0.09 0.16 rg",
    "40 116 515 72 re f",
    text("INVOICE", 430, 790, 24, "0.06 0.09 0.16"),
    text(invoice.id, 430, 764, 12, "0.39 0.45 0.55"),
    text(`Issued ${invoice.date}`, 430, 746, 10, "0.39 0.45 0.55"),
    text("Billed to", 40, 690, 13, "0.06 0.09 0.16"),
    text("PKay Monitoring and Evaluation Agency", 40, 668, 11, "0.06 0.09 0.16"),
    text("admin@pkaymne.org", 40, 652, 10, "0.39 0.45 0.55"),
    text("Accra, Ghana", 40, 636, 10, "0.39 0.45 0.55"),
    text("From", 330, 690, 13, "0.06 0.09 0.16"),
    text("PKay M&E SaaS", 330, 668, 11, "0.06 0.09 0.16"),
    text("Monitoring, evaluation, reporting,", 330, 652, 10, "0.39 0.45 0.55"),
    text("and field data operations.", 330, 636, 10, "0.39 0.45 0.55"),
    ...rows.flatMap(([label, value], index) => {
      const y = 570 - index * 42;
      return [
        "0.89 0.92 0.96 RG",
        `40 ${y - 13} 515 0.7 re S`,
        text(label, 40, y, 10, "0.39 0.45 0.55"),
        text(value, 390, y, 11, "0.06 0.09 0.16"),
      ];
    }),
    text("Amount paid", 64, 154, 12, "1 1 1"),
    text(invoice.status, 64, 134, 9, "0.80 0.86 0.94"),
    text(invoice.amount, 430, 145, 24, "1 1 1"),
    text("Thank you for using PKay M&E. Keep this invoice for your institution's financial and audit records.", 40, 72, 9, "0.39 0.45 0.55"),
  ].join("\n");

  return writePdf(lines, logo);
}

function text(value: string, x: number, y: number, size: number, color: string) {
  return `${color} rg BT /F1 ${size} Tf ${x} ${y} Td (${escapePdf(value)}) Tj ET`;
}

function writePdf(content: string, logo: { bytes: Uint8Array; width: number; height: number }) {
  const encoder = new TextEncoder();
  const contentBytes = encoder.encode(content);
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (part: string | Uint8Array) => {
    const bytes = typeof part === "string" ? encoder.encode(part) : part;
    chunks.push(bytes);
    length += bytes.length;
  };
  const object = (id: number, body: string | Uint8Array, prefix = "", suffix = "") => {
    offsets[id] = length;
    push(`${id} 0 obj\n${prefix}`);
    push(body);
    push(`${suffix}\nendobj\n`);
  };

  push("%PDF-1.4\n");
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  object(3, "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> /XObject << /Logo 5 0 R >> >> /Contents 6 0 R >>");
  object(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  object(5, logo.bytes, `<< /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logo.bytes.length} >>\nstream\n`, "\nendstream");
  object(6, contentBytes, `<< /Length ${contentBytes.length} >>\nstream\n`, "\nendstream");
  const xrefOffset = length;
  push(`xref\n0 7\n0000000000 65535 f \n`);
  for (let id = 1; id <= 6; id += 1) {
    push(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }
  push(`trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Blob(chunks, { type: "application/pdf" });
}

function dataUrlToBytes(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function escapePdf(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
      <div className="flex items-center justify-between text-gray-400"><span className="text-sm">{label}</span><span className="text-blue-300 [&_svg]:h-5 [&_svg]:w-5">{icon}</span></div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-3 rounded-lg border border-gray-700 bg-gray-800 p-5"><h2 className="text-lg font-semibold text-white">{title}</h2>{children}</section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>{children}</label>;
}

function RiskBadge({ risk }: { risk: string }) {
  const tone = risk === "High" ? "border-red-500/40 bg-red-500/10 text-red-200" : risk === "Medium" ? "border-amber-500/40 bg-amber-500/10 text-amber-200" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>{risk}</span>;
}

function ImportBadge({ status }: { status: ImportStatus }) {
  const tone = status === "Imported" || status === "Validated" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : status === "Needs Review" ? "border-amber-500/40 bg-amber-500/10 text-amber-200" : "border-blue-500/40 bg-blue-500/10 text-blue-200";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}

function getSection(pathname: string): Section {
  const last = pathname.split("/").filter(Boolean).at(-1);
  return last && ["billing", "notifications", "audit", "imports", "permissions", "workspace"].includes(last) ? (last as Section) : "billing";
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function normalizeImportStatus(status: string): ImportStatus {
  const normalized = status.toLowerCase();
  if (normalized === "success" || normalized === "imported") return "Imported";
  if (normalized === "warning" || normalized === "needs review") return "Needs Review";
  if (normalized === "validated") return "Validated";
  return "Queued";
}
