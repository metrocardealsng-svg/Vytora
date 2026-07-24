"use client";

import { memo } from "react";
import { formatDuration, formatPace } from "@/lib/format";

// ─── Metric tile ──────────────────────────────────────────────────────────────
interface MetricProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const Metric = memo(function Metric({ label, value, highlight = false }: MetricProps) {
  return (
    <div
      className={`rounded-xl p-3 text-center transition-all ${
        highlight ? "bg-mint/20 ring-1 ring-mint/50" : "bg-white/5"
      }`}
    >
      <div
        className={`truncate text-xl font-black ${
          highlight ? "text-mint" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
    </div>
  );
});

// ─── TrackerStats ─────────────────────────────────────────────────────────────
interface TrackerStatsProps {
  steps: number;
  elapsed: number;     // seconds
  pace: number;        // seconds per mile
  calories: number;
  speed: number;       // mph
  gpsPoints: number;   // route.length
}

export const TrackerStats = memo(function TrackerStats({
  steps,
  elapsed,
  pace,
  calories,
  speed,
  gpsPoints,
}: TrackerStatsProps) {
  return (
    <>
      {/* ── Main metrics grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric
          label="Steps"
          value={steps.toLocaleString()}
          highlight={steps >= 10000}
        />
        <Metric label="Time"     value={formatDuration(elapsed)} />
        <Metric label="Pace /mi" value={formatPace(pace)} />
        <Metric label="Calories" value={String(calories)} />
      </div>

      {/* ── Secondary info row ────────────────────────────────────────────── */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs text-slate-400">
        <div className="rounded-lg bg-white/5 py-2">
          Speed{" "}
          <span className="font-bold text-white">{speed.toFixed(1)}</span> mph
        </div>
        <div className="rounded-lg bg-white/5 py-2">
          GPS pts{" "}
          <span className="font-bold text-white">{gpsPoints}</span>
        </div>
      </div>
    </>
  );
});
