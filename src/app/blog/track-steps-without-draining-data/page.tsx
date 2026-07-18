import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Track Steps Without Draining Mobile Data — Vytora",
  description: "GPS step tracking in Nigeria without burning through your data bundle. How Vytora stays light on data while keeping GPS accurate.",
  keywords: ["track steps Nigeria", "fitness app low data", "GPS tracking Nigeria data", "step counter without internet"],
};

export default function TrackStepsData() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <article className="mx-auto max-w-2xl px-4 py-12">
          <Link href="/blog" className="text-xs text-slate-500 hover:text-mint mb-6 block">← Back to Blog</Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black text-mint uppercase tracking-wider">Tips</span>
            <span className="text-xs text-slate-500">3 min read</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight mb-4">
            How to Track Steps Without Draining Mobile Data in Nigeria
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Data is expensive in Nigeria. The last thing you want is your fitness app burning through your bundle while you walk. Here's what you need to know.
          </p>

          <div className="space-y-6 text-slate-300">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-3">How GPS Actually Works</h2>
              <p className="text-sm leading-relaxed">GPS does not use mobile data. Your phone receives signals from satellites in space for free. The GPS chip in your phone works completely independently of your data connection. So tracking your route uses zero data.</p>
              <p className="text-sm leading-relaxed mt-3">What uses data is loading the map tiles so you can see streets on screen. Vytora uses OpenStreetMap which caches the map when you first load it. After that, you can track offline.</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-3">How Much Data Does Tracking Use?</h2>
              <ul className="space-y-2 text-sm">
                <li>📍 <strong className="text-white">GPS location recording:</strong> 0MB (satellite only)</li>
                <li>🗺️ <strong className="text-white">Map tiles (first load):</strong> ~2-5MB per area</li>
                <li>🗺️ <strong className="text-white">Map tiles (cached):</strong> 0MB</li>
                <li>💾 <strong className="text-white">Saving an activity:</strong> ~50KB</li>
                <li>📊 <strong className="text-white">Syncing your dashboard:</strong> ~200KB</li>
              </ul>
              <p className="text-sm mt-4 text-mint font-bold">Total per workout after first use: less than 300KB. That's nothing.</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-3">Tips to Minimize Data Usage</h2>
              <ul className="space-y-3 text-sm">
                <li>✅ Open Vytora once on WiFi before your run. The map tiles for your area will cache automatically.</li>
                <li>✅ Start your tracking session before leaving home. GPS locks in and you can run without data.</li>
                <li>✅ Use the step counter mode for indoor workouts. No map needed, zero data used.</li>
                <li>✅ Sync your stats when you get home on WiFi rather than during the workout.</li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-3">Compared to Other Apps</h2>
              <div className="space-y-2 text-sm">
                {[
                  { app: "Strava", data: "5-15MB per run", reason: "Streams data constantly, social feed" },
                  { app: "Google Fit", data: "3-8MB per session", reason: "Syncs to Google servers continuously" },
                  { app: "Vytora", data: "Less than 1MB per run", reason: "Local GPS, cached maps, efficient sync" },
                ].map((r) => (
                  <div key={r.app} className="flex items-start justify-between rounded-xl bg-white/5 px-4 py-3">
                    <div>
                      <p className={`font-bold ${r.app === "Vytora" ? "text-mint" : "text-white"}`}>{r.app}</p>
                      <p className="text-slate-500 text-xs">{r.reason}</p>
                    </div>
                    <p className={`text-xs font-bold ${r.app === "Vytora" ? "text-mint" : "text-slate-400"}`}>{r.data}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-gradient-to-r from-mint/15 to-teal/5 p-6 ring-1 ring-mint/30">
            <h3 className="font-black text-white mb-2">Try Vytora free today</h3>
            <p className="text-sm text-slate-300 mb-4">GPS tracking built for Nigerian data budgets. Start free, no credit card needed.</p>
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
