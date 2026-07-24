"use client";

import { memo } from "react";
import type { Status } from "./types";

interface TrackerControlsProps {
  status: Status;
  authed: boolean;
  error: string | null;
  message: string | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  finish: () => Promise<void>;
  reset: () => void;
}

export const TrackerControls = memo(function TrackerControls({
  status,
  authed,
  error,
  message,
  start,
  pause,
  resume,
  finish,
  reset,
}: TrackerControlsProps) {
  // Wrap async finish so React onClick receives a sync handler (no unhandled-promise lint)
  const handleFinish = () => { void finish(); };

  return (
    <div className="mt-6">

      {/* ── Idle: Start button ────────────────────────────────────────────── */}
      {status === "idle" && (
        <button
          onClick={start}
          className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-lg font-black text-ink"
        >
          ▶ Start Tracking
        </button>
      )}

      {/* ── Tracking: Pause + Finish ──────────────────────────────────────── */}
      {status === "tracking" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={pause}
            className="rounded-xl border border-white/15 bg-white/5 py-4 text-base font-bold text-white hover:bg-white/10"
          >
            ❚❚ Pause
          </button>
          <button
            onClick={handleFinish}
            className="rounded-xl bg-lime py-4 text-base font-black text-ink hover:opacity-90"
          >
            ■ Finish
          </button>
        </div>
      )}

      {/* ── Paused: Resume + Finish + Reset ──────────────────────────────── */}
      {status === "paused" && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={resume}
            className="rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-base font-black text-ink"
          >
            ▶ Resume
          </button>
          <button
            onClick={handleFinish}
            className="rounded-xl bg-lime py-4 text-base font-black text-ink hover:opacity-90"
          >
            ■ Finish
          </button>
          <button
            onClick={reset}
            className="rounded-xl border border-white/15 bg-white/5 py-4 text-base font-bold text-white"
          >
            Reset
          </button>
        </div>
      )}

      {/* ── Saving: disabled spinner button ──────────────────────────────── */}
      {status === "saving" && (
        <button
          disabled
          className="w-full rounded-xl bg-white/10 py-4 text-lg font-bold text-slate-300"
        >
          Saving activity…
        </button>
      )}

      {/* ── Done: Track Another ───────────────────────────────────────────── */}
      {status === "done" && (
        <button
          onClick={reset}
          className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-lg font-black text-ink"
        >
          Track Another
        </button>
      )}

      {/* ── Error message ─────────────────────────────────────────────────── */}
      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          {error}
        </p>
      )}

      {/* ── Info / success message ────────────────────────────────────────── */}
      {message && (
        <p className="mt-4 rounded-lg bg-mint/10 px-4 py-3 text-center text-sm text-mint">
          {message}
          {!authed && status === "done" && (
            <>
              {" "}
              <a href="/signup" className="font-bold underline">
                Create free account →
              </a>
            </>
          )}
        </p>
      )}

    </div>
  );
});
