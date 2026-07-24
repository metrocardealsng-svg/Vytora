"use client";

import { memo } from "react";
import { ACTIVITIES } from "./constants";
import type { ActivityType, Status } from "./types";

interface TrackerHeaderProps {
  activityType: ActivityType;
  setActivityType: (type: ActivityType) => void;
  status: Status;
  gpsAccuracy: number | null;
  gpsReady: boolean;
  achievement: string | null;
  isStationary: boolean;
}

export const TrackerHeader = memo(function TrackerHeader({
  activityType,
  setActivityType,
  status,
  gpsAccuracy,
  gpsReady,
  achievement,
  isStationary,
}: TrackerHeaderProps) {
  const active   = status === "tracking";
  const disabled = active || status === "paused";

  return (
    <>
      {/* ── Achievement toast ─────────────────────────────────────────────── */}
      {achievement && (
        <div
          className="fixed top-20 left-1/2 z-50 -translate-x-1/2 w-[90vw] max-w-xs px-4"
          style={{ animation: "slideDown 0.4s ease-out" }}
        >
          <div className="rounded-2xl bg-gradient-to-r from-mint to-teal px-5 py-4 text-center shadow-2xl shadow-mint/30">
            <p className="font-black text-ink text-sm">{achievement}</p>
          </div>
        </div>
      )}

      {/* ── Activity selector + GPS indicator ────────────────────────────── */}
      <div className="mb-5 flex items-center gap-3">
        {/* Scrollable pill selector */}
        <div
          className="flex overflow-x-auto rounded-xl bg-white/5 p-1.5 gap-1 scrollbar-none flex-1"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {ACTIVITIES.map((t) => (
            <button
              key={t}
              disabled={disabled}
              onClick={() => setActivityType(t)}
              className={`flex-shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors disabled:opacity-40 ${
                activityType === t
                  ? "bg-mint text-ink"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* GPS indicator dot */}
        <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
          <span className={`relative flex h-2.5 w-2.5 ${active ? "" : "opacity-40"}`}>
            {active && (
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"
                style={{ animation: "ping 1.5s ease-out infinite" }}
              />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                active ? "bg-mint" : "bg-slate-500"
              }`}
            />
          </span>
          <span className="text-slate-400">
            {active
              ? gpsAccuracy
                ? `±${gpsAccuracy}m`
                : "GPS"
              : gpsReady
              ? "GPS ready"
              : "GPS idle"}
          </span>
        </div>
      </div>

      {/* ── Stationary warning ────────────────────────────────────────────── */}
      {isStationary && active && (
        <div className="mb-4 rounded-xl bg-yellow-400/10 border border-yellow-400/20 px-4 py-2.5 text-center text-xs text-yellow-400">
          Auto-paused — move to resume tracking
        </div>
      )}

      {/* ── Keyframe animations (used by toast and GPS dot above) ─────────── */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0);     }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </>
  );
});
