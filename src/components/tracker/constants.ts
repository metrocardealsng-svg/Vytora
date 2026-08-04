import type { ActivityType } from "./types";

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

export const CALORIE_RATE: Record<ActivityType, number> = {
  walk: 95,
  run: 110,
  hike: 100,
  cycle: 50,
  treadmill: 105,
  gym: 8,
  yoga: 4,
  swim: 130,
};

// Max realistic speed in m/s per activity — used to gate GPS teleports
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

export const STEP_MILESTONES: { steps: number; msg: string }[] = [
  { steps: 1000, msg: "1,000 steps! You're moving 🚶" },
  { steps: 2500, msg: "2,500 steps! Keep it up 💪" },
  { steps: 5000, msg: "5,000 steps! Halfway to 10K 🔥" },
  { steps: 7500, msg: "7,500 steps! Almost there ⚡" },
  { steps: 10000, msg: "10,000 steps! Goal smashed! 🏆" },
  { steps: 15000, msg: "15,000 steps! Unstoppable! 🌟" },
  { steps: 20000, msg: "20,000 steps! Legendary! 💎" },
];

export const DISTANCE_MILESTONES: { meters: number; msg: string }[] = [
  { meters: 1000, msg: "1km done! 🏃" },
  { meters: 5000, msg: "5km! Real workout 🔥" },
  { meters: 10000, msg: "10km! Incredible 🏅" },
];

export const GPS_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10000,
};

// Minimum movement in meters before a GPS point is accepted (filters jitter)
// 5m is the practical minimum for phone GPS — below this is noise
export const MIN_MOVEMENT_METERS = 5;

// Seconds of no movement before stationary flag is set
export const STATIONARY_THRESHOLD_MS = 8000;

// EMA smoothing factor — lower = smoother, less jitter bleed-through
// 0.3 is enough to track real movement while killing phone-shake noise
export const GPS_ALPHA = 0.3;

// Accuracy cutoff — fixes worse than this are ignored
export const MAX_ACCURACY_METERS = 20;

// Speed gate multiplier over MAX_SPEED before a point is rejected as teleport
export const SPEED_GATE_MULTIPLIER = 1.5;

// Achievement toast duration in ms
export const ACHIEVEMENT_DURATION_MS = 4000;
