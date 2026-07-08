"use client";

import { useEffect, useState } from "react";

type Badge = {
  id: string; name: string; desc: string; emoji: string;
  earned: boolean; earnedAt: string | null; isNew: boolean;
};
type Streak = { current_streak: number; longest_streak: number; total_steps: number; total_distance_meters: number; total_activities: number; };
type Challenge = { steps_goal: number; steps_achieved: number; completed: boolean; date: string; };
type Stats = { total_activities: number; total_steps: number; total_distance_meters: number; };

function metersToKm(m: number) { return (m / 1000).toFixed(1); }
function formatSteps(s: number) { return s >= 1000 ? `${(s / 1000).toFixed(1)}k` : String(s); }

export default function ProgressPage({ userId }: { userId: string }) {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/progress?userId=${userId}`)
      .then(r => r.json())
      .then(d => {
        setStreak(d.streak);
        setChallenge(d.challenge);
        setBadges(d.badges || []);
        setStats(d.stats);
        const nb = d.badges?.find((b: Badge) => b.isNew);
        if (nb) setNewBadge(nb);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-slate-400 animate-pulse">Loading your progress...</div>
    </div>
  );

  const challengePct = challenge ? Math.min(100, Math.round((challenge.steps_achieved / challenge.steps_goal) * 100)) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      {/* New badge popup */}
      {newBadge && (
        <div className="rounded-3xl bg-gradient-to-r from-yellow-400/20 to-orange-400/10 p-5 ring-1 ring-yellow-400/30 text-center">
          <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-1">New Badge Earned!</p>
          <div className="text-5xl my-3">{newBadge.emoji}</div>
          <p className="font-black text-white text-xl">{newBadge.name}</p>
          <p className="text-slate-400 text-sm mt-1">{newBadge.desc}</p>
        </div>
      )}

      {/* Streak card */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-white text-lg">🔥 Streak</h2>
          <span className="text-xs text-slate-500">Keep going daily</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/10 p-4 text-center">
            <p className="text-4xl font-black text-white">{streak?.current_streak || 0}</p>
            <p className="text-xs text-slate-400 mt-1">Current streak</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <p className="text-4xl font-black text-white">{streak?.longest_streak || 0}</p>
            <p className="text-xs text-slate-400 mt-1">Best streak</p>
          </div>
        </div>
        {(streak?.current_streak || 0) === 0 && (
          <p className="mt-4 text-center text-sm text-slate-500">Complete an activity today to start your streak!</p>
        )}
        {(streak?.current_streak || 0) > 0 && (
          <p className="mt-4 text-center text-sm text-mint font-bold">
            {streak!.current_streak} days strong. Don't break it!
          </p>
        )}
      </div>

      {/* Daily challenge */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-white text-lg">🎯 Daily Challenge</h2>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${challenge?.completed ? "bg-mint/20 text-mint" : "bg-white/5 text-slate-400"}`}>
            {challenge?.completed ? "Completed!" : "In progress"}
          </span>
        </div>

        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-3xl font-black text-white">{formatSteps(challenge?.steps_achieved || 0)}</p>
            <p className="text-xs text-slate-400">of {formatSteps(challenge?.steps_goal || 10000)} steps</p>
          </div>
          <p className="text-2xl font-black text-mint">{challengePct}%</p>
        </div>

        <div className="h-3 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-mint to-teal transition-all duration-500"
            style={{ width: `${challengePct}%` }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-500 text-center">
          {challenge?.completed
            ? "Amazing! You crushed today's challenge. 🎉"
            : `${formatSteps((challenge?.steps_goal || 10000) - (challenge?.steps_achieved || 0))} more steps to go`}
        </p>
      </div>

      {/* Stats overview */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-black text-white text-lg mb-4">📊 All Time Stats</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Activities", value: String(stats?.total_activities || 0), icon: "🏃" },
            { label: "Total Steps", value: formatSteps(stats?.total_steps || 0), icon: "👟" },
            { label: "Distance", value: `${metersToKm(stats?.total_distance_meters || 0)}km`, icon: "📍" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/5 p-3 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className="font-black text-white text-lg">{s.value}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-white text-lg">🎖️ Badges</h2>
          <span className="text-xs text-slate-500">{badges.filter(b => b.earned).length}/{badges.length} earned</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-2xl p-4 flex items-start gap-3 ${
                badge.earned
                  ? "bg-gradient-to-br from-yellow-400/15 to-orange-400/5 ring-1 ring-yellow-400/20"
                  : "bg-white/3 opacity-40"
              }`}
            >
              <span className="text-2xl flex-shrink-0">{badge.emoji}</span>
              <div className="min-w-0">
                <p className={`text-sm font-black ${badge.earned ? "text-white" : "text-slate-500"}`}>{badge.name}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-tight">{badge.desc}</p>
                {badge.earned && badge.earnedAt && (
                  <p className="text-[10px] text-yellow-400 mt-1">
                    {new Date(badge.earnedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
