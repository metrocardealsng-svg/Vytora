import type { ActivityType } from "./types";

// ─── Stride lengths (meters per step per activity) ────────────────────────────
export const STRIDE_METERS: Record<ActivityType, number> = {
  walk: 0.762,
  run: 1.219,
  hike: 0.838,
  cycle: 0,
  treadmill: 0.914,
  gym: 0,
  yoga: 0,
  swim: 1.4,
};

// ─── Calories per mile (or per minute for time-based activities) ───────────────
export const CALORIE_RATE: Record<ActivityType, number> = {
  walk: 95,
  run: 110,
  hike: 100,
  cycle: 50,
  treadmill: 105,
  gym: 8,   // per minute
  yoga: 4,  // per minute
  swim: 130,
};

// ─── Max realistic speeds (m/s) — used to reject GPS teleports ───────────────
export const MAX_SPEED: Record<ActivityType, number> = {
  walk: 3.5,
  run: 9,
  hike: 2.5,
  cycle: 15,
  treadmill: 9,
  gym: 0.5,
  yoga: 0.2,
  swim: 3,
};

// ─── Step milestones ──────────────────────────────────────────────────────────
export const STEP_MILESTONES: { steps: number; msg: string }[] = [
  { steps: 1000,  msg: "1,000 steps! You're moving 🚶" },
  { steps: 2500,  msg: "2,500 steps! Keep it up 💪" },
  { steps: 5000,  msg: "5,000 steps! Halfway to 10K 🔥" },
  { steps: 7500,  msg: "7,500 steps! Almost there ⚡" },
  { steps: 10000, msg: "10,000 steps! Goal smashed! 🏆" },
  { steps: 15000, msg: "15,000 steps! Unstoppable! 🌟" },
  { steps: 20000, msg: "20,000 steps! Legendary! 💎" },
];

// ─── Distance milestones ──────────────────────────────────────────────────────
export const DISTANCE_MILESTONES: { meters: number; msg: string }[] = [
  { meters: 1000,  msg: "1km done! 🏃" },
  { meters: 5000,  msg: "5km! Real workout 🔥" },
  { meters: 10000, msg: "10km! Incredible 🏅" },
];

// ─── GPS watchPosition options ────────────────────────────────────────────────
export const GPS_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10000,
};

// ─── Ordered list of activities for the selector UI ──────────────────────────
export const ACTIVITIES: ActivityType[] = [
  "walk",
  "run",
  "hike",
  "cycle",
  "treadmill",
  "gym",
  "yoga",
  "swim",
];
