import {
  AlertTriangle,
  Building2,
  CreditCard,
  Download,
  Edit3,
  Eye,
  Package,
  Plus,
  Receipt,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-location";
import { SYSTEM } from "@/constants/page-path";

type Section = "overview" | "packages" | "subscriptions" | "transactions" | "companies";
type PackageStatus = "Active" | "Draft" | "Retired";
type SubscriptionStatus = "Active" | "Trial" | "Past Due" | "Cancelled";
type CompanyStatus = "Active" | "Trial" | "Suspended";
type TransactionStatus = "Paid" | "Pending" | "Failed" | "Refunded";

const packages = [
  { id: 1, name: "Starter", price: "$99", cadence: "monthly", projects: 3, indicators: 25, users: 10, submissions: "2,000", status: "Active" as PackageStatus },
  { id: 2, name: "Growth", price: "$299", cadence: "monthly", projects: 15, indicators: 250, users: 50, submissions: "25,000", status: "Active" as PackageStatus },
  { id: 3, name: "Enterprise", price: "Custom", cadence: "annual", projects: 999, indicators: 9999, users: 999, submissions: "Custom", status: "Active" as PackageStatus },
  { id: 4, name: "Legacy NGO", price: "$149", cadence: "monthly", projects: 8, indicators: 80, users: 25, submissions: "8,000", status: "Retired" as PackageStatus },
];

const companies = [
  { id: 1, name: "PKay Monitoring and Evaluation Agency", plan: "Growth", status: "Active" as CompanyStatus, users: 37, projects: 12, country: "Ghana", joined: "Jan 12, 2026" },
  { id: 2, name: "District Development Observatory", plan: "Starter", status: "Trial" as CompanyStatus, users: 8, projects: 2, country: "Ghana", joined: "May 10, 2026" },
  { id: 3, name: "Regional Health Evaluation Unit", plan: "Enterprise", status: "Active" as CompanyStatus, users: 124, projects: 31, country: "Kenya", joined: "Mar 03, 2026" },
  { id: 4, name: "Civic Data Lab", plan: "Growth", status: "Suspended" as CompanyStatus, users: 19, projects: 6, country: "Nigeria", joined: "Feb 18, 2026" },
];

type PackageItem = (typeof packages)[number];
type CompanyItem = (typeof companies)[number];

const subscriptions = [
  { id: "SUB-1024", company: "PKay Monitoring and Evaluation Agency", plan: "Growth", amount: "$299", status: "Active" as SubscriptionStatus, renewal: "Dec 31, 2026", seats: "37 / 50" },
  { id: "SUB-1025", company: "District Development Observatory", plan: "Starter", amount: "$99", status: "Trial" as SubscriptionStatus, renewal: "Jun 10, 2026", seats: "8 / 10" },
  { id: "SUB-1017", company: "Regional Health Evaluation Unit", plan: "Enterprise", amount: "$18,000", status: "Active" as SubscriptionStatus, renewal: "Mar 03, 2027", seats: "124 / Custom" },
  { id: "SUB-1009", company: "Civic Data Lab", plan: "Growth", amount: "$299", status: "Past Due" as SubscriptionStatus, renewal: "May 14, 2026", seats: "19 / 50" },
];

const transactions = [
  { id: "TXN-88421", company: "PKay Monitoring and Evaluation Agency", amount: "$299", method: "Card", status: "Paid" as TransactionStatus, date: "May 22, 2026" },
  { id: "TXN-88420", company: "Regional Health Evaluation Unit", amount: "$18,000", method: "Bank transfer", status: "Paid" as TransactionStatus, date: "May 20, 2026" },
  { id: "TXN-88418", company: "Civic Data Lab", amount: "$299", method: "Card", status: "Failed" as TransactionStatus, date: "May 14, 2026" },
  { id: "TXN-88411", company: "District Development Observatory", amount: "$0", method: "Trial", status: "Pending" as TransactionStatus, date: "May 10, 2026" },
];

const tabs: Array<{ key: Section; label: string; icon: React.ElementType }> = [
  { key: "overview", label: "Overview", icon: ShieldCheck },
  { key: "packages", label: "Packages", icon: Package },
  { key: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { key: "transactions", label: "Transactions", icon: Receipt },
  { key: "companies", label: "Companies", icon: Building2 },
];

const emptyPackage = {
  name: "",
  price: "",
  cadence: "monthly",
  projects: 1,
  indicators: 10,
  users: 5,
  submissions: "1,000",
  status: "Draft" as PackageStatus,
};

export default function SystemPage() {
  const section = getSection(useLocation().current.pathname);
  const [query, setQuery] = useState("");
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [packageForm, setPackageForm] = useState(emptyPackage);
  const [localPackages, setLocalPackages] = useState(packages);

  const filteredCompanies = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return companies.filter((company) => !needle || company.name.toLowerCase().includes(needle) || company.plan.toLowerCase().includes(needle) || company.country.toLowerCase().includes(needle));
  }, [query]);

  const addPackage = () => {
    if (!packageForm.name.trim()) return;
    setLocalPackages((items) => [...items, { ...packageForm, id: Math.max(0, ...items.map((item) => item.id)) + 1 }]);
    setPackageForm(emptyPackage);
    setPackageModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 pb-24">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-300">Super User</p>
            <h1 className="mt-2 text-3xl font-bold text-white">System Management</h1>
            <p className="mt-2 max-w-3xl text-gray-400">Manage SaaS packages, subscriptions, companies, and payment activity across the platform.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-800">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button onClick={() => setPackageModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Package
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Companies" value={companies.length} icon={<Building2 />} />
          <Metric label="MRR" value="$21.4k" icon={<TrendingUp />} />
          <Metric label="Active subscriptions" value={subscriptions.filter((item) => item.status === "Active").length} icon={<CreditCard />} />
          <Metric label="Failed payments" value={transactions.filter((item) => item.status === "Failed").length} icon={<AlertTriangle />} />
        </div>

        <div className="flex flex-wrap gap-2 rounded-lg border border-gray-700 bg-gray-800 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link key={tab.key} to={`${SYSTEM}${tab.key === "overview" ? "" : `/${tab.key}`}`} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${section === tab.key ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}>
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>

        {section === "overview" && <Overview />}
        {section === "packages" && <Packages items={localPackages} onCreate={() => setPackageModalOpen(true)} />}
        {section === "subscriptions" && <Subscriptions />}
        {section === "transactions" && <Transactions />}
        {section === "companies" && <Companies query={query} setQuery={setQuery} companies={filteredCompanies} />}
      </div>

      {packageModalOpen && (
        <div onClick={() => setPackageModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div onClick={(event) => event.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between border-b border-slate-700 px-6 py-5">
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Create subscription package</h2>
                  <p className="mt-1 text-sm text-slate-400">Define commercial limits that companies can subscribe to.</p>
                </div>
              </div>
              <button onClick={() => setPackageModalOpen(false)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" aria-label="Close package form">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
              <Field label="Package name">
                <input value={packageForm.name} onChange={(event) => setPackageForm({ ...packageForm, name: event.target.value })} className="input-dark h-11" placeholder="Professional" />
              </Field>
              <Field label="Price">
                <input value={packageForm.price} onChange={(event) => setPackageForm({ ...packageForm, price: event.target.value })} className="input-dark h-11" placeholder="$499" />
              </Field>
              <Field label="Billing cadence">
                <select value={packageForm.cadence} onChange={(event) => setPackageForm({ ...packageForm, cadence: event.target.value })} className="input-dark h-11">
                  <option>monthly</option>
                  <option>annual</option>
                  <option>custom</option>
                </select>
              </Field>
              <Field label="Status">
                <select value={packageForm.status} onChange={(event) => setPackageForm({ ...packageForm, status: event.target.value as PackageStatus })} className="input-dark h-11">
                  <option>Draft</option>
                  <option>Active</option>
                  <option>Retired</option>
                </select>
              </Field>
              <Field label="Projects">
                <input type="number" value={packageForm.projects} onChange={(event) => setPackageForm({ ...packageForm, projects: Number(event.target.value) || 1 })} className="input-dark h-11" />
              </Field>
              <Field label="Indicators">
                <input type="number" value={packageForm.indicators} onChange={(event) => setPackageForm({ ...packageForm, indicators: Number(event.target.value) || 1 })} className="input-dark h-11" />
              </Field>
              <Field label="Users">
                <input type="number" value={packageForm.users} onChange={(event) => setPackageForm({ ...packageForm, users: Number(event.target.value) || 1 })} className="input-dark h-11" />
              </Field>
              <Field label="Submissions / month">
                <input value={packageForm.submissions} onChange={(event) => setPackageForm({ ...packageForm, submissions: event.target.value })} className="input-dark h-11" />
              </Field>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-700 bg-slate-950/45 px-6 py-5">
              <button onClick={() => setPackageModalOpen(false)} className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">Cancel</button>
              <button onClick={addPackage} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500">Create Package</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Overview() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-gray-700 bg-gray-800 p-5">
        <h2 className="text-lg font-semibold text-white">Platform health</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["Tenant growth", "+18%", "New companies this quarter"],
            ["Payment success", "96.4%", "Across recent transactions"],
            ["Trial conversion", "42%", "Starter and Growth plans"],
          ].map(([label, value, hint]) => (
            <div key={label} className="rounded-lg border border-gray-700 bg-gray-900/45 p-4">
              <p className="text-sm text-gray-400">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-xs text-gray-500">{hint}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-gray-700 bg-gray-900/45 p-4">
          <h3 className="font-semibold text-white">Revenue trend</h3>
          <div className="mt-4 flex h-40 items-end gap-3">
            {[48, 62, 58, 72, 85, 79, 96].map((height, index) => (
              <div key={index} className="flex h-full flex-1 flex-col justify-end gap-2">
                <div className="min-h-4 w-full rounded-t bg-gradient-to-t from-blue-600 to-cyan-300" style={{ height: `${height}%` }} />
                <span className="text-xs text-gray-500">M{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <aside className="space-y-6">
        <Panel title="Operational alerts">
          {["1 past-due subscription needs follow-up", "2 trial companies expire this week", "Enterprise renewal due in 10 months"].map((item) => (
            <div key={item} className="rounded-lg border border-gray-700 bg-gray-900/45 p-3 text-sm text-gray-300">{item}</div>
          ))}
        </Panel>
        <Panel title="Quick actions">
          {["Create package", "Review failed transactions", "Export companies", "Open audit log"].map((item) => (
            <button key={item} className="w-full rounded-lg border border-gray-700 bg-gray-900/45 px-4 py-3 text-left text-sm font-semibold text-gray-200 transition hover:bg-gray-700">{item}</button>
          ))}
        </Panel>
      </aside>
    </div>
  );
}

function Packages({ items, onCreate }: { items: PackageItem[]; onCreate: () => void }) {
  return (
    <section className="rounded-lg border border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-white">Subscription packages</h2>
        <button onClick={onCreate} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"><Plus className="h-4 w-4" />New package</button>
      </div>
      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-700 bg-gray-900/45 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{item.price} / {item.cadence}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="mt-5 grid grid-cols-4 gap-3 text-sm">
              <Limit label="Projects" value={item.projects} />
              <Limit label="Indicators" value={item.indicators} />
              <Limit label="Users" value={item.users} />
              <Limit label="Submissions" value={item.submissions} />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button className="rounded-lg border border-gray-700 p-2 text-gray-300 transition hover:bg-gray-700" aria-label={`View ${item.name}`}><Eye className="h-4 w-4" /></button>
              <button className="rounded-lg border border-gray-700 p-2 text-gray-300 transition hover:bg-gray-700" aria-label={`Edit ${item.name}`}><Edit3 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Subscriptions() {
  return <DataTable title="Subscriptions" columns={["Subscription", "Company", "Plan", "Amount", "Status", "Renewal", "Seats"]} rows={subscriptions.map((item) => [item.id, item.company, item.plan, item.amount, item.status, item.renewal, item.seats])} />;
}

function Transactions() {
  return <DataTable title="Transactions" columns={["Transaction", "Company", "Amount", "Method", "Status", "Date"]} rows={transactions.map((item) => [item.id, item.company, item.amount, item.method, item.status, item.date])} />;
}

function Companies({ query, setQuery, companies }: { query: string; setQuery: (value: string) => void; companies: CompanyItem[] }) {
  return (
    <section className="rounded-lg border border-gray-700 bg-gray-800">
      <div className="grid gap-3 border-b border-gray-700 p-5 lg:grid-cols-[1fr_220px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-9 pr-3 text-sm text-white outline-none transition focus:border-blue-500" placeholder="Search companies, plans, countries" />
        </label>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"><SlidersHorizontal className="h-4 w-4" />Advanced filters</button>
      </div>
      <div className="p-3">
        <table className="w-full table-fixed text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
            <tr><th className="w-[30%] p-3">Company</th><th className="p-3">Plan</th><th className="p-3">Status</th><th className="p-3">Users</th><th className="p-3">Projects</th><th className="p-3">Country</th><th className="p-3">Joined</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {companies.map((company) => (
              <tr key={company.id} className="text-gray-300 transition hover:bg-gray-700/35">
                <td className="p-3 font-semibold text-white">{company.name}</td>
                <td className="p-3">{company.plan}</td>
                <td className="p-3"><StatusBadge status={company.status} /></td>
                <td className="p-3">{company.users}</td>
                <td className="p-3">{company.projects}</td>
                <td className="p-3">{company.country}</td>
                <td className="p-3">{company.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DataTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <section className="rounded-lg border border-gray-700 bg-gray-800">
      <div className="border-b border-gray-700 p-5"><h2 className="text-lg font-semibold text-white">{title}</h2></div>
      <div className="overflow-x-auto p-3">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>{columns.map((column) => <th key={column} className="p-3">{column}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {rows.map((row) => (
              <tr key={row.join("-")} className="text-gray-300 transition hover:bg-gray-700/35">
                {row.map((cell, index) => <td key={`${cell}-${index}`} className={`p-3 ${index === 0 ? "font-semibold text-white" : ""}`}>{isStatus(cell) ? <StatusBadge status={cell} /> : cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
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

function Limit({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border border-gray-700 bg-gray-800/70 p-3"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 font-semibold text-white">{value}</p></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-200">{label}</span>{children}</label>;
}

function StatusBadge({ status }: { status: string }) {
  const tone = status === "Active" || status === "Paid" ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200" : status === "Trial" || status === "Pending" || status === "Draft" ? "border-amber-500/40 bg-amber-500/10 text-amber-200" : status === "Failed" || status === "Past Due" || status === "Suspended" ? "border-red-500/40 bg-red-500/10 text-red-200" : "border-gray-500/40 bg-gray-500/10 text-gray-200";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}

function isStatus(value: string) {
  return ["Active", "Paid", "Trial", "Pending", "Draft", "Failed", "Past Due", "Suspended", "Cancelled", "Retired", "Refunded"].includes(value);
}

function getSection(pathname: string): Section {
  const last = pathname.split("/").filter(Boolean).at(-1);
  return last && ["packages", "subscriptions", "transactions", "companies"].includes(last) ? (last as Section) : "overview";
}
