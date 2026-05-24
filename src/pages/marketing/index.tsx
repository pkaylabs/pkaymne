import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gauge,
  Layers3,
  LockKeyhole,
  MapPinned,
  RadioTower,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-location";

import AuthModals from "@/components/public/AuthModals";
import HeroScene from "@/components/public/HeroScene";
import SiteFooter from "@/components/public/SiteFooter";
import SiteNav from "@/components/public/SiteNav";
import { CONTACT, DASHBOARD } from "@/constants/page-path";

type AuthMode = "login" | "signup";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const platformSteps = [
  ["Design", "Build projects, outcomes, indicators, and field forms with clear ownership.", Layers3],
  ["Collect", "Send agents into the field with assigned forms and submission tracking.", MapPinned],
  ["Compute", "Transform submissions into indicator values, statistics, and trend lines.", Gauge],
  ["Report", "Generate board-ready reports for donors, leadership, and programme teams.", FileText],
] as const;

const featureRows = [
  ["Multi-institution SaaS", "Separate dashboards, users, permissions, plans, and data boundaries for every subscribed institution."],
  ["Indicator computation", "Define how indicators are calculated from collected evidence, then let the system recompute results automatically."],
  ["Field collection workflow", "Prepare forms centrally, assign them to teams, and track submissions as they arrive from districts and project sites."],
  ["Reporting engine", "Move from raw submissions to summaries, charts, recommendations, and exportable reports."],
] as const;

const metrics = [
  ["94%", "submission completion"],
  ["18k", "field records monthly"],
  ["42", "active indicators"],
] as const;

