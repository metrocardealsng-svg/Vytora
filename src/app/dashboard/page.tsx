import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatDuration, formatMiles, formatPace, metersToMiles, formatDate } from "@/lib/format";
import ActivityList from "@/components/ActivityList";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string; demo?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const params = await searchParams;

  const rows = await db
    .select()
    .from(activities)
    .where(eq(activities.userId, user.id))
    .orderBy(desc(activities.startedAt));

  const totalMeters = rows.reduce((s, r) => s + r.distanceMeters, 0);
  const totalSteps = rows.reduce((s, r) => s + r.steps, 0);
  const totalSeconds = rows.reduce((s, r) => s + r.durationSeconds, 0);
  const totalCalories = rows.reduce((s, r) => s + r.calories, 0);

  // This week
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekRows = rows.filter((r) => new Date(r.startedAt).getTime() >= weekAgo);
  const weekMiles = metersToMiles(weekRows.reduce((s, r) => s + r.distanceMeters, 0));

  // Streak: consecutive days with an activity
  const days = new Set(
    rows.map((r) => new Date(r.startedAt).toISOString().slice(0, 10))
  );
  let streak = 0;
  const cur = new Date();
  while (days.has(cur.toISOString().slice(0, 10))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }

  const bestPace = rows
    .filter((r) => r.avgPaceSecPerMile > 0 && metersToMiles(r.distanceMeters) >= 0.25)
    .reduce((best, r) => (best === 0 || r.avgPaceSecPerMile < best ? r.avgPaceSecPerMile : best), 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <div className="mx-auto max-w-6xl px-5 py-12">
          {params.upgraded && (
            <div className="mb-6 rounded-2xl border border-mint/30 bg-mint/10 px-5 py-4 text-sm text-mint">
              🎉 You&apos;re now on the <strong className="capitalize">{params.upgraded}</strong> plan!
              {params.demo ? " (Demo mode — Stripe keys not configured, upgrade simulated.)" : " Thanks for supporting Vytora."}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Hi{user.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
              </h1>
              <p className="mt-1 text-slate-400">
                You&apos;re on the{" "}
                <span className="font-semibold capitalize text-mint">{user.plan}</span> plan.
                {user.plan === "free" && (
                  <>
                    {" "}
                    <Link href="/pricing" className="font-semibold text-mint underline">Upgrade →</Link>
                  </>
                )}
              </p>
            </div>
            <Link
              href="/tracker"
              className="btn-glow rounded-xl bg-gradient-to-r from-mint to-teal px-6 py-3 text-sm font-black text-ink"
            >
              + New Activity
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="Total Miles" value={formatMiles(totalMeters)} />
            <Stat label="Total Steps" value={totalSteps.toLocaleString()} />
            <Stat label="Total Time" value={formatDuration(totalSeconds)} />
            <Stat label="Calories Burned" value={totalCalories.toLocaleString()} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="This Week" value={`${weekMiles.toFixed(1)} mi`} accent />
            <Stat label="Day Streak" value={`${streak}🔥`} accent />
            <Stat label="Activities" value={`${rows.length}`} accent />
            <Stat label="Best Pace" value={bestPace ? `${formatPace(bestPace)}/mi` : "--"} accent />
          </div>

          {/* Activities */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-white">Your activities</h2>
            {rows.length === 0 ? (
              <div className="glass mt-4 rounded-2xl p-10 text-center">
                <p className="text-slate-300">No activities yet.</p>
                <Link href="/tracker" className="mt-4 inline-block rounded-xl bg-gradient-to-r from-mint to-teal px-6 py-3 text-sm font-black text-ink">
                  Track your first walk
                </Link>
              </div>
            ) : (
              <ActivityList
                activities={rows.map((r) => ({
                  id: r.id,
                  type: r.type,
                  title: r.title,
                  miles: formatMiles(r.distanceMeters),
                  duration: formatDuration(r.durationSeconds),
                  pace: formatPace(r.avgPaceSecPerMile),
                  steps: r.steps,
                  calories: r.calories,
                  date: formatDate(r.startedAt),
                  route: r.route,
                }))}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-5 ${accent ? "border-mint/20" : ""}`}>
      <div className={`text-2xl font-black ${accent ? "text-gradient" : "text-white"}`}>{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}
