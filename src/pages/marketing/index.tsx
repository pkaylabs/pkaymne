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
  Sparkles,
} from "lucide-react";
import { Link } from "react-location";

import logo from "@/assets/images/logo.png";
import heroImage from "@/assets/images/render.jpg";
import { DASHBOARD } from "@/constants/page-path";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const platformSteps = [
  ["Design", "Build projects, outcomes, indicators, and field forms with clear ownership.", Layers3],
  ["Collect", "Send agents into the field with assigned forms and submission tracking.", MapPinned],
  ["Compute", "Transform submissions into indicator values, statistics, and trend lines.", Gauge],
  ["Report", "Generate board-ready reports for donors, leadership, and programme teams.", FileText],
];

const featureRows = [
  ["Multi-institution SaaS", "Separate dashboards, users, permissions, plans, and data boundaries for every subscribed institution."],
  ["Indicator computation", "Define how indicators are calculated from collected evidence, then let the system recompute results automatically."],
  ["Field collection workflow", "Prepare forms centrally, assign them to teams, and track submissions as they arrive from districts and project sites."],
  ["Reporting engine", "Move from raw submissions to summaries, charts, recommendations, and exportable reports."],
];

const metrics = [
  ["94%", "submission completion"],
  ["18k", "field records monthly"],
  ["42", "active indicators"],
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative min-h-[92vh] overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/78" />
        <div className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-slate-950/45 backdrop-blur-md">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="PKay M&E" className="h-11 w-auto rounded-md bg-white p-1" />
              <span className="text-sm font-semibold tracking-wide">PKay M&E</span>
            </Link>
            <div className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
              <a href="#platform" className="transition hover:text-white">Platform</a>
              <a href="#workflow" className="transition hover:text-white">Workflow</a>
              <a href="#reports" className="transition hover:text-white">Reports</a>
              <a href="#pricing" className="transition hover:text-white">Pricing</a>
            </div>
            <Link
              to={DASHBOARD}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>

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
              <Link
                to={DASHBOARD}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400"
              >
                Explore the dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See how it works
              </a>
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
                key={title as string}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.06 }}
                className="rounded-lg border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/80"
              >
                <Icon className="h-7 w-7 text-blue-600" />
                <h3 className="mt-5 text-xl font-semibold">{title as string}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description as string}</p>
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

      <section id="pricing" className="bg-white py-16 text-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Ready for the SaaS buildout.</h2>
            <p className="mt-3 max-w-2xl text-slate-600">
              Start with the admin dashboard now. Subscriptions, billing, mobile collection, and advanced analytics can expand from the same platform foundation.
            </p>
          </div>
          <Link
            to={DASHBOARD}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
