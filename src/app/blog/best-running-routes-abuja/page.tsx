import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Running Routes in Abuja (2026) — Vytora",
  description: "Top running spots in Abuja Nigeria — Millennium Park, Jabi Lake, Maitama trails and more. Safe routes for every fitness level.",
  keywords: ["running routes Abuja", "where to run in Abuja", "Abuja running", "fitness Abuja Nigeria"],
};

export default function AbujaRunningRoutes() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <article className="mx-auto max-w-2xl px-4 py-12">
          <Link href="/blog" className="text-xs text-slate-500 hover:text-mint mb-6 block">← Back to Blog</Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black text-mint uppercase tracking-wider">Abuja</span>
            <span className="text-xs text-slate-500">4 min read</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight mb-4">
            Best Running Routes in Abuja for Every Level
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Abuja is one of the best cities in Nigeria to run. Wide roads, green parks, and cleaner air. Here are the top spots.
          </p>

          <div className="space-y-8 text-slate-300">
            {[
              {
                name: "1. Millennium Park",
                distance: "3-5km loop",
                best: "6-9am or 5-7pm",
                level: "All levels",
                body: "The most popular running spot in Abuja. Wide paved paths, beautiful gardens, and enough shade to make morning runs comfortable even in dry season. The outer perimeter is about 3km. Very safe and well maintained. Families, fitness groups and solo runners all use this space.",
                tip: "Park opens at 7am. Arrive early for the best experience.",
              },
              {
                name: "2. Jabi Lake Park",
                distance: "2-4km lakeside trail",
                best: "Evening (5-7pm)",
                level: "All levels",
                body: "Running around the Jabi Lake is one of the most scenic routes in Abuja. The lakeside path is flat, the views are calming, and the evening breeze from the lake makes it one of the coolest running spots in the city. Very popular with Abuja fitness crowd.",
                tip: "The full lake perimeter is about 4km. Perfect for a 10K training loop.",
              },
              {
                name: "3. Maitama District Roads",
                distance: "4-8km",
                best: "Early morning (5:30-7:30am)",
                level: "Intermediate to advanced",
                body: "The wide, quiet roads of Maitama are excellent for road running early morning before traffic builds. Smooth tarmac, minimal potholes, and very little traffic at 6am. Many Abuja serious runners do their long runs here on weekends.",
                tip: "Bring a reflective vest if running before sunrise.",
              },
              {
                name: "4. Gwarimpa District",
                distance: "3-6km",
                best: "Morning or evening",
                level: "Beginner to intermediate",
                body: "For runners living on the outskirts, Gwarimpa has wide estate roads and relatively flat terrain. A popular choice for residents who want to run without driving across the city. Local running groups meet here on weekends.",
                tip: "The Second Avenue in Gwarimpa is a favourite stretch.",
              },
              {
                name: "5. National Children's Park",
                distance: "2-3km loops",
                best: "Morning",
                level: "Beginner",
                body: "A quieter alternative to Millennium Park with good running paths and less crowd. Great for beginners who want a calm, relaxed environment to start their running journey.",
                tip: "Combine with Millennium Park for a longer session.",
              },
            ].map((route) => (
              <div key={route.name} className="glass rounded-2xl p-6">
                <h2 className="text-xl font-black text-white mb-3">{route.name}</h2>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="text-xs bg-mint/10 text-mint px-3 py-1 rounded-full font-bold">{route.distance}</span>
                  <span className="text-xs bg-white/5 text-slate-300 px-3 py-1 rounded-full">{route.best}</span>
                  <span className="text-xs bg-white/5 text-slate-300 px-3 py-1 rounded-full">{route.level}</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm mb-3">{route.body}</p>
                <p className="text-xs text-mint font-bold">💡 {route.tip}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-gradient-to-r from-mint/15 to-teal/5 p-6 ring-1 ring-mint/30">
            <h3 className="font-black text-white mb-2">Track your Abuja runs with Vytora</h3>
            <p className="text-sm text-slate-300 mb-4">GPS tracking, step counting, and pace monitoring. Built for Nigeria.</p>
            <Link href="/tracker" className="inline-block rounded-xl bg-gradient-to-r from-mint to-teal px-6 py-3 text-sm font-black text-ink">
              Start tracking free →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
