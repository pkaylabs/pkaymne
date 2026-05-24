import { Mail, MapPin, MessageSquare, Phone, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";

import AuthModals from "@/components/public/AuthModals";
import SiteFooter from "@/components/public/SiteFooter";
import SiteNav from "@/components/public/SiteNav";

type AuthMode = "login" | "signup";

const contactCards = [
  ["Email", "hello@pkaymne.com", Mail],
  ["Phone", "+233 000 000 000", Phone],
  ["Office", "Accra, Ghana", MapPin],
] as const;

export default function ContactPage() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 pb-20 pt-32 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(59,130,246,0.28),transparent_35%),radial-gradient(circle_at_80%_35%,rgba(16,185,129,0.22),transparent_26%)]" />
        <SiteNav onLogin={() => setAuthMode("login")} onSignup={() => setAuthMode("signup")} />
        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-blue-300">Contact us</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight">Talk to us about your M&E platform needs.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Whether you are running donor-funded projects, public sector programmes, or institutional performance frameworks, we can help you shape the right SaaS workspace.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-bold">How can we help?</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Send a message about subscriptions, implementation support, compliance requirements, integrations, or data migration from existing spreadsheets and tools.
            </p>
            <div className="mt-8 grid gap-4">
              {contactCards.map(([title, value, Icon]) => (
                <div key={title} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{title}</p>
                    <p className="font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-slate-100 p-6">
              <ShieldCheck className="h-7 w-7 text-emerald-600" />
              <h3 className="mt-4 font-semibold">Data-sensitive conversations welcome</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                We can discuss tenant isolation, retention, backups, access control, procurement, and data protection expectations before onboarding.
              </p>
            </div>
          </div>

          <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Send a message</h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Full name</span>
                <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="Your name" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Work email</span>
                <input type="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="you@institution.org" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Institution</span>
                <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="Organization name" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Topic</span>
                <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500">
                  <option>Subscription and pricing</option>
                  <option>Implementation support</option>
                  <option>Data protection and security</option>
                  <option>Partnership or procurement</option>
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Message</span>
                <textarea className="mt-2 min-h-36 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="Tell us about your projects, users, indicators, reporting needs, and timelines." />
              </label>
            </div>
            <button type="button" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600">
              Submit inquiry
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
      <AuthModals mode={authMode} onClose={() => setAuthMode(null)} onSwitch={setAuthMode} />
    </main>
  );
}
