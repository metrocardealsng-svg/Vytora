"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatMiles, haversine, metersToMiles } from "@/lib/format";
import type { LatLng } from "@/db/schema";
import type { ActivityType, Status } from "./types";
import {
  CALORIE_RATE,
  DISTANCE_MILESTONES,
  GPS_OPTIONS,
  MAX_SPEED,
  STEP_MILESTONES,
  STRIDE_METERS,
} from "./constants";

// ─── GPS smoother (exponential moving average) ────────────────────────────────
// Module-level: pure function, no need to live inside the hook.
function smoothLatLng(
  prev: { lat: number; lng: number } | null,
  next: { lat: number; lng: number },
  alpha = 0.6,
): { lat: number; lng: number } {
  if (!prev) return next;
  return {
    lat: alpha * next.lat + (1 - alpha) * prev.lat,
    lng: alpha * next.lng + (1 - alpha) * prev.lng,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLiveTracker(authed: boolean) {
  const router = useRouter();

  // ── State ────────────────────────────────────────────────────────────────
  const [status, setStatus]               = useState<Status>("idle");
  const [activityType, setActivityType]   = useState<ActivityType>("walk");
  const [route, setRoute]                 = useState<LatLng[]>([]);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [elapsed, setElapsed]             = useState(0);
  const [steps, setSteps]                 = useState(0);
  const [gpsReady, setGpsReady]           = useState(false);
  const [gpsAccuracy, setGpsAccuracy]     = useState<number | null>(null);
  const [error, setError]                 = useState<string | null>(null);
  const [message, setMessage]             = useState<string | null>(null);
  const [achievement, setAchievement]     = useState<string | null>(null);
  const [isStationary, setIsStationary]   = useState(false);

  // ── Tracking refs (never trigger re-renders) ─────────────────────────────
  const watchIdRef          = useRef<number | null>(null);
  const timerRef            = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef        = useRef<number>(0);
  const accumulatedRef      = useRef<number>(0);
  const lastAcceptedRef     = useRef<LatLng | null>(null);
  const smoothedPosRef      = useRef<{ lat: number; lng: number } | null>(null);
  const stationaryTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const achievementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredStepsRef   = useRef<Set<number>>(new Set());
  const triggeredDistRef    = useRef<Set<number>>(new Set());

  // ── Mirror refs — give stable callbacks access to current state values ───
  // This avoids stale closures without adding state to callback deps, which
  // would cause watchPosition handlers and action callbacks to be recreated
  // on every GPS tick (defeating memo on child components).
  const statusRef          = useRef<Status>("idle");
  const activityTypeRef    = useRef<ActivityType>("walk");
  const distanceMetersRef  = useRef<number>(0);
  const elapsedRef         = useRef<number>(0);
  const stepsRef           = useRef<number>(0);
  const routeRef           = useRef<LatLng[]>([]);

  useEffect(() => { statusRef.current         = status;         }, [status]);
  useEffect(() => { activityTypeRef.current   = activityType;   }, [activityType]);
  useEffect(() => { distanceMetersRef.current = distanceMeters; }, [distanceMeters]);
  useEffect(() => { elapsedRef.current        = elapsed;        }, [elapsed]);
  useEffect(() => { stepsRef.current          = steps;          }, [steps]);
  useEffect(() => { routeRef.current          = route;          }, [route]);

  // ── Timer helpers ────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return; // guard: prevent duplicate intervals
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(
        accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000,
      );
    }, 500);
  }, []);

  const pauseTimer = useCallback(() => {
    accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
    stopTimer();
  }, [stopTimer]);

  // ── Achievement toast ────────────────────────────────────────────────────
  const showAchievement = useCallback((msg: string) => {
    setAchievement(msg);
    if (achievementTimerRef.current) clearTimeout(achievementTimerRef.current);
    achievementTimerRef.current = setTimeout(() => setAchievement(null), 4000);
  }, []);

  // ── GPS handlers ─────────────────────────────────────────────────────────
  // handlePosition reads activityType from a ref so the callback stays stable
  // across activityType changes — fixing the stale-closure bug the original had.
  const handlePosition = useCallback(
    (pos: GeolocationPosition) => {
      setGpsReady(true);
      setGpsAccuracy(Math.round(pos.coords.accuracy));

      // 1. Reject inaccurate fixes (>20m horizontal accuracy)
      if (pos.coords.accuracy > 20) return;

      // 2. Smooth raw reading with exponential moving average
      const rawLatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const smoothed = smoothLatLng(smoothedPosRef.current, rawLatLng);
      smoothedPosRef.current = smoothed;

      // 3. Not yet actively tracking — just prime the smoother
      if (statusRef.current !== "tracking") return;

      const now = Date.now();
      const point: LatLng = { lat: smoothed.lat, lng: smoothed.lng, t: now };

      if (!lastAcceptedRef.current) {
        lastAcceptedRef.current = point;
        setRoute([point]);
        return;
      }

      const distM   = haversine(lastAcceptedRef.current, point);
      const prevT   = lastAcceptedRef.current.t ?? 0;
      const dtSec   = (now - prevT) / 1000;
      if (dtSec <= 0) return;

      const speedMs = distM / dtSec;
      const maxMs   = MAX_SPEED[activityTypeRef.current] ?? 9;

      // 4. Speed gate — reject impossible teleports (allow 1.5× max for GPS drift)
      if (speedMs > maxMs * 1.5) return;

      // 5. Minimum movement gate — sub-3m is jitter, not real movement
      if (distM < 3) {
        if (!stationaryTimerRef.current) {
          stationaryTimerRef.current = setTimeout(
            () => setIsStationary(true),
            8000,
          );
        }
        return;
      }

      // 6. Real movement — cancel any pending stationary timer
      if (stationaryTimerRef.current) {
        clearTimeout(stationaryTimerRef.current);
        stationaryTimerRef.current = null;
      }
      setIsStationary(false);

      // 7. Accept point → update route, distance, steps
      lastAcceptedRef.current = point;
      setRoute((prev) => [...prev, point]);

      setDistanceMeters((prev) => {
        const next = prev + distM;
        DISTANCE_MILESTONES.forEach(({ meters, msg }) => {
          if (next >= meters && !triggeredDistRef.current.has(meters)) {
            triggeredDistRef.current.add(meters);
            showAchievement(msg);
          }
        });
        return next;
      });

      const stride = STRIDE_METERS[activityTypeRef.current] || 0.762;
      if (stride > 0) {
        const newSteps = Math.round(distM / stride);
        setSteps((prev) => {
          const next = prev + newSteps;
          STEP_MILESTONES.forEach(({ steps: threshold, msg }) => {
            if (next >= threshold && !triggeredStepsRef.current.has(threshold)) {
              triggeredStepsRef.current.add(threshold);
              showAchievement(msg);
            }
          });
          return next;
        });
      }
    },
    [showAchievement],
    // activityType intentionally read from ref — no dep needed, keeps callback stable
  );

  const handleError = useCallback((err: GeolocationPositionError) => {
    if (err.code === err.PERMISSION_DENIED) {
      setError("Location permission denied. Enable location to track your route.");
    } else if (err.code === err.TIMEOUT) {
      setError("GPS signal lost. Move to an open area.");
    } else {
      setError("Unable to get location. Check that GPS is enabled.");
    }
  }, []);

  // ── Watch / unwatch ──────────────────────────────────────────────────────
  const stopWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const startWatch = useCallback((): boolean => {
    if (watchIdRef.current !== null) return true; // guard: already watching
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this browser.");
      return false;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      GPS_OPTIONS,
    );
    return true;
  }, [handlePosition, handleError]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopWatch();
      stopTimer();
      if (stationaryTimerRef.current)  clearTimeout(stationaryTimerRef.current);
      if (achievementTimerRef.current) clearTimeout(achievementTimerRef.current);
    };
  }, [stopWatch, stopTimer]);
  // stopWatch & stopTimer are stable (empty inner deps) so this only runs on unmount

  // ── Actions ──────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    setError(null);
    setMessage(null);
    const ok = startWatch();
    if (!ok) return;
    accumulatedRef.current = 0;
    startTimer();
    triggeredStepsRef.current.clear();
    triggeredDistRef.current.clear();
    setStatus("tracking");
    showAchievement("GPS locked. Let's go! 🚀");
  }, [startWatch, startTimer, showAchievement]);

  const pause = useCallback(() => {
    pauseTimer();
    lastAcceptedRef.current = null; // reset so next accepted point re-primes the ref
    setStatus("paused");
    setIsStationary(false);
  }, [pauseTimer]);

  const resume = useCallback(() => {
    setError(null);
    startTimer();
    setStatus("tracking");
  }, [startTimer]);

  const reset = useCallback(() => {
    stopWatch();
    stopTimer();
    if (stationaryTimerRef.current) {
      clearTimeout(stationaryTimerRef.current);
      stationaryTimerRef.current = null;
    }
    setStatus("idle");
    setRoute([]);
    setDistanceMeters(0);
    setElapsed(0);
    setSteps(0);
    setIsStationary(false);
    setAchievement(null);
    setMessage(null);
    setError(null);
    lastAcceptedRef.current   = null;
    smoothedPosRef.current    = null;
    accumulatedRef.current    = 0;
    triggeredStepsRef.current.clear();
    triggeredDistRef.current.clear();
  }, [stopWatch, stopTimer]);

  // finish reads from refs so it stays stable even as distanceMeters/elapsed/steps/route
  // change every GPS tick — prevents TrackerControls from re-rendering unnecessarily.
  const finish = useCallback(async () => {
    stopWatch();
    stopTimer();

    if (!authed) {
      setStatus("done");
      setMessage("Sign up free to save this activity and track your progress.");
      return;
    }

    setStatus("saving");

    const dm = distanceMetersRef.current;
    const el = elapsedRef.current;
    const at = activityTypeRef.current;
    const st = stepsRef.current;
    const rt = routeRef.current;

    const miles          = metersToMiles(dm);
    const paceSecPerMile = miles > 0.01 ? el / miles : 0;
    const isTimeBased    = at === "gym" || at === "yoga";
    const calories       = isTimeBased
      ? Math.round((el / 60) * (CALORIE_RATE[at] || 95))
      : Math.round(miles * (CALORIE_RATE[at] || 95));

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: at,
          title: `${at[0].toUpperCase()}${at.slice(1)} · ${formatMiles(dm)} mi`,
          distanceMeters: dm,
          durationSeconds: Math.round(el),
          steps: st,
          calories,
          avgPaceSecPerMile: Math.round(paceSecPerMile),
          route: rt,
          startedAt: new Date(Date.now() - el * 1000).toISOString(),
        }),
      });

      const data: { error?: string } = await res.json();

      if (!res.ok) {
        setStatus("done");
        setError(data.error ?? "Could not save.");
        return;
      }

      setStatus("done");
      setMessage("Activity saved! Redirecting…");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch {
      setStatus("done");
      setError("Network error while saving.");
    }
  }, [stopWatch, stopTimer, authed, router]);
  // Mirror refs are not deps — they always hold current values by design

  // ── Derived values (memoized) ────────────────────────────────────────────
  const miles = useMemo(() => metersToMiles(distanceMeters), [distanceMeters]);

  const pace = useMemo(
    () => (miles > 0.01 ? elapsed / miles : 0),
    [miles, elapsed],
  );

  const speed = useMemo(
    () => (elapsed > 0 ? miles / (elapsed / 3600) : 0),
    [miles, elapsed],
  );

  const calories = useMemo(() => {
    const isTimeBased = activityType === "gym" || activityType === "yoga";
    return isTimeBased
      ? Math.round((elapsed / 60) * (CALORIE_RATE[activityType] || 95))
      : Math.round(miles * (CALORIE_RATE[activityType] || 95));
  }, [activityType, elapsed, miles]);

  // ── Public API ───────────────────────────────────────────────────────────
  return {
    // State
    status,
    activityType,
    setActivityType,
    route,
    distanceMeters,
    elapsed,
    steps,
    gpsReady,
    gpsAccuracy,
    error,
    message,
    achievement,
    isStationary,
    // Derived
    pace,
    speed,
    calories,
    // Actions
    start,
    pause,
    resume,
    finish,
    reset,
  } as const;
}

export type UseLiveTrackerReturn = ReturnType<typeof useLiveTracker>;
