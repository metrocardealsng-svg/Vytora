"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";

type Me = { id: string; email: string; name: string; plan: string };

const PRIMARY_LINKS = [
  { href: "/tracker", label: "Track" },
  { href: "/tribe", label: "Tribe" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
];

const MORE_LINKS = [
  { href: "/challenges", label: "Challenges" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/sleep", label: "Sleep" },
  { href: "/calisthenics", label: "Calisthenics" },
  { href: "/tips", label: "Tips" },
  { href: "/compare", label: "Compare" },
];

export default function Navbar() {
  const [user, setUser] = useState<Me | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (active) { setUser(d.user); setLoaded(true); } })
      .catch(() => setLoaded(true));
    return () => { active = false; };
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06080c]/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <Logo />

        {/* Desktop primary links */}
        <div className="hidden md:flex items-center gap-1">
          {PRIMARY_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                pathname === l.href ? "text-mint" : "text-slate-300 hover:text-white"
              }`}>
              {l.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((o) => !o)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                moreOpen ? "text-mint" : "text-slate-300 hover:text-white"
              }`}
            >
              More
              <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {moreOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-2xl bg-[#0e1118] p-2 ring-1 ring-white/10 shadow-xl">
                {MORE_LINKS.map((l) => (
                  <Link key={l.href} href={l.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      pathname === l.href ? "text-mint bg-mint/10" : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {loaded && user ? (
            <>
              <Link href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-mint to-teal flex items-center justify-center text-[10px] font-black text-ink">
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
                Dashboard
              </Link>
              <button onClick={logout} className="text-sm text-slate-500 hover:text-white transition-colors">
                Sign out
              </button>
            </>
          ) : loaded ? (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/signup"
                className="rounded-xl bg-gradient-to-r from-mint to-teal px-5 py-2.5 text-sm font-black text-ink hover:opacity-90 transition-opacity">
                Start free
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-white md:hidden"
          aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <path d="M6 6l12 12M6 18L18 6" />
              : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-[#0a0d14] md:hidden">
          <div className="mx-auto max-w-7xl px-5 py-4">
            {/* Primary links */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PRIMARY_LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold text-center transition-colors ${
                    pathname === l.href
                      ? "bg-mint/10 text-mint"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* More links */}
            <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2 px-1">More</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {MORE_LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold text-center transition-colors ${
                    pathname === l.href
                      ? "bg-mint/10 text-mint"
                      : "bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}>
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="h-px bg-white/5 mb-4" />

            {/* Auth */}
            {loaded && user ? (
              <div className="flex gap-3">
                <Link href="/dashboard" onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl bg-white/5 py-3 text-center text-sm font-bold text-white">
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setOpen(false); }}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-400">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/login" onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl border border-white/10 py-3 text-center text-sm font-bold text-white">
                  Log in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-mint to-teal py-3 text-center text-sm font-black text-ink">
                  Start free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
