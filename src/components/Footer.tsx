import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#06080c]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            Live Better. Every Day. The smart step & GPS activity tracker for a
            healthier you.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Product</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li><Link href="/tracker" className="hover:text-mint">Step Tracker</Link></li>
            <li><Link href="/dashboard" className="hover:text-mint">Dashboard</Link></li>
            <li><Link href="/pricing" className="hover:text-mint">Pricing</Link></li>
            <li><Link href="/signup" className="hover:text-mint">Get Started</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Compare</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li><Link href="/compare" className="hover:text-mint">All Comparisons</Link></li>
            <li><Link href="/compare/vytora-vs-strava" className="hover:text-mint">Vytora vs Strava</Link></li>
            <li><Link href="/compare/vytora-vs-fitbit" className="hover:text-mint">Vytora vs Fitbit</Link></li>
            <li><Link href="/best/step-tracking-apps" className="hover:text-mint">Best Step Apps</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Company</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li><Link href="/best/running-apps" className="hover:text-mint">Best Running Apps</Link></li>
            <li><Link href="/best/walking-apps" className="hover:text-mint">Best Walking Apps</Link></li>
            <li><Link href="/login" className="hover:text-mint">Log in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-6">
        <p className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Vytora. Live Better. Every Day.
        </p>
      </div>
    </footer>
  );
}
