"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Flame, Trophy, Crown } from "lucide-react";
import type { LeaderboardEntry } from "@/app/api/leaderboard/route";

/**
 * Leaderboard
 *
 * Real-time leaderboard with three tabs: This Week / This Month / All Time.
 * Data is fetched from /api/leaderboard?range=week|month|alltime.
 * A Supabase realtime channel listens for new rows on the `activities`
 * table and refreshes the board automatically whenever someone logs
 * a new activity, so the scores stay live without a page reload.
 *
 * Usage:
 *   <Leaderboard currentUserId={userId} />
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Range = "week" | "month" | "alltime";

const TABS: { label: string; value: Range }[] = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "alltime" },
];

function formatScore(score: number): string {
  if (score >= 1_000_000) return `${(score / 1_000_000).toFixed(1)}M`;
  if (score >= 1_000) return `${(score / 1_000).toFixed(1)}K`;
  return Math.round(score).toLocaleString();
}

function formatDistance(meters: number): string {
  const km = meters / 1000;
  return km >= 1 ? `${km.toFixed(1)} km` : `${Math.round(meters)} m`;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400/20">
        <Crown className="h-4 w-4 text-yellow-400" />
      </span>
    );
  if (rank === 2)
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300/10">
        <Trophy className="h-4 w-4 text-slate-300" />
      </span>
    );
  if (rank === 3)
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700/20">
        <Trophy className="h-4 w-4 text-amber-600" />
      </span>
    );
  return (
    <span className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-white/40">
      {rank}
    </span>
  );
}

function LeaderboardRow({
  entry,
  isCurrentUser,
  index,
}: {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  index: number;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={`flex items-center gap-4 rounded-2xl px-4 py-3 transition-colors ${
        isCurrentUser
          ? "border border-[#34E0A1]/30 bg-[#34E0A1]/10"
          : "border border-transparent hover:bg-white/5"
      }`}
    >
      <RankBadge rank={entry.rank} />

      {/* Avatar */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
        {entry.avatar_url ? (
          <Image
            src={entry.avatar_url}
            alt={entry.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/60">
            {entry.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name + stats */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-white">
            {entry.username}
          </p>
          {isCurrentUser && (
            <span className="rounded-full bg-[#34E0A1]/20 px-2 py-0.5 text-[10px] font-medium text-[#34E0A1]">
              You
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-white/40">
          <span>{entry.period_steps.toLocaleString()} steps</span>
          <span>·</span>
          <span>{formatDistance(entry.period_distance_meters)}</span>
          {entry.current_streak > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1 text-orange-400">
                <Flame className="h-3 w-3" />
                {entry.current_streak}d
              </span>
            </>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-white">
          {formatScore(entry.score)}
        </p>
        <p className="text-[10px] text-white/30">pts</p>
      </div>
    </motion.li>
  );
}

export default function Leaderboard({
  currentUserId,
}: {
  currentUserId?: string | null;
}) {
  const [range, setRange] = useState<Range>("week");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (r: Range) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leaderboard?range=${r}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load leaderboard");
      const data: LeaderboardEntry[] = await res.json();
      setEntries(data);
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when tab changes
  useEffect(() => {
    fetchLeaderboard(range);
  }, [range, fetchLeaderboard]);

  // Realtime: refresh board when any new activity is inserted
  useEffect(() => {
    const channel = supabase
      .channel("leaderboard-activities")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "activities" },
        () => {
          fetchLeaderboard(range);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [range, fetchLeaderboard]);

  return (
    <section className="relative w-full px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-[#34E0A1]">
            Live Rankings
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Leaderboard
          </h2>
          <p className="mt-3 text-sm text-white/50">
            Ranked by steps, distance, calories, and streak — updates live.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setRange(tab.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                range === tab.value
                  ? "bg-[#34E0A1] text-[#05070B]"
                  : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Board */}
        <div className="rounded-3xl border border-white/10 bg-[#10131B]/60 p-4 backdrop-blur-xl sm:p-6">
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl bg-white/5"
                />
              ))}
            </div>
          ) : error ? (
            <p className="py-10 text-center text-sm text-red-400">{error}</p>
          ) : entries.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/40">
              No activity yet for this period.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              <AnimatePresence mode="popLayout">
                {entries.map((entry, index) => (
                  <LeaderboardRow
                    key={entry.user_id}
                    entry={entry}
                    isCurrentUser={entry.user_id === currentUserId}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Live indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34E0A1] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34E0A1]" />
          </span>
          Updates live as activities are logged
        </div>
      </div>
    </section>
  );
}
