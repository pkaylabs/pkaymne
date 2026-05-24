import { ArrowRight, BarChart3, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-location";

import logo from "@/assets/images/logo.png";
import { CONTACT, DASHBOARD, HOME, PRIVACY } from "@/constants/page-path";

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <Link to={HOME} className="flex items-center gap-3">
            <img src={logo} alt="PKay M&E" className="h-12 w-auto rounded-md bg-white p-1" />
            <span className="font-semibold">PKay M&E</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
            A SaaS platform for monitoring, evaluation, field data collection, indicator computation, and stakeholder reporting.
          </p>
          <Link
            to={DASHBOARD}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            Open dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div>
          <h3 className="font-semibold">Platform</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <a href="/#platform" className="block transition hover:text-white">Overview</a>
            <a href="/#workflow" className="block transition hover:text-white">Workflow</a>
            <a href="/#reports" className="block transition hover:text-white">Reports</a>
            <a href="/#pricing" className="block transition hover:text-white">Pricing</a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Company</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <Link to={CONTACT} className="block transition hover:text-white">Contact us</Link>
            <Link to={PRIVACY} className="block transition hover:text-white">Privacy policy</Link>
            <Link to={DASHBOARD} className="block transition hover:text-white">Customer login</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p className="flex gap-2"><Mail className="h-4 w-4 text-blue-300" /> hello@pkaymne.com</p>
            <p className="flex gap-2"><Phone className="h-4 w-4 text-blue-300" /> +233 000 000 000</p>
            <p className="flex gap-2"><MapPin className="h-4 w-4 text-blue-300" /> Accra, Ghana</p>
            <p className="flex gap-2"><BarChart3 className="h-4 w-4 text-blue-300" /> Built for evidence teams</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>Copyright © {new Date().getFullYear()} PKay Software Consultancy. All rights reserved.</p>
          <p>Security, privacy, and data protection by design.</p>
        </div>
      </div>
    </footer>
  );
}
