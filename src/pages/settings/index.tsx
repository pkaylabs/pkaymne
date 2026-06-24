import {
  AlertTriangle,
  Bell,
  Building2,
  CheckCircle2,
  CreditCard,
  Database,
  Download,
  FileKey2,
  Globe2,
  Link2,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UploadCloud,
  Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";

type Settings = {
  institution: {
    name: string;
    type: string;
    country: string;
    timezone: string;
    fiscalYear: string;
    contactEmail: string;
  };
  subscription: {
    plan: string;
    billingEmail: string;
    renewal: string;
    seats: number;
  };
  security: {
    sso: boolean;
    twoFactor: boolean;
    sessionTimeout: string;
    ipAllowlist: boolean;
  };
  data: {
    retention: string;
    approvalRequired: boolean;
    evidenceRequired: boolean;
    exportEnabled: boolean;
  };
  notifications: {
    weeklyDigest: boolean;
    offTrackAlerts: boolean;
    submissionReview: boolean;
    billingAlerts: boolean;
  };
};
type Department = { id: number; name: string; description: string | null };

const initialSettings: Settings = {
  institution: {
    name: "PKay Monitoring and Evaluation Agency",
    type: "Monitoring and Evaluation Agency",
    country: "Ghana",
    timezone: "Africa/Accra",
    fiscalYear: "January - December",
    contactEmail: "admin@pkaymne.org",
  },
  subscription: {
    plan: "Growth",
    billingEmail: "billing@pkaymne.org",
    renewal: "December 31, 2026",
    seats: 50,
  },
  security: {
    sso: false,
    twoFactor: true,
    sessionTimeout: "8 hours",
    ipAllowlist: false,
  },
  data: {
    retention: "7 years",
    approvalRequired: true,
    evidenceRequired: true,
    exportEnabled: true,
  },
  notifications: {
    weeklyDigest: true,
    offTrackAlerts: true,
    submissionReview: true,
    billingAlerts: false,
  },
};

const auditEvents = [
  ["Kojo Otoo", "Updated project approval policy", "Today, 09:18"],
  ["Ama Boateng", "Published field form v1.3", "Yesterday, 16:42"],
  ["System", "Completed nightly data backup", "Yesterday, 02:00"],
  ["Daniel Mensah", "Changed field agent access", "May 22, 2026"],
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: "Monitoring and Evaluation", description: "Programme tracking and institutional reporting." },
    { id: 2, name: "Policy and Planning", description: "Planning, policy review, and strategic coordination." },
  ]);
  const [departmentForm, setDepartmentForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      try {
        const [rows, organization] = await Promise.all([
          apiRequest<Department[]>("/organizations/departments"),
          apiRequest<{ name: string; settings: Partial<Settings> }>("/organizations/me"),
        ]);
        if (!active) return;
        setDepartments(rows);
        setSettings((current) => ({
          ...current,
          ...organization.settings,
          institution: {
            ...current.institution,
            ...(organization.settings.institution ?? {}),
            name: organization.name,
          },
        }));
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : "Unable to load workspace settings.");
      }
    }
    void loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError("");
      await apiRequest("/organizations/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: settings.institution.name,
          settings,
        }),
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save workspace settings.");
    } finally {
      setSaving(false);
    }
  };

  const update = <Section extends keyof Settings>(section: Section, patch: Partial<Settings[Section]>) => {
    setSettings((current) => ({ ...current, [section]: { ...current[section], ...patch } }));
  };

  const createDepartment = async () => {
    if (!departmentForm.name.trim()) return;
    try {
      const created = await apiRequest<Department>("/organizations/departments", {
        method: "POST",
        body: JSON.stringify(departmentForm),
      });
      setDepartments((items) => [...items, created]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create department.");
      return;
    }
    setDepartmentForm({ name: "", description: "" });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 pb-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="mt-2 max-w-3xl text-gray-400">
              Manage institution profile, subscription, security, data governance, and workspace operating rules.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-800">
              <Download className="h-4 w-4" />
              Export Config
            </button>
            <button onClick={saveSettings} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-600">
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {saved && (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              Settings saved successfully.
            </div>
          </div>
        )}
        {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Plan" value={settings.subscription.plan} icon={<CreditCard />} />
          <Metric label="Seats" value={`${settings.subscription.seats} users`} icon={<Users />} />
          <Metric label="2FA" value={settings.security.twoFactor ? "On" : "Off"} icon={<ShieldCheck />} />
          <Metric label="Retention" value={settings.data.retention} icon={<Database />} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <SettingsCard title="Institution Profile" description="Core tenant details shown across dashboards, exports, and reports." icon={<Building2 />}>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Institution name">
                  <input value={settings.institution.name} onChange={(event) => update("institution", { name: event.target.value })} className="input-dark h-11" />
                </Field>
                <Field label="Institution type">
                  <select value={settings.institution.type} onChange={(event) => update("institution", { type: event.target.value })} className="input-dark h-11">
                    {["Monitoring and Evaluation Agency", "Government Institution", "NGO / Development Partner", "Research Institution", "Private Sector"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="Country">
                  <input value={settings.institution.country} onChange={(event) => update("institution", { country: event.target.value })} className="input-dark h-11" />
                </Field>
                <Field label="Timezone">
                  <select value={settings.institution.timezone} onChange={(event) => update("institution", { timezone: event.target.value })} className="input-dark h-11">
                    {["Africa/Accra", "Africa/Lagos", "Africa/Nairobi", "Europe/London", "UTC"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="Fiscal year">
                  <select value={settings.institution.fiscalYear} onChange={(event) => update("institution", { fiscalYear: event.target.value })} className="input-dark h-11">
                    {["January - December", "April - March", "July - June", "October - September"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="Primary contact email">
                  <input value={settings.institution.contactEmail} onChange={(event) => update("institution", { contactEmail: event.target.value })} className="input-dark h-11" />
                </Field>
              </div>
            </SettingsCard>

            <SettingsCard title="Departments" description="Create institution departments used for project ownership, filters, and reporting." icon={<Building2 />}>
              <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto]">
                <Field label="Department name">
                  <input value={departmentForm.name} onChange={(event) => setDepartmentForm({ ...departmentForm, name: event.target.value })} className="input-dark h-11" placeholder="Research and Evaluation" />
                </Field>
                <Field label="Description">
                  <input value={departmentForm.description} onChange={(event) => setDepartmentForm({ ...departmentForm, description: event.target.value })} className="input-dark h-11" placeholder="Optional department purpose" />
                </Field>
                <div className="flex items-end">
                  <button onClick={createDepartment} className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {departments.map((department) => (
                  <div key={department.id} className="rounded-lg border border-gray-700 bg-gray-900/45 p-4">
                    <p className="font-semibold text-white">{department.name}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-400">{department.description || "No description yet."}</p>
                  </div>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard title="Subscription & Billing" description="Plan limits, renewal information, and billing contact." icon={<CreditCard />}>
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Current plan">
                  <select value={settings.subscription.plan} onChange={(event) => update("subscription", { plan: event.target.value })} className="input-dark h-11">
                    {["Starter", "Growth", "Enterprise"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="Seat limit">
                  <input type="number" value={settings.subscription.seats} onChange={(event) => update("subscription", { seats: Number(event.target.value) || 1 })} className="input-dark h-11" />
                </Field>
                <Field label="Renewal date">
                  <input value={settings.subscription.renewal} onChange={(event) => update("subscription", { renewal: event.target.value })} className="input-dark h-11" />
                </Field>
                <Field label="Billing email" className="md:col-span-2">
                  <input value={settings.subscription.billingEmail} onChange={(event) => update("subscription", { billingEmail: event.target.value })} className="input-dark h-11" />
                </Field>
                <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                  <p className="text-sm font-semibold text-blue-100">Usage</p>
                  <p className="mt-2 text-2xl font-bold text-white">37 / {settings.subscription.seats}</p>
                  <p className="mt-1 text-xs text-blue-100/75">Active seats used</p>
                </div>
              </div>
            </SettingsCard>

            <SettingsCard title="Security & Access" description="Authentication, session, and access-control policy." icon={<Lock />}>
              <div className="grid gap-4 md:grid-cols-2">
                <ToggleRow title="Require two-factor authentication" description="Apply 2FA to privileged users." enabled={settings.security.twoFactor} onChange={(value) => update("security", { twoFactor: value })} />
                <ToggleRow title="Enable SSO" description="Prepare SAML/OIDC sign-in for institutions." enabled={settings.security.sso} onChange={(value) => update("security", { sso: value })} />
                <ToggleRow title="IP allowlist" description="Restrict admin access to approved networks." enabled={settings.security.ipAllowlist} onChange={(value) => update("security", { ipAllowlist: value })} />
                <Field label="Session timeout">
                  <select value={settings.security.sessionTimeout} onChange={(event) => update("security", { sessionTimeout: event.target.value })} className="input-dark h-11">
                    {["1 hour", "4 hours", "8 hours", "12 hours", "24 hours"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
              </div>
            </SettingsCard>

            <SettingsCard title="Data Governance" description="Submission approval, export controls, evidence policy, and retention." icon={<Database />}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Data retention period">
                  <select value={settings.data.retention} onChange={(event) => update("data", { retention: event.target.value })} className="input-dark h-11">
                    {["2 years", "5 years", "7 years", "10 years", "Custom"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <ToggleRow title="Allow exports" description="Permit CSV/JSON/PDF exports from dashboards." enabled={settings.data.exportEnabled} onChange={(value) => update("data", { exportEnabled: value })} />
                <ToggleRow title="Require submission approval" description="Only approved submissions feed indicator computation." enabled={settings.data.approvalRequired} onChange={(value) => update("data", { approvalRequired: value })} />
                <ToggleRow title="Require evidence attachments" description="Ask field agents for photo or file evidence where configured." enabled={settings.data.evidenceRequired} onChange={(value) => update("data", { evidenceRequired: value })} />
              </div>
            </SettingsCard>

            <SettingsCard title="Notification Policy" description="Workspace-wide notification defaults." icon={<Bell />}>
              <div className="grid gap-4 md:grid-cols-2">
                <ToggleRow title="Weekly digest" description="Send institution performance summary every week." enabled={settings.notifications.weeklyDigest} onChange={(value) => update("notifications", { weeklyDigest: value })} />
                <ToggleRow title="Off-track indicator alerts" description="Notify managers when computed values fall below thresholds." enabled={settings.notifications.offTrackAlerts} onChange={(value) => update("notifications", { offTrackAlerts: value })} />
                <ToggleRow title="Submission review reminders" description="Prompt reviewers when queues build up." enabled={settings.notifications.submissionReview} onChange={(value) => update("notifications", { submissionReview: value })} />
                <ToggleRow title="Billing alerts" description="Send plan, payment, and renewal notifications." enabled={settings.notifications.billingAlerts} onChange={(value) => update("notifications", { billingAlerts: value })} />
              </div>
            </SettingsCard>
          </div>

          <aside className="space-y-6">
            <SettingsCard title="Integrations" description="Connect external services." icon={<Link2 />}>
              <div className="space-y-3">
                <Integration name="Google Workspace" status="Ready" icon={<Globe2 />} />
                <Integration name="Email delivery" status="Not connected" icon={<Mail />} />
                <Integration name="Payment provider" status="Sandbox" icon={<CreditCard />} />
                <Integration name="Object storage" status="Ready" icon={<UploadCloud />} />
              </div>
            </SettingsCard>

            <SettingsCard title="Audit Trail" description="Recent workspace changes." icon={<FileKey2 />}>
              <div className="space-y-3">
                {auditEvents.map(([actor, action, time]) => (
                  <div key={`${actor}-${time}`} className="rounded-lg border border-gray-700 bg-gray-900/45 p-3">
                    <p className="text-sm font-semibold text-white">{action}</p>
                    <p className="mt-1 text-xs text-gray-400">{actor} - {time}</p>
                  </div>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard title="Danger Zone" description="High-impact workspace actions." icon={<AlertTriangle />}>
              <div className="space-y-3">
                <button className="flex w-full items-center justify-between rounded-lg border border-gray-700 bg-gray-900/45 px-4 py-3 text-left text-sm font-semibold text-gray-200 transition hover:bg-gray-700">
                  <span>Reset demo data</span>
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button className="flex w-full items-center justify-between rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-left text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20">
                  <span>Pause workspace</span>
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
                <button className="flex w-full items-center justify-between rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-left text-sm font-semibold text-red-100 transition hover:bg-red-500/20">
                  <span>Delete workspace</span>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </SettingsCard>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ title, description, icon, children }: { title: string; description: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-300 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-5">
      <div className="flex items-center justify-between text-gray-400">
        <span className="text-sm">{label}</span>
        <span className="text-blue-300 [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-gray-300">{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({ title, description, enabled, onChange }: { title: string; description: string; enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-700 bg-gray-900/45 p-4">
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs leading-5 text-gray-400">{description}</p>
      </div>
      <button onClick={() => onChange(!enabled)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${enabled ? "bg-blue-600" : "bg-gray-600"}`} aria-pressed={enabled}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

function Integration({ name, status, icon }: { name: string; status: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-900/45 p-3">
      <div className="flex items-center gap-3">
        <span className="text-blue-300 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
        <span className="text-sm font-semibold text-white">{name}</span>
      </div>
      <span className="rounded-full bg-gray-700 px-2 py-1 text-xs font-semibold text-gray-300">{status}</span>
    </div>
  );
}
