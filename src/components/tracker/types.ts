import type { LatLng } from "@/db/schema";

export type { LatLng };

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

export interface TrackerState {
  status: Status;
  steps: number;
  distanceMeters: number;
  elapsed: number;
  route: LatLng[];
  achievement: string | null;
  gpsAccuracy: number | null;
  gpsReady: boolean;
  message: string | null;
  error: string | null;
  activityType: ActivityType;
  speed: number;
  pace: number;
  calories: number;
  isStationary: boolean;
}

export interface TrackerActions {
  setActivityType: (t: ActivityType) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  finish: () => void;
  reset: () => void;
}

export type TrackerHook = TrackerState & TrackerActions;
