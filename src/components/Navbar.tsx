"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";

type Me = { id: string; email: string; name: string; plan: string } | null;

export default function Navbar() {
  const [user, setUser] = useState<Me>(null);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (active) {
          setUser(d.user);
          setLoaded(true);
        }
      })
      .catch(() => setLoaded(true));
    return () => {
      active = false;
    };
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const links = [
    { href: "/progress", label: "Progress" },
    { href: "/tracker", label: "Tracker" },
    { href: "/pricing", label: "Pricing" },
   
    { href: "/tribe", label: "Tribe" },
    { href: "/tips", label: "Tips" },
    { href: "/achievements", label: "Achievements" },
    { href: "/profile", label: "Profile" },
    { href: "/compare", label: "Compare" },
  
    { href: "/best/step-tracking-apps", label: "Best Apps" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06080c]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "text-mint"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {loaded && user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="btn-glow rounded-lg bg-gradient-to-r from-mint to-teal px-4 py-2 text-sm font-bold text-ink"
              >
                Start free
              </Link>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-white md:hidden"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </nav>
      {open && (
        <div className="border-t border-white/5 bg-[#06080c] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-white/5" />
            {loaded && user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5">Dashboard</Link>
                <button onClick={logout} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-200 hover:bg-white/5">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5">Log in</Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-lg bg-gradient-to-r from-mint to-teal px-3 py-2.5 text-center text-sm font-bold text-ink">Start free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
