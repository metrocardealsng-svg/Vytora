// ─── Tracker Types ────────────────────────────────────────────────────────────
// Single source of truth for all tracker-related types.
// No imports from other tracker files — keeps the dependency graph acyclic.

export type Status = "idle" | "tracking" | "paused" | "saving" | "done";

export type ActivityType =
  | "walk"
  | "run"
  | "hike"
  | "cycle"
  | "treadmill"
  | "gym"
  | "yoga"
  | "swim";
