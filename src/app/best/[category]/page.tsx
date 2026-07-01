import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories, getCategory, getCompetitor } from "@/lib/seo-data";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return { title: "Guide not found" };
  return {
    title: `${c.heading} — Ranked & Reviewed`,
    description: `${c.intro} Compare features, pricing, and accuracy to find the best option in 2026.`,
    alternates: { canonical: `/best/${category}` },
  };
}

export default async function BestCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const ranked = cat.competitorSlugs
    .map((s) => getCompetitor(s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <article className="mx-auto max-w-4xl px-5 py-16">
          <nav className="text-sm text-slate-500">
            <Link href="/compare" className="hover:text-mint">Compare</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-300">{cat.title}</span>
          </nav>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            {cat.heading}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">{cat.intro}</p>

          {/* Winner: Vytora */}
          <div className="mt-10 rounded-3xl bg-gradient-to-br from-mint/20 to-teal/5 p-8 ring-2 ring-mint">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gradient-to-r from-mint to-teal px-3 py-1 text-xs font-black text-ink">
                #1 OUR PICK
              </span>
              <span className="text-xs font-semibold text-slate-400">Editor&apos;s Choice</span>
            </div>
            <h2 className="mt-4 text-3xl font-black text-white">Vytora</h2>
            <p className="mt-2 text-slate-300">
              Vytora tops our list of the best {cat.title.toLowerCase()} for one simple
              reason: it gives you everything — free live GPS maps, accurate step and
              distance tracking, calorie and pace insights, streaks, and AI training
              plans — in a beautiful, ad-free app that&apos;s a joy to use.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
              <li>✓ Free forever tier</li>
              <li>✓ Live GPS route maps</li>
              <li>✓ No ads, ever</li>
              <li>✓ Fast, clean interface</li>
            </ul>
            <Link
              href="/signup"
              className="btn-glow mt-6 inline-block rounded-xl bg-gradient-to-r from-mint to-teal px-7 py-3.5 text-base font-black text-ink"
            >
              Try Vytora Free →
            </Link>
          </div>

          {/* Runners-up */}
          <h2 className="mt-14 text-2xl font-black text-white">The rest of the field</h2>
          <div className="mt-6 space-y-5">
            {ranked.map((c, i) => (
              <div key={c.slug} className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-black text-white">
                        {i + 2}
                      </span>
                      <h3 className="text-xl font-bold text-white">{c.name}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{c.summary}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                    {c.price}
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-mint">Pros</p>
                    <ul className="mt-1 space-y-1 text-sm text-slate-400">
                      {c.strengths.map((s) => <li key={s}>+ {s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cons</p>
                    <ul className="mt-1 space-y-1 text-sm text-slate-400">
                      {c.weaknesses.map((s) => <li key={s}>− {s}</li>)}
                    </ul>
                  </div>
                </div>
                <Link
                  href={`/compare/vytora-vs-${c.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-mint hover:underline"
                >
                  See full Vytora vs {c.name} comparison →
                </Link>
              </div>
            ))}
          </div>

          {/* Other guides */}
          <h2 className="mt-14 text-xl font-bold text-white">More buying guides</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {categories
              .filter((x) => x.slug !== cat.slug)
              .map((x) => (
                <Link
                  key={x.slug}
                  href={`/best/${x.slug}`}
                  className="rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                >
                  {x.title}
                </Link>
              ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
