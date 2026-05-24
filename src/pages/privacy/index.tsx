import { Database, Eye, FileLock2, KeyRound, Scale, ShieldCheck, UserCheck } from "lucide-react";
import { useState } from "react";

import AuthModals from "@/components/public/AuthModals";
import SiteFooter from "@/components/public/SiteFooter";
import SiteNav from "@/components/public/SiteNav";

type AuthMode = "login" | "signup";

const sections = [
  ["Data we process", "Account, institution, project, indicator, form, submission, usage, device, and support information required to operate the platform.", Database],
  ["How data is used", "To provide dashboards, compute indicators, generate reports, maintain security, support users, and improve service reliability.", Eye],
  ["Protection controls", "Tenant isolation, role-based access, secure authentication, audit-oriented records, encrypted transport, and limited operational access.", ShieldCheck],
  ["User rights", "Institutions can request exports, correction, deletion where lawful, access review, and retention configuration according to agreement terms.", UserCheck],
  ["Retention", "Project and submission records are retained according to subscription settings, contractual requirements, legal obligations, and backup windows.", FileLock2],
  ["Compliance posture", "The platform is designed to support responsible data governance, procurement review, and documented data-processing arrangements.", Scale],
] as const;

export default function PrivacyPage() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 pb-20 pt-32 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.28),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(59,130,246,0.24),transparent_32%)]" />
        <SiteNav onLogin={() => setAuthMode("login")} onSignup={() => setAuthMode("signup")} />
        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-emerald-300">Privacy and data safety</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight">Data protection for institutions that handle sensitive evidence.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              This page describes the principles PKay M&E uses to protect institution, project, user, and field submission data across the SaaS platform.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sections.map(([title, body, Icon]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Icon className="h-7 w-7 text-blue-600" />
                <h2 className="mt-5 text-xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <aside className="rounded-2xl bg-slate-100 p-6">
              <KeyRound className="h-8 w-8 text-slate-950" />
              <h2 className="mt-5 text-2xl font-bold">Our privacy commitments</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                PKay M&E is designed around least privilege, tenant separation, operational transparency, and responsible retention.
              </p>
            </aside>
            <div className="space-y-8 text-slate-700">
              <PolicyBlock title="1. Institution ownership">
                Institutions remain responsible for their programme content, indicators, forms, submissions, and reports. PKay M&E acts as a platform provider and processes data to deliver the subscribed service.
              </PolicyBlock>
              <PolicyBlock title="2. Field submission safety">
                Field data may include location, attachments, survey responses, and project evidence. The platform should only collect fields configured by authorized institution users, and access should be limited by role.
              </PolicyBlock>
              <PolicyBlock title="3. Access control">
                User accounts, roles, and organization boundaries are used to restrict access. Administrative users should regularly review team membership, inactive accounts, and permission assignments.
              </PolicyBlock>
              <PolicyBlock title="4. Data exports and deletion">
                Authorized institutions may request exports or deletion according to subscription terms, legal requirements, backup retention, and legitimate operational constraints.
              </PolicyBlock>
              <PolicyBlock title="5. Security operations">
                Logs, diagnostics, and support records may be processed to maintain uptime, investigate incidents, prevent misuse, and improve system reliability.
              </PolicyBlock>
              <PolicyBlock title="6. Changes">
                This policy will evolve as the SaaS platform matures. Material changes should be communicated through the website, dashboard notices, or direct institution communication.
              </PolicyBlock>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <AuthModals mode={authMode} onClose={() => setAuthMode(null)} onSwitch={setAuthMode} />
    </main>
  );
}

function PolicyBlock({ title, children }: { title: string; children: string }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 leading-7">{children}</p>
    </section>
  );
}
