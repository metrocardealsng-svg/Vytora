import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveTracker from "@/components/LiveTracker";
import StarRating from "@/components/StarRating";
import { getSessionUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const userId = await getSessionUserId();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* HERO */}
      <section className="aurora relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-mint/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-teal/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-6 lg:grid-cols-2 lg:py-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-3.5 py-1.5 text-xs font-semibold text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              GPS step tracking, reimagined
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
              Live Better.
              <br />
              <span className="text-gradient">Every Day.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-300">
              Vytora is the smart step &amp; GPS tracker built for Nigerians.
              Beautiful stats, real motivation, zero clutter.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/tracker" className="btn-glow rounded-xl bg-gradient-to-r from-mint to-teal px-5 py-3.5 text-sm font-black text-ink sm:px-7 sm:py-4 sm:text-base">
                Start Tracking Free
              </Link>
              <Link href="/pricing" className="rounded-xl border border-white/15 px-5 py-3.5 text-sm font-bold text-white sm:px-7 sm:py-4 sm:text-base hover:bg-white/5">
                View Pricing
              </Link>
            </div>
            <div className="mt-8">
              <StarRating userId={userId || undefined} />
            </div>
          </div>

          <div className="animate-fade-up lg:pl-6" style={{ animationDelay: "0.1s" }}>
            <LiveTracker authed={Boolean(userId)} />
          </div>
        </div>
      </section>

      {/* STAT BAR */}
      <section className="border-y border-white/5 bg-ink-soft/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4">
          {[
            ["New", "Now in Beta"],
            ["★★★★★", "Early user rating"],
            ["24/7", "GPS Tracking"],
            ["0", "Ads, ever"],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-3xl font-black text-gradient">{n}</div>
              <div className="mt-1 text-sm text-slate-400">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-black tracking-tight text-white">
            Everything you need to <span className="text-gradient">move more</span>
          </h2>
          <p className="mt-4 text-slate-400">
            We studied the leaders and rebuilt the experience from scratch — faster,
            cleaner, and genuinely motivating.
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="glass group rounded-2xl p-6 transition-transform hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-mint/20 to-teal/20 text-2xl">
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-white/5 bg-ink-soft/30">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-black tracking-tight text-white">
              Track a walk in <span className="text-gradient">three taps</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-mint to-teal text-xl font-black text-ink">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE TEASER */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="glass overflow-hidden rounded-3xl">
          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                Why movers switch to Vytora
              </h2>
              <p className="mt-4 text-slate-400">
                No paywalled maps. No cluttered feed. Built for Nigeria.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/compare/vytora-vs-strava" className="rounded-lg bg-mint/10 px-4 py-2 text-sm font-semibold text-mint hover:bg-mint/20">
                  Vytora vs Strava
                </Link>
                <Link href="/compare/vytora-vs-fitbit" className="rounded-lg bg-mint/10 px-4 py-2 text-sm font-semibold text-mint hover:bg-mint/20">
                  Vytora vs Fitbit
                </Link>
                <Link href="/compare" className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5">
                  See all →
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {compareRows.map((r) => (
                <div key={r.label} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
                  <span className="text-slate-300">{r.label}</span>
                  <span className="flex items-center gap-6">
                    <span className="font-bold text-mint">✓ Vytora</span>
                    <span className={r.them ? "text-slate-400" : "text-slate-600"}>
                      {r.them ? "Partial" : "✕"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mint to-teal p-10 text-center md:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%)" }} />
          <h2 className="relative text-4xl font-black tracking-tight text-ink sm:text-5xl">
            Ready to live better?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-lg font-medium text-ink/80">
            Join Nigerians building healthier habits, one mile at a time.
            Free to start — no credit card needed.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="rounded-xl bg-ink px-8 py-4 text-base font-black text-white hover:bg-ink-soft">
              Create Free Account
            </Link>
            <Link href="/tracker" className="rounded-xl bg-white/20 px-8 py-4 text-base font-black text-ink backdrop-blur hover:bg-white/30">
              Try the Tracker
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const features = [
  { icon: "📍", title: "Precise GPS routing", body: "Real-time location tracking maps every step of your route and filters GPS noise for accurate mileage." },
  { icon: "👟", title: "Smart step counting", body: "Accelerometer-based step detection and live pace so you always know how far and how fast." },
  { icon: "🔥", title: "Calorie & pace insights", body: "Automatic calorie burn, average pace, and speed for every walk, run, or hike." },
  { icon: "📈", title: "Progress dashboard", body: "Weekly totals, streaks, and personal records that keep you coming back." },
  { icon: "🗺️", title: "Route history", body: "Every saved activity keeps its map so you can revisit your favorite routes." },
  { icon: "⚡", title: "Blazing fast & clean", body: "A distraction-free interface that loads instantly. No ads, no clutter." },
];

const steps = [
  { title: "Pick your activity", body: "Choose walk, run, hike, gym, yoga and more. Hit start." },
  { title: "Move your body", body: "We track your live route, distance, steps, pace, and calories as you go." },
  { title: "Save & celebrate", body: "Finish to save your activity and watch your stats and streaks grow." },
];

const compareRows = [
  { label: "Free live GPS maps", them: false },
  { label: "No ads, ever", them: false },
  { label: "Nigerian meal plans + AI", them: false },
  { label: "Clean, fast interface", them: true },
  { label: "Streaks & personal records", them: true },
];