const pricingPlans = [
  {
    name: "Starter",
    price: "$149",
    period: "/month",
    summary: "For small teams formalizing project and indicator tracking.",
    limits: ["3 active projects", "25 indicators", "10 users", "2,000 submissions/month"],
    features: ["Project and outcome workspace", "Form builder", "Dashboard analytics", "PDF and spreadsheet exports", "Email support"],
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$399",
    period: "/month",
    summary: "For growing agencies managing multiple programmes and departments.",
    limits: ["15 active projects", "250 indicators", "50 users", "25,000 submissions/month"],
    features: ["Everything in Starter", "Advanced reporting", "Role-based access", "Field assignment workflows", "Priority support"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    summary: "For national programmes, donor portfolios, and complex institutional deployments.",
    limits: ["Unlimited projects", "Custom indicator volume", "Unlimited users", "Custom submission volume"],
    features: ["Everything in Professional", "Dedicated success manager", "Custom data retention", "SSO and advanced security", "Deployment advisory"],
    highlighted: false,
  },
] as const;

const pricingAssurances = [
  [UsersRound, "Implementation support", "Workspace setup, indicator migration guidance, and team onboarding."],
  [ShieldCheck, "Data safety", "Tenant isolation, role permissions, audit-oriented workflows, and export controls."],
  [Gauge, "Flexible growth", "Upgrade plans as your project portfolio, submissions, and reporting needs expand."],
] as const;

export default function MarketingPage() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative min-h-[92vh] overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(14,165,233,0.22),transparent_28%),linear-gradient(90deg,rgba(2,6,23,0.96),rgba(15,23,42,0.74),rgba(2,6,23,0.88))]" />
        <SiteNav onLogin={() => setAuthMode("login")} onSignup={() => setAuthMode("signup")} />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pb-20 pt-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-100 backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-300" />
              Built for institutions that need evidence, not spreadsheet chaos
            </div>
            <h1 className="text-5xl font-bold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              Monitoring and evaluation command center
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Plan projects, define indicators, collect field data, compute performance, and publish reports from one modern SaaS workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setAuthMode("signup")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400"
              >
                Start subscription
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setAuthMode("login")}
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Login
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {metrics.map(([value, label]) => (
              <div key={label} className="border-l border-white/20 py-2 pl-4">
                <p className="text-3xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-sm text-slate-300">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="platform" className="bg-white py-20 text-slate-950">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-blue-600">Platform</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">A complete operating system for M&E teams.</h2>
            </div>
            <p className="text-lg leading-8 text-slate-600">
              PKay M&E connects programme design, field evidence, computation, and reporting so agencies can spend less time reconciling files and more time improving outcomes.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {platformSteps.map(([title, description, Icon], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.06 }}
                className="rounded-lg border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/80"
              >
                <Icon className="h-7 w-7 text-blue-600" />
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-slate-100 py-20 text-slate-950">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">Workflow</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">From project framework to evidence-backed decisions.</h2>
            <div className="mt-8 space-y-5">
              {featureRows.map(([title, description]) => (
                <div key={title} className="flex gap-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/60">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm text-slate-500">Live programme view</p>
                <h3 className="text-xl font-semibold">Industrial Transformation</h3>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">On track</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[["Projects", "12"], ["Indicators", "84"], ["Reports", "31"]].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-100 p-4">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {["Manufacturing value-added share", "Youth employment rate", "Non-extractive export earnings"].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                  <div className="h-2 w-24 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${72 + index * 8}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="reports" className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-amber-300">Reports</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">Give every stakeholder the right view of progress.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Create programme summaries, indicator performance reports, collection status briefs, and export-ready narratives from live project data.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[ClipboardCheck, RadioTower, LockKeyhole].map((Icon, index) => (
              <div key={index} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                <Icon className="h-7 w-7 text-amber-300" />
                <h3 className="mt-5 text-xl font-semibold">
                  {["Submission assurance", "Realtime visibility", "Tenant-grade security"][index]}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {[
                    "Validate incoming field data against the exact form version used during collection.",
                    "Track project health, reporting progress, and collection activity as work happens.",
                    "Keep each institution's users, data, permissions, and reports cleanly separated.",
                  ][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-white py-24 text-slate-950">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-blue-600">Pricing</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight">Subscription plans for every M&E operation.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Start with a focused workspace, scale into multi-programme operations, or configure enterprise controls for national and donor-funded portfolios.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  plan.highlighted ? "border-blue-500 bg-slate-950 text-white" : "border-slate-200 bg-white"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute right-5 top-5 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-slate-950">
                    Recommended
                  </span>
                )}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className={`mt-3 text-sm leading-6 ${plan.highlighted ? "text-slate-300" : "text-slate-600"}`}>{plan.summary}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={plan.highlighted ? "text-slate-300" : "text-slate-500"}>{plan.period}</span>
                </div>
                <button
                  onClick={() => setAuthMode("signup")}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    plan.highlighted ? "bg-blue-500 text-white hover:bg-blue-400" : "bg-slate-950 text-white hover:bg-blue-600"
                  }`}
                >
                  Select {plan.name}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="mt-6 border-t border-slate-200/20 pt-6">
                  <p className="text-sm font-semibold">Included limits</p>
                  <div className="mt-3 space-y-2">
                    {plan.limits.map((limit) => (
                      <p key={limit} className={`flex gap-2 text-sm ${plan.highlighted ? "text-slate-200" : "text-slate-700"}`}>
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        {limit}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-semibold">Core features</p>
                  <div className="mt-3 space-y-2">
                    {plan.features.map((feature) => (
                      <p key={feature} className={`flex gap-2 text-sm ${plan.highlighted ? "text-slate-200" : "text-slate-700"}`}>
                        <ShieldCheck className="h-4 w-4 shrink-0 text-blue-500" />
                        {feature}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:grid-cols-3">
            {pricingAssurances.map(([Icon, title, body]) => (
              <div key={title} className="flex gap-3">
                <Icon className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-950 p-6 text-white md:flex-row">
            <div>
              <h3 className="text-2xl font-bold">Need procurement review or a custom institutional plan?</h3>
              <p className="mt-2 text-sm text-slate-300">Talk to us about compliance, deployment models, data retention, and reporting requirements.</p>
            </div>
            <Link to={CONTACT} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200">
              Contact sales
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
      <AuthModals mode={authMode} onClose={() => setAuthMode(null)} onSwitch={setAuthMode} />
    </main>
  );
}
