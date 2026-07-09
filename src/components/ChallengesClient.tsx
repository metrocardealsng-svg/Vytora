"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  todaySteps: number;
  stepGoal: number;
  stepProgress: number;
  currentStreak: number;
  totalDistance: number;
  totalActivities: number;
  totalCalories: number;
};

type Badge = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  earned?: boolean;
};

export default function ChallengesClient({ userName }: { userName: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((d) => {
        if (d.stats) setStats(d.stats);
        if (d.allBadges) setAllBadges(d.allBadges);
        setLoading(false);
      });
  }, []);

  async function sendWeeklyReport() {
    setSending(true);
    await fetch("/api/progress", { method: "POST" });
    setSending(false);
    setSent(true);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="glass rounded-3xl p-8 text-center text-slate-400 animate-pulse">
          Loading your progress...
        </div>
      </div>
    );
  }

  const earnedCount = allBadges.filter((b) => b.earned).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">Challenges</h1>
        <p className="mt-1 text-slate-400">Keep moving, {userName}. Every step counts.</p>
      </div>

      {/* Daily Step Challenge */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-mint">Daily Challenge</span>
            <h2 className="text-xl font-black text-white mt-1">10,000 Steps Today</h2>
          </div>
          <span className="text-4xl">🎯</span>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">{stats?.todaySteps?.toLocaleString() || 0} steps</span>
            <span className="text-slate-400">{stats?.stepGoal?.toLocaleString() || 10000} goal</span>
          </div>
          <div className="h-4 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-mint to-teal transition-all duration-500"
              style={{ width: `${stats?.stepProgress || 0}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-white">{stats?.stepProgress || 0}%</span>
          {(stats?.stepProgress || 0) >= 100 ? (
            <span className="rounded-full bg-mint/15 px-4 py-1.5 text-sm font-black text-mint">
              Goal reached! 🎉
            </span>
          ) : (
            <span className="text-sm text-slate-400">
              {((stats?.stepGoal || 10000) - (stats?.todaySteps || 0)).toLocaleString()} steps to go
            </span>
          )}
        </div>
      </div>

      {/* Streak */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">🔥</div>
          <div className="flex-1">
            <p className="text-sm text-slate-400">Current Streak</p>
            <p className="text-4xl font-black text-white">
              {stats?.currentStreak || 0}
              <span className="text-lg text-slate-400 ml-1">days</span>
            </p>
            {(stats?.currentStreak || 0) === 0 && (
              <p className="text-xs text-slate-500 mt-1">Log an activity today to start your streak</p>
            )}
            {(stats?.currentStreak || 0) >= 7 && (
              <p className="text-xs text-mint mt-1">You're on fire! Keep it going.</p>
            )}
          </div>
          <Link href="/tracker"
            className="rounded-xl bg-gradient-to-r from-mint to-teal px-4 py-2.5 text-sm font-black text-ink hover:opacity-90">
            Train now
          </Link>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total km", value: `${stats?.totalDistance || 0}km`, emoji: "🗺" },
          { label: "Sessions", value: stats?.totalActivities || 0, emoji: "💪" },
          { label: "Calories", value: (stats?.totalCalories || 0).toLocaleString(), emoji: "🔥" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4 text-center">
            <p className="text-xl mb-1">{s.emoji}</p>
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-white">Badges</h2>
          <span className="text-sm text-slate-400">{earnedCount}/{allBadges.length} earned</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {allBadges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl p-4 transition-all ${
                badge.earned
                  ? "bg-mint/10 ring-1 ring-mint/30"
                  : "bg-white/3 opacity-40"
              }`}
            >
              <span className="text-3xl">{badge.emoji}</span>
              <p className={`mt-2 text-sm font-black ${badge.earned ? "text-white" : "text-slate-500"}`}>
                {badge.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{badge.desc}</p>
              {badge.earned && (
                <span className="mt-2 inline-block text-[10px] font-black text-mint">EARNED</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Report */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white">Weekly Report</h2>
            <p className="text-sm text-slate-400 mt-1">
              Get your full week summary sent to your email.
            </p>
          </div>
          <span className="text-3xl">📊</span>
        </div>
        <button
          onClick={sendWeeklyReport}
          disabled={sending || sent}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-mint to-teal py-3 text-sm font-black text-ink disabled:opacity-60 hover:opacity-90 transition-opacity"
        >
          {sent ? "Report sent! Check your inbox 📬" : sending ? "Sending..." : "Send my weekly report"}
        </button>
      </div>
    </div>
  );
}
