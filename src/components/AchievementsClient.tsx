"use client";

import { useEffect, useState } from "react";
import { BADGES } from "@/lib/badges";

type Stats = {
  totalSteps: number;
  totalDistanceMeters: number;
  totalActivities: number;
  currentStreak: number;
  longestStreak: number;
};

const STEP_GOAL = 10000;

function StepRing({ steps, goal }: { steps: number; goal: number }) {
  const pct = Math.min(steps / goal, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle cx="60" cy="60" r={r} fill="none" stroke="url(#ring-grad)" strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }} />
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34e0a1" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-black text-white">{steps.toLocaleString()}</p>
          <p className="text-xs text-slate-400">/ {goal.toLocaleString()}</p>
          <p className="text-xs text-mint font-bold mt-0.5">steps today</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-400">
        {pct >= 1 ? "🎉 Goal reached!" : `${Math.round(pct * 100)}% of daily goal`}
      </p>
    </div>
  );
}

export default function AchievementsClient({ userId, username }: { userId: string; username: string }) {
  const [data, setData] = useState<any>(null);
  const [newBadgeAlert, setNewBadgeAlert] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/achievements")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.newBadges?.length > 0) setNewBadgeAlert(d.newBadges);
      });
  }, []);

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="glass rounded-3xl p-8 text-center text-slate-400 animate-pulse">Loading achievements...</div>
      </div>
    );
  }

  const { stats, todaySteps, earnedBadgeIds, earnedMap } = data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      {/* New badge alert */}
      {newBadgeAlert.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-mint/20 to-teal/10 ring-1 ring-mint/40 p-5 flex items-center gap-4">
          <span className="text-3xl">🎖️</span>
          <div>
            <p className="font-black text-white">New badge{newBadgeAlert.length > 1 ? "s" : ""} earned!</p>
            <p className="text-sm text-slate-300">
              {newBadgeAlert.map((id) => BADGES.find((b) => b.id === id)?.name).join(", ")}
            </p>
          </div>
          <button onClick={() => setNewBadgeAlert([])} className="ml-auto text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-black text-white">Achievements</h1>
        <p className="mt-1 text-slate-400">Track your progress and earn badges.</p>
      </div>

      {/* Today's step goal */}
      <div className="glass rounded-3xl p-6 flex flex-col items-center">
        <h2 className="text-lg font-black text-white mb-5">Today's Step Goal</h2>
        <StepRing steps={todaySteps} goal={STEP_GOAL} />
        <div className="mt-4 grid grid-cols-3 gap-4 w-full text-center">
          <div>
            <p className="text-xl font-black text-white">{stats.currentStreak}</p>
            <p className="text-xs text-slate-400">Day streak</p>
          </div>
          <div>
            <p className="text-xl font-black text-white">{stats.longestStreak}</p>
            <p className="text-xs text-slate-400">Best streak</p>
          </div>
          <div>
            <p className="text-xl font-black text-white">{stats.totalActivities}</p>
            <p className="text-xs text-slate-400">Activities</p>
          </div>
        </div>
      </div>

      {/* Lifetime stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-2xl font-black text-white">{(stats.totalSteps || 0).toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Total steps</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center">
          <p className="text-2xl font-black text-white">{((stats.totalDistanceMeters || 0) / 1000).toFixed(1)}km</p>
          <p className="text-xs text-slate-400 mt-1">Total distance</p>
        </div>
      </div>

      {/* Streak info */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-black text-white mb-4">🔥 Current Streak</h2>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl font-black text-white">
            {stats.currentStreak}
          </div>
          <div>
            <p className="font-bold text-white">
              {stats.currentStreak === 0 ? "Start your streak today!" :
               stats.currentStreak === 1 ? "1 day streak. Keep going!" :
               `${stats.currentStreak} days in a row!`}
            </p>
            <p className="text-sm text-slate-400">
              Best ever: {stats.longestStreak} days
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Complete any activity today to maintain your streak.
            </p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="font-black text-white text-xl mb-4">
          Badges ({earnedBadgeIds.length}/{BADGES.length})
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BADGES.map((badge) => {
            const earned = earnedBadgeIds.includes(badge.id);
            const earnedAt = earnedMap[badge.id];
            return (
              <div
                key={badge.id}
                className={`glass rounded-2xl p-4 flex flex-col items-center text-center transition-all ${
                  earned ? "ring-1 ring-white/20" : "opacity-40"
                }`}
              >
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-2xl mb-2 ${!earned ? "grayscale" : ""}`}>
                  {badge.emoji}
                </div>
                <p className="font-bold text-white text-xs">{badge.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{badge.description}</p>
                {earned && earnedAt && (
                  <p className="text-[10px] text-mint mt-1">
                    {new Date(earnedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                  </p>
                )}
                {!earned && <p className="text-[10px] text-slate-600 mt-1">Locked</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
