import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { competitors, categories } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Compare Vytora — Head-to-Head Fitness App Comparisons",
  description:
    "See how Vytora compares to Strava, Fitbit, MapMyWalk, Nike Run Club, and more. Detailed feature-by-feature comparisons of the best step and activity tracking apps.",
};

export default function CompareIndex() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Compare <span className="text-gradient">Vytora</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Honest, detailed comparisons against every major fitness app.
              See exactly what you get — and what you don&apos;t.
            </p>
          </div>

          <h2 className="mt-16 text-2xl font-black text-white">Vytora vs …</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {competitors.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/vytora-vs-${c.slug}`}
                className="glass group rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Vytora vs {c.name}</h3>
                  <span className="text-mint transition-transform group-hover:translate-x-1">→</span>
                </div>
                <p className="mt-2 text-sm text-slate-400 line-clamp-2">{c.summary}</p>
              </Link>
            ))}
          </div>

          <h2 className="mt-16 text-2xl font-black text-white">Best-in-category guides</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/best/${c.slug}`}
                className="glass group flex items-center justify-between rounded-2xl p-6 transition-transform hover:-translate-y-1"
              >
                <div>
                  <h3 className="text-lg font-bold text-white">{c.heading}</h3>
                  <p className="mt-1 text-sm text-slate-400">Ranked & reviewed</p>
                </div>
                <span className="text-mint transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
