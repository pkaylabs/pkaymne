import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  BarChart3,
  Users,
  FileText,
  CheckCircle,
  TrendingUp,
  Clock,
  Sparkles,
  Play,
  Star,
} from "lucide-react";
import FloatingBlob from "./components/FloatingBlob";
import AnimatedNumber from "./components/AnimatedNumber";
import FeatureCard from "./components/FeatureCard";
import TestimonialCarousel from "./components/TestimonialCarousel";
import DemoModal from "./components/DemoModal";
import { useInView } from "@/utils/useInView";

const EASE = { stiffness: 80, damping: 12 };

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const heroReveal = useInView("-10%");
  const featureReveal = useInView("-20%");
  const statsReveal = useInView("-10%");
  const pricingReveal = useInView("-10%");

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      priceMonthly: 0,
      priceYearly: 0,
      desc: "Basic tracking for small teams",
      features: [
        "Up to 3 projects",
        "Indicators & dashboards",
        "Basic reports",
      ],
      cta: "Start free",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      priceMonthly: 49,
      priceYearly: 480,
      desc: "Everything teams need to scale",
      features: [
        "Unlimited projects",
        "Automated reports",
        "Offline sync",
        "Priority support",
      ],
      cta: "Start 14-day trial",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      priceMonthly: 199,
      priceYearly: 1990,
      desc: "Custom solutions for organizations",
      features: ["Dedicated onboarding", "Custom integrations", "Automated reports"],
      cta: "Contact sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071022] via-[#041226] to-[#021018] text-white antialiased overflow-x-hidden">
      {/* floating decorative blobs */}
      <FloatingBlob className="-left-20 -top-20 rotate-12" delay={0.1} />
      {/* <FloatingBlob className="right-[0px] top-40 rotate-6" delay={0.5} /> */}

      <header className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
            <img
              src="/logo.png"
              alt="logo"
              className="w-full h-full rounded-sm"
            />
          </div>
          <div>
            <div className="font-bold text-lg">PkayMNE</div>
            <div className="text-xs text-gray-400">
              Monitoring • Evaluation • Insights
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <a className="hover:text-white transition" href="#features">
            Features
          </a>
          <a className="hover:text-white transition" href="#stats">
            Stats
          </a>
          <a className="hover:text-white transition" href="#why">
            Why Us
          </a>
          <a className="hover:text-white transition" href="#pricing">
            Pricing
          </a>
          <button
            onClick={() => setDemoOpen(true)}
            className="text-sm px-3 py-2 cursor-pointer rounded-md border border-gray-700 hover:bg-gray-800"
          >
            Watch demo
          </button>
          <a className="ml-2 cursor-pointer bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-95 transition">
            Get started
          </a>
        </nav>

        <div className="md:hidden">
          <button className="p-2 rounded-lg bg-gray-800 border border-gray-700">
            Menu
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              ref={heroReveal.ref as any}
              initial={{ opacity: 0, y: 12 }}
              animate={heroReveal.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.05, ...EASE, type: "spring" }}
              className="text-4xl lg:text-6xl leading-tight font-extrabold"
            >
              Turn data into impact —
              <br />
              measure, learn, and adapt faster.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={heroReveal.inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.15 }}
              className="text-gray-300 max-w-xl mt-4"
            >
              A modern Monitoring & Evaluation platform built for teams who want
              clear insights, automated reporting and better program outcomes.
              Connect indicators, track progress, and turn findings into
              decisions — faster.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 items-center mt-6"
              initial={{ opacity: 0 }}
              animate={heroReveal.inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.25 }}
            >
              <button
                onClick={() => setDemoOpen(true)}
                className="bg-primary text-white px-5 py-3 rounded-full font-semibold shadow-md flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Watch demo
              </button>

              <a
                className="px-5 py-3 rounded-full border border-gray-700 text-gray-300"
                href="#signup"
              >
                Start free trial
              </a>

              <div className="ml-2 text-sm text-gray-400">
                No card • 14-day free trial
              </div>
            </motion.div>

            {/* Stats row with reveal */}
            <motion.div
              ref={statsReveal.ref as any}
              className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={statsReveal.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700"
              >
                <div className="text-gray-400 text-sm">Active Projects</div>
                <AnimatedNumber to={1200} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={statsReveal.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 }}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700"
              >
                <div className="text-gray-400 text-sm">Beneficiaries</div>
                <AnimatedNumber to={5400} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={statsReveal.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700"
              >
                <div className="text-gray-400 text-sm">Indicators Tracked</div>
                <AnimatedNumber to={320} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={statsReveal.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 }}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700"
              >
                <div className="text-gray-400 text-sm">
                  Avg. Data Completeness
                </div>
                <AnimatedNumber to={98} suffix="%" />
              </motion.div>
            </motion.div>

            {/* micro product-tour */}
            <motion.div className="mt-6 p-4 bg-gradient-to-br from-[#051024] to-[#081426] rounded-lg border border-gray-700 flex items-center gap-4">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <div className="flex-1">
                <div className="text-sm text-gray-300">
                  New: interactive guided tour
                </div>
                <div className="text-gray-400 text-sm">
                  Click "Watch demo" to see a quick tour that highlights
                  dashboards and reports
                </div>
              </div>
              <button
                onClick={() => setDemoOpen(true)}
                className="text-sm px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              >
                Start tour
              </button>
            </motion.div>
          </div>

         
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={heroReveal.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.12 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-700 bg-gradient-to-br from-[#041226] to-[#071e33] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-400">Project</div>
                  <div className="text-xl font-bold text-white">
                    Community Health
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  Updated: Apr 14, 2024
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-800 transform-gpu hover:translate-y-[-4px] transition-transform">
                  <div className="text-xs text-gray-400">Coverage</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="text-2xl font-bold">87%</div>
                    <div className="text-xs text-gray-300">on track</div>
                  </div>
                </div>
                <div className="bg-gray-900/40 p-3 rounded-xl border border-gray-800 transform-gpu hover:translate-y-[-4px] transition-transform">
                  <div className="text-xs text-gray-400">Data Completeness</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="text-2xl font-bold">94%</div>
                    <div className="text-xs text-gray-300">complete</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs text-gray-400 mb-2">Outcome Trend</div>
                <div className="h-36 bg-gradient-to-r from-primary to-purple-600 rounded-xl p-3 relative overflow-hidden">
                  <svg
                    viewBox="0 0 100 30"
                    preserveAspectRatio="none"
                    className="w-full h-full opacity-90"
                  >
                    <polyline
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      points="0,22 12,18 24,14 36,12 48,9 60,10 72,7 84,6 96,4"
                    />
                  </svg>

                  <motion.div
                    initial={{ x: -10 }}
                    animate={{ x: 6 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 4,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-3 left-2 text-xs bg-black/40 px-2 py-1 rounded text-white"
                  >
                    +8% improvement (3 months)
                  </motion.div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-semibold">
                    JN
                  </div>
                  <div className="text-sm text-gray-300">
                    Jamal Nasir • Program Manager
                  </div>
                </div>
                <div className="text-sm text-gray-400">Last sync 2h ago</div>
              </div>
            </div>

            {/* floating quick insights */}
            <motion.div
              initial={{ x: 60, y: -20, opacity: 0 }}
              animate={{ x: 20, y: -20, opacity: 1 }}
              transition={{ delay: 0.16 }}
              className="absolute top-4 right-4 bg-gradient-to-br from-[#062033] to-[#07324a] border border-gray-700 p-3 rounded-xl shadow-lg w-44"
            >
              <div className="text-xs text-gray-400">Quick insights</div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-300">On track</div>
                  <div className="text-lg font-semibold">72%</div>
                </div>
                <div className="text-sm text-green-400 font-medium">+4%</div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Everything you need to measure impact
              </h2>
              <p className="text-gray-400 mt-2 max-w-xl">
                From indicator tracking to automated reporting and adaptive
                planning — built for program teams and donors.
              </p>
            </div>

            {/* <div className="hidden md:flex items-center gap-3 text-gray-400">
              <div className="text-xs">Integrations</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-sm">
                  DB
                </div>
                <div className="w-8 h-8 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-sm">
                  CSV
                </div>
                <div className="w-8 h-8 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-sm">
                  API
                </div>
              </div>
            </div> */}
          </div>

          <motion.div
            ref={featureReveal.ref as any}
            initial={{ opacity: 0, y: 8 }}
            animate={featureReveal.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          >
            <FeatureCard
              icon={<Target className="w-5 h-5" />}
              title="Objectives & Indicators"
              subtitle="Define objectives, attach indicators and track status across projects."
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Interactive Dashboards"
              subtitle="Beautiful charts, maps and trendlines that update in real-time."
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Automated Reports"
              subtitle="Generate executive reports, exports and shareable PDFs with one click."
            />
            <FeatureCard
              icon={<Users className="w-5 h-5" />}
              title="Roles & Workflows"
              subtitle="Manage teams, approvals and data collection flows for field staff."
            />
          </motion.div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mt-20" ref={pricingReveal.ref as any}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Pricing plan built for teams
              </h2>
              <p className="text-gray-400 mt-2 max-w-xl">
                Transparent billing — scale up as you grow. Monthly and yearly
                options available.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-300">Billing</div>
              <div className="bg-gray-800 border border-gray-700 rounded-full p-1 flex items-center">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`px-3 py-1 rounded-full cursor-pointer ${
                    billing === "monthly"
                      ? "bg-white text-black"
                      : "text-gray-300"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling("yearly")}
                  className={`px-3 py-1 rounded-full cursor-pointer ${
                    billing === "yearly"
                      ? "bg-white text-black"
                      : "text-gray-300"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className={`p-6 rounded-2xl border ${
                  plan.popular
                    ? "border-yellow-500 shadow-lg bg-gradient-to-b from-[#1a1720] to-[#0f1720]"
                    : "border-gray-700 bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-300">{plan.name}</div>
                    <div className="text-2xl font-bold mt-2 flex items-baseline gap-2">
                      {billing === "monthly" ? (
                        <>
                          <span className="text-3xl">
                            {plan.priceMonthly === 0
                              ? "Free"
                              : `GHC${plan.priceMonthly}`}
                          </span>
                          {plan.priceMonthly !== 0 && (
                            <span className="text-sm text-gray-400">/mo</span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-3xl">
                            {plan.priceYearly === 0
                              ? "Free"
                              : `GHC${plan.priceYearly}`}
                          </span>
                          {plan.priceYearly !== 0 && (
                            <span className="text-sm text-gray-400">/yr</span>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm mt-2">
                      {plan.desc}
                    </div>
                  </div>
                  {plan.popular && (
                    <div className="bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded">
                      Popular
                    </div>
                  )}
                </div>

                <ul className="mt-6 space-y-3 text-gray-200">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" /> {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  {plan.id === "enterprise" ? (
                    <button className="w-full cursor-pointer bg-transparent border border-gray-600 text-gray-200 rounded-full py-2">
                      Contact sales
                    </button>
                  ) : (
                    <button className="w-full bg-primary text-white font-semibold rounded-full py-2">
                      {plan.cta}
                    </button>
                  )}
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  {plan.id !== "enterprise"
                    ? billing === "yearly"
                      ? "Billed yearly. Cancel anytime."
                      : "Billed monthly. Cancel anytime."
                    : "Custom billing and contracts available."}
                </div>
              </motion.div>
            ))}
          </div>
          {/* pricing details / comparison */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={pricingReveal.inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.12 }}
            className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">Compare plans</div>
              <div className="text-xs text-gray-400">
                Most teams start on Pro
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-400 border-b border-gray-700">
                  <tr>
                    <th className="p-3">Feature</th>
                    <th className="p-3">Starter</th>
                    <th className="p-3">Pro</th>
                    <th className="p-3">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Projects",
                    "Automated reports",
                    "Offline sync",
                    "SAML SSO",
                    "Dedicated support",
                  ].map((f, i) => (
                    <tr
                      key={f}
                      className={`border-b border-gray-700 ${
                        i % 2 === 0 ? "bg-gray-900/20" : ""
                      }`}
                    >
                      <td className="p-3 text-gray-300">{f}</td>
                      <td className="p-3">
                        {f === "Projects"
                          ? "Up to 3"
                          : f === "Automated reports"
                            ? "Basic"
                            : f === "Offline sync"
                              ? "—"
                              : f === "SAML SSO"
                                ? "—"
                                : f === "Dedicated support"
                                  ? "Community"
                                  : ""}
                      </td>
                      <td className="p-3">
                        {f === "Projects"
                          ? "Unlimited"
                          : f === "Automated reports"
                            ? "Advanced"
                            : f === "Offline sync"
                              ? "Included"
                              : f === "SAML SSO"
                                ? "—"
                                : f === "Dedicated support"
                                  ? "Priority"
                                  : ""}
                      </td>
                      <td className="p-3">
                        {f === "Projects"
                          ? "Unlimited"
                          : f === "Automated reports"
                            ? "Advanced"
                            : f === "Offline sync"
                              ? "Included"
                              : f === "SAML SSO"
                                ? "Included"
                                : f === "Dedicated support"
                                  ? "Dedicated CSM"
                                  : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* Testimonials + CTA */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <TestimonialCarousel />
          </div>

          <div className="bg-gradient-to-br from-[#041026] to-[#071a2b] rounded-2xl p-6 border border-gray-700">
            <h4 className="text-white font-semibold">
              Start measuring impact today
            </h4>
            <p className="text-gray-300 mt-2">
              Trial, demo and enterprise plans available. Free onboarding for
              annual plans.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setDemoOpen(true)}
                className="bg-primary text-white font-semibold px-4 py-2 rounded-full flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Watch demo
              </button>
              <a
                className="px-4 py-2 rounded-full border border-gray-700 text-gray-300"
                href="#signup"
              >
                Start free trial
              </a>
            </div>

            <div className="mt-6 text-sm text-gray-400">Popular features</div>
            <ul className="mt-3 space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" /> Automated reporting
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> Offline data sync
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> Real-time
                alerts
              </li>
            </ul>
          </div>
        </section>

        {/* WHY US / TRUST */}
        <section
          id="why"
          className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center"
        >
          <div className="lg:col-span-2 bg-gradient-to-br from-[#041026] to-[#071a2b] rounded-2xl p-8 border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold">
              Trusted by programs around the world
            </h3>
            <p className="text-gray-300 mt-2 max-w-2xl">
              We help NGOs and public-sector partners reduce reporting time and
              improve decision-making by turning raw data into clear, actionable
              insights.
            </p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Ishowspeed Foundation",
                "Kai Cenat Foundation",
                "Mr.Beast Foundation",
                "Adin Ross Foundation",
              ].map((n) => (
                <div
                  key={n}
                  className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 text-sm text-gray-300"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h4 className="text-white font-semibold">
              Why teams switch to PkayMNE
            </h4>
            <ul className="mt-4 space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /> Faster
                reporting cycles
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" /> Better
                program outcomes via insights
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-400 mt-0.5" /> Sync
                offline & field data
              </li>
            </ul>
          </div>
        </section>

        {/* FOOTER + small signup */}
        <footer className="mt-16 text-gray-400">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-800">
            <div>
              <div className="font-bold text-white">PkayMNE</div>
              <div className="text-sm mt-2">
                Monitoring, evaluation and learning tools for effective
                programs.
              </div>
            </div>

            <div className="flex gap-6">
              <div>
                <div className="font-semibold text-white">Product</div>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>Dashboards</li>
                  <li>Reporting</li>
                  <li>Integrations</li>
                </ul>
              </div>

              <div>
                <div className="font-semibold text-white">Company</div>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>About</li>
                  <li>Careers</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="font-semibold text-white">Subscribe</div>
              <p className="text-sm text-gray-300 mt-2">
                Get product updates, new templates and events.
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  aria-label="email"
                  placeholder="nasir@company.org"
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-full"
                />
                <button className="bg-primary px-4 py-2 rounded-lg font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 text-sm text-gray-500 flex items-center justify-between">
            <div>© {new Date().getFullYear()} PkayMNE • Built with care</div>
            <div className="flex gap-4">Privacy • Terms</div>
          </div>
        </footer>
      </main>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
