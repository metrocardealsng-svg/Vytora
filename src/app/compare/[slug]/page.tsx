import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureTable from "@/components/FeatureTable";
import { competitors, getCompetitor } from "@/lib/seo-data";

export function generateStaticParams() {
  return competitors.map((c) => ({ slug: `vytora-vs-${c.slug}` }));
}

function resolve(slug: string) {
  if (!slug.startsWith("vytora-vs-")) return undefined;
  return getCompetitor(slug.replace("vytora-vs-", ""));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = resolve(slug);
  if (!c) return { title: "Comparison not found" };
  return {
    title: `Vytora vs ${c.name} (2026): Which Is Better?`,
    description: `A detailed, feature-by-feature comparison of Vytora and ${c.name}. See pricing, GPS tracking, step counting, and which app is best for you in 2026.`,
    alternates: { canonical: `/compare/${slug}` },
  };
}

export default async function VsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = resolve(slug);
  if (!c) notFound();

  const others = competitors.filter((x) => x.slug !== c.slug).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <article className="mx-auto max-w-4xl px-5 py-16">
          <nav className="text-sm text-slate-500">
            <Link href="/compare" className="hover:text-mint">Compare</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-300">Vytora vs {c.name}</span>
          </nav>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Vytora vs <span className="text-gradient">{c.name}</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{c.summary}</p>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            Below we break down how <strong className="text-white">Vytora</strong> and{" "}
            {c.name} compare across the features that matter most for tracking your
            walks, runs, and daily movement in 2026.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-mint">Why choose Vytora</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>✓ Free live GPS route maps — no paywall</li>
                <li>✓ Zero ads, ever</li>
                <li>✓ Clean, lightning-fast interface</li>
                <li>✓ Accurate step & distance tracking</li>
                <li>✓ Streaks, records, and AI plans</li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white">{c.name} at a glance</h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">
                Pricing: {c.price}
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-300">Strengths</p>
              <ul className="mt-1 space-y-1 text-sm text-slate-400">
                {c.strengths.map((s) => <li key={s}>• {s}</li>)}
              </ul>
              <p className="mt-3 text-sm font-semibold text-slate-300">Weaknesses</p>
              <ul className="mt-1 space-y-1 text-sm text-slate-400">
                {c.weaknesses.map((s) => <li key={s}>• {s}</li>)}
              </ul>
            </div>
          </div>

          <h2 className="mt-14 text-2xl font-black text-white">
            Feature comparison: Vytora vs {c.name}
          </h2>
          <div className="mt-6">
            <FeatureTable competitor={c} />
          </div>

          <h2 className="mt-14 text-2xl font-black text-white">The verdict</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            If you want a beautiful, distraction-free tracker that gives you live GPS
            maps, accurate mileage, and motivating insights <em>without</em> paywalls
            or ads, <strong className="text-white">Vytora</strong> is the clear winner.{" "}
            {c.name} is a capable app — especially for {c.strengths[0].toLowerCase()} —
            but Vytora delivers a cleaner, faster, and more generous experience for
            everyday movers.
          </p>

          <div className="mt-10 rounded-3xl bg-gradient-to-br from-mint to-teal p-8 text-center">
            <h3 className="text-2xl font-black text-ink">Try Vytora free today</h3>
            <p className="mt-2 font-medium text-ink/80">
              No credit card. No ads. Just better tracking.
            </p>
            <Link
              href="/signup"
              className="mt-5 inline-block rounded-xl bg-ink px-8 py-3.5 text-base font-black text-white hover:bg-ink-soft"
            >
              Start Tracking Free
            </Link>
          </div>

          <h2 className="mt-14 text-xl font-bold text-white">More comparisons</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/compare/vytora-vs-${o.slug}`}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                Vytora vs {o.name}
              </Link>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
