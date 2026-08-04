"use client";

import { memo } from "react";
import type { Status } from "./types";

interface TrackerControlsProps {
  status: Status;
  error: string | null;
  message: string | null;
  authed: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => Promise<void>;
  onReset: () => void;
}

export const TrackerControls = memo(function TrackerControls({
  status,
  error,
  message,
  authed,
  onStart,
  onPause,
  onResume,
  onFinish,
  onReset,
}: TrackerControlsProps) {
  return (
    <div className="mt-6">
      {status === "idle" && (
        <button
          onClick={onStart}
          className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-lg font-black text-ink"
        >
          ▶ Start Tracking
        </button>
      )}

      {status === "tracking" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onPause}
            className="rounded-xl border border-white/15 bg-white/5 py-4 text-base font-bold text-white hover:bg-white/10"
          >
            ❚❚ Pause
          </button>
          <button
            onClick={onFinish}
            className="rounded-xl bg-lime py-4 text-base font-black text-ink hover:opacity-90"
          >
            ■ Finish
          </button>
        </div>
      )}

      {status === "paused" && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={onResume}
            className="rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-base font-black text-ink"
          >
            ▶ Resume
          </button>
          <button
            onClick={onFinish}
            className="rounded-xl bg-lime py-4 text-base font-black text-ink hover:opacity-90"
          >
            ■ Finish
          </button>
          <button
            onClick={onReset}
            className="rounded-xl border border-white/15 bg-white/5 py-4 text-base font-bold text-white"
          >
            Reset
          </button>
        </div>
      )}

      {status === "saving" && (
        <button
          disabled
          className="w-full rounded-xl bg-white/10 py-4 text-lg font-bold text-slate-300"
        >
          Saving activity…
        </button>
      )}

      {status === "done" && (
        <button
          onClick={onReset}
          className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-lg font-black text-ink"
        >
          Track Another
        </button>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          {error}
        </p>
      )}

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
