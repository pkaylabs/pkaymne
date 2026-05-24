import { ArrowRight } from "lucide-react";
import { Link } from "react-location";

import logo from "@/assets/images/logo.png";
import { CONTACT, HOME, PRIVACY } from "@/constants/page-path";

type SiteNavProps = {
  onLogin: () => void;
  onSignup: () => void;
};

export default function SiteNav({ onLogin, onSignup }: SiteNavProps) {
  return (
    <div className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-slate-950/45 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to={HOME} className="flex items-center gap-3">
          <img src={logo} alt="PKay M&E" className="h-11 w-auto rounded-md bg-white p-1" />
          <span className="text-sm font-semibold tracking-wide text-white">PKay M&E</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
          <a href="/#platform" className="transition hover:text-white">Platform</a>
          <a href="/#workflow" className="transition hover:text-white">Workflow</a>
          <a href="/#reports" className="transition hover:text-white">Reports</a>
          <a href="/#pricing" className="transition hover:text-white">Pricing</a>
          <Link to={CONTACT} className="transition hover:text-white">Contact</Link>
          <Link to={PRIVACY} className="transition hover:text-white">Privacy</Link>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onLogin} className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 sm:block">
            Login
          </button>
          <button
            onClick={onSignup}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
          >
            Start trial
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </div>
  );
}
