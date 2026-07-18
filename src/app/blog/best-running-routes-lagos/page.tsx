import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Running Routes in Lagos (2026) — Vytora",
  description: "Top running routes in Lagos Nigeria — Lekki Conservation Centre, Victoria Island, Ikoyi, and more. Safe routes for morning and evening runs.",
  keywords: ["running routes Lagos", "where to run in Lagos", "Lagos running", "fitness Lagos Nigeria"],
};

export default function LagosRunningRoutes() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <article className="mx-auto max-w-2xl px-4 py-12">
          <Link href="/blog" className="text-xs text-slate-500 hover:text-mint mb-6 block">← Back to Blog</Link>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black text-mint uppercase tracking-wider">Lagos</span>
            <span className="text-xs text-slate-500">5 min read</span>
          </div>
          
          <h1 className="text-3xl font-black text-white leading-tight mb-4">
            Best Running Routes in Lagos (2026 Guide)
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Lagos is chaotic. But if you know where to go, it has some genuinely great running spots. Here are the best routes for every type of runner.
          </p>

          <div className="space-y-8 text-slate-300">
            {[
              {
                name: "1. Lekki Conservation Centre",
                distance: "3-8km loops available",
                best: "Early morning (6-8am)",
                level: "All levels",
                body: "The canopy walkway trail is one of the most scenic runs in Nigeria. Flat, shaded, and away from traffic. Gates open at 8am weekdays. Get there early before the heat kicks in. The 3km inner loop is perfect for beginners. Serious runners do multiple laps.",
                tip: "Bring water. No vendors inside.",
              },
              {
                name: "2. Victoria Island Waterfront",
                distance: "2-5km stretch",
                best: "Evening (6-8pm)",
                level: "Beginner to intermediate",
                body: "The stretch along Ozumba Mbadiwe Avenue by the water is flat, well-lit in the evening, and busy enough to feel safe. Popular with Lagos fitness crowd. You will see other runners which is motivating. Watch out for okadas on the road section.",
                tip: "The Eko Atlantic promenade extension adds extra distance.",
              },
              {
                name: "3. Ikoyi Club Area",
                distance: "3-6km",
                best: "Early morning",
                level: "All levels",
                body: "The roads around Ikoyi are quieter than the rest of Lagos, relatively well maintained, and have less heavy traffic early morning. Many serious Lagos runners do loops around this area. Parcourt Road and Kingsway Road are popular.",
                tip: "Pair with a loop around the golf course perimeter.",
              },
              {
                name: "4. National Stadium Area (Surulere)",
                distance: "2-4km",
                best: "Morning",
                level: "Beginner",
                body: "The roads around the National Stadium are wide and see less traffic in the morning. The stadium track itself is sometimes accessible. Good option for mainland runners who cannot make it to the island.",
                tip: "Join a local running group here on Saturday mornings.",
              },
              {
                name: "5. Tarkwa Bay Beach",
                distance: "2-3km beach stretch",
                best: "Morning",
                level: "Intermediate",
                body: "Running on sand is harder and burns more calories. Tarkwa Bay is accessible by boat from Ramp Road. The beach is flat and long enough for a proper beach run. Best done early before it gets crowded.",
                tip: "Sand running burns 1.5x more calories than road running.",
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
            <h3 className="font-black text-white mb-2">Track your Lagos runs with Vytora</h3>
            <p className="text-sm text-slate-300 mb-4">Get precise GPS tracking, step counting, and pace monitoring on every route. Free to start.</p>
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
