"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatMiles, metersToMiles, haversine } from "@/lib/format";
import {
  ACHIEVEMENT_DURATION_MS,
  ACTIVITIES,
  CALORIE_RATE,
  DISTANCE_MILESTONES,
  GPS_ALPHA,
  GPS_OPTIONS,
  MAX_ACCURACY_METERS,
  MAX_SPEED,
  MIN_MOVEMENT_METERS,
  SPEED_GATE_MULTIPLIER,
  STATIONARY_THRESHOLD_MS,
  STEP_MILESTONES,
  STRIDE_METERS,
} from "./constants";
import type { LatLng } from "@/db/schema";
import type { ActivityType, Status, TrackerHook } from "./types";

// ── GPS smoother (exponential moving average) ─────────────────────────────────
function smoothLatLng(
  prev: { lat: number; lng: number } | null,
  next: { lat: number; lng: number },
  alpha = GPS_ALPHA
): { lat: number; lng: number } {
  if (!prev) return next;
  return {
    lat: alpha * next.lat + (1 - alpha) * prev.lat,
    lng: alpha * next.lng + (1 - alpha) * prev.lng,
  };
}

// Re-export so other modules don't need to import constants directly
export { ACTIVITIES };

export function useLiveTracker(authed: boolean): TrackerHook {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [status, setStatus] = useState<Status>("idle");
  const [activityType, setActivityType] = useState<ActivityType>("walk");
  const [route, setRoute] = useState<LatLng[]>([]);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [steps, setSteps] = useState(0);
  const [gpsReady, setGpsReady] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<string | null>(null);
  const [isStationary, setIsStationary] = useState(false);

  // ── Refs (never trigger re-renders) ───────────────────────────────────────
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const lastAcceptedRef = useRef<LatLng | null>(null);
  const smoothedPosRef = useRef<{ lat: number; lng: number } | null>(null);
  const stationaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const achievementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredStepsRef = useRef<Set<number>>(new Set());
  const triggeredDistRef = useRef<Set<number>>(new Set());
  // Accumulates fractional steps so Math.round on tiny deltas doesn't inflate count
  const stepAccumRef = useRef<number>(0);
  // Mirror status in a ref so GPS callbacks don't capture stale closures
  const statusRef = useRef<Status>("idle");

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Also mirror activityType for the GPS callback
  const activityTypeRef = useRef<ActivityType>("walk");
  useEffect(() => {
    activityTypeRef.current = activityType;
  }, [activityType]);

  // ── Timer helpers ──────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) return; // guard duplicate
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(
        accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000
      );
    }, 500);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pauseTimer = useCallback(() => {
    accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
    stopTimer();
  }, [stopTimer]);

  // ── Achievement toast ──────────────────────────────────────────────────────
  const showAchievement = useCallback((msg: string) => {
    setAchievement(msg);
    if (achievementTimerRef.current) clearTimeout(achievementTimerRef.current);
    achievementTimerRef.current = setTimeout(
      () => setAchievement(null),
      ACHIEVEMENT_DURATION_MS
    );
  }, []);

  // ── GPS position handler ───────────────────────────────────────────────────
  const handlePosition = useCallback(
    (pos: GeolocationPosition) => {
      setGpsReady(true);
      setGpsAccuracy(Math.round(pos.coords.accuracy));

      // 1. Reject inaccurate fixes
      if (pos.coords.accuracy > MAX_ACCURACY_METERS) return;

      // 2. Smooth the raw reading
      const rawLatLng = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      const smoothed = smoothLatLng(smoothedPosRef.current, rawLatLng);
      smoothedPosRef.current = smoothed;

      // 3. Not yet tracking — just prime the smoother
      if (statusRef.current !== "tracking") return;

      const now = Date.now();
      const point: LatLng = { lat: smoothed.lat, lng: smoothed.lng, t: now };

      if (!lastAcceptedRef.current) {
        lastAcceptedRef.current = point;
        setRoute([point]);
        return;
      }

      const distM = haversine(lastAcceptedRef.current, point);
      const dtSec = (now - lastAcceptedRef.current.t) / 1000;
      if (dtSec <= 0) return;
      const speedMs = distM / dtSec;
      const maxMs = MAX_SPEED[activityTypeRef.current] ?? 9;

      // 4. Speed gate — reject teleports
      if (speedMs > maxMs * SPEED_GATE_MULTIPLIER) return;

      // 5. Minimum movement gate — ignore sub-3m jitter
      if (distM < MIN_MOVEMENT_METERS) {
        if (!stationaryTimerRef.current) {
          stationaryTimerRef.current = setTimeout(() => {
            setIsStationary(true);
          }, STATIONARY_THRESHOLD_MS);
        }
        return;
      }

      // 6. Movement confirmed — cancel stationary timer
      if (stationaryTimerRef.current) {
        clearTimeout(stationaryTimerRef.current);
        stationaryTimerRef.current = null;
      }
      setIsStationary(false);

      // 7. Accept point — update distance, route, steps
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
        // Accumulate fractional steps — only emit whole steps
        // This prevents Math.round inflating count on tiny GPS deltas
        stepAccumRef.current += distM / stride;
        const wholeSteps = Math.floor(stepAccumRef.current);
        if (wholeSteps > 0) {
          stepAccumRef.current -= wholeSteps;
          setSteps((prev) => {
            const next = prev + wholeSteps;
            STEP_MILESTONES.forEach(({ steps: threshold, msg }) => {
              if (
                next >= threshold &&
                !triggeredStepsRef.current.has(threshold)
              ) {
                triggeredStepsRef.current.add(threshold);
                showAchievement(msg);
              }
            });
            return next;
          });
        }
      }
    },
    [showAchievement]
  );

  const handleError = useCallback((err: GeolocationPositionError) => {
    if (err.code === err.PERMISSION_DENIED) {
      setError(
        "Location permission denied. Enable location to track your route."
      );
    } else if (err.code === err.TIMEOUT) {
      setError("GPS signal lost. Move to an open area.");
    } else {
      setError("Unable to get location. Check that GPS is enabled.");
    }
  }, []);

  // ── Watch / unwatch ────────────────────────────────────────────────────────
  const startWatch = useCallback((): boolean => {
    if (watchIdRef.current !== null) return true; // already watching
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this browser.");
      return false;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      GPS_OPTIONS
    );
    return true;
  }, [handlePosition, handleError]);

  const stopWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatch();
      stopTimer();
      if (stationaryTimerRef.current)
        clearTimeout(stationaryTimerRef.current);
      if (achievementTimerRef.current)
        clearTimeout(achievementTimerRef.current);
    };
  }, [stopWatch, stopTimer]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const start = useCallback(() => {
    setError(null);
    setMessage(null);
    const ok = startWatch();
    if (!ok) return;
    accumulatedRef.current = 0;
    stepAccumRef.current = 0;
    startTimer();
    triggeredStepsRef.current.clear();
    triggeredDistRef.current.clear();
    setStatus("tracking");
    showAchievement("GPS locked. Let's go! 🚀");
  }, [startWatch, startTimer, showAchievement]);

  const pause = useCallback(() => {
    pauseTimer();
    lastAcceptedRef.current = null;
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
    lastAcceptedRef.current = null;
    smoothedPosRef.current = null;
    accumulatedRef.current = 0;
    stepAccumRef.current = 0;
    triggeredStepsRef.current.clear();
    triggeredDistRef.current.clear();
  }, [stopWatch, stopTimer]);

  const finish = useCallback(async () => {
    stopWatch();
    stopTimer();

    if (!authed) {
      setStatus("done");
      setMessage(
        "Sign up free to save this activity and track your progress."
      );
      return;
    }

    setStatus("saving");

    // Capture current values from state — finish is async so we read from
    // local captures to avoid stale closure issues with setState batching
    setDistanceMeters((currentDist) => {
      setElapsed((currentElapsed) => {
        setSteps((currentSteps) => {
          setRoute((currentRoute) => {
            const miles = metersToMiles(currentDist);
            const paceSecPerMile =
              miles > 0.01 ? currentElapsed / miles : 0;
            const activity = activityTypeRef.current;
            const isTimeBased =
              activity === "gym" || activity === "yoga";
            const calories = isTimeBased
              ? Math.round(
                  (currentElapsed / 60) * (CALORIE_RATE[activity] || 95)
                )
              : Math.round(miles * (CALORIE_RATE[activity] || 95));

            const body = {
              type: activity,
              title: `${activity[0].toUpperCase()}${activity.slice(1)} · ${formatMiles(currentDist)} mi`,
              distanceMeters: currentDist,
              durationSeconds: Math.round(currentElapsed),
              steps: currentSteps,
              calories,
              avgPaceSecPerMile: Math.round(paceSecPerMile),
              route: currentRoute,
              startedAt: new Date(
                Date.now() - currentElapsed * 1000
              ).toISOString(),
            };

            fetch("/api/activities", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            })
              .then((res) =>
                res.json().then((data) => ({ ok: res.ok, data }))
              )
              .then(({ ok, data }) => {
                if (!ok) {
                  setStatus("done");
                  setError(data.error || "Could not save.");
                  return;
                }
                setStatus("done");
                setMessage("Activity saved! Redirecting…");
                setTimeout(() => {
                  router.push("/dashboard");
                  router.refresh();
                }, 1200);
              })
              .catch(() => {
                setStatus("done");
                setError("Network error while saving.");
              });

            return currentRoute;
          });
          return currentSteps;
        });
        return currentElapsed;
      });
      return currentDist;
    });
  }, [authed, stopWatch, stopTimer, router]);

  // ── Derived values (memoized) ──────────────────────────────────────────────
  const miles = useMemo(() => metersToMiles(distanceMeters), [distanceMeters]);

  const pace = useMemo(
    // Wait for 0.05mi (~80m) before showing pace — below this the number is
    // meaningless and jumps wildly on the first few GPS fixes
    () => (miles > 0.05 ? elapsed / miles : 0),
    [miles, elapsed]
  );

  const speed = useMemo(
    () => (elapsed > 0 ? miles / (elapsed / 3600) : 0),
    [miles, elapsed]
  );

  const calories = useMemo(() => {
    const isTimeBased =
      activityType === "gym" || activityType === "yoga";
    return isTimeBased
      ? Math.round((elapsed / 60) * (CALORIE_RATE[activityType] || 95))
      : Math.round(miles * (CALORIE_RATE[activityType] || 95));
  }, [activityType, elapsed, miles]);

  return {
    // state
    status,
    steps,
    distanceMeters,
    elapsed,
    route,
    achievement,
    gpsAccuracy,
    gpsReady,
    message,
    error,
    activityType,
    speed,
    pace,
    calories,
    isStationary,
    // actions
    setActivityType,
    start,
    pause,
    resume,
    finish,
    reset,
  };
}
