"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDuration, formatMiles, formatPace, haversine, metersToMiles } from "@/lib/format";
import type { LatLng } from "@/db/schema";
import RouteMap from "./RouteMap";

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "idle" | "tracking" | "paused" | "saving" | "done";
type ActivityType = "walk" | "run" | "hike" | "cycle" | "treadmill" | "gym" | "yoga" | "swim";

// ─── Constants ─────────────────────────────────────────────────────────────────
const STRIDE_METERS: Record<ActivityType, number> = {
  walk: 0.762, run: 1.219, hike: 0.838, cycle: 0,
  treadmill: 0.914, gym: 0, yoga: 0, swim: 1.4,
};

const CALORIE_RATE: Record<ActivityType, number> = {
  walk: 95, run: 110, hike: 100, cycle: 50,
  treadmill: 105, gym: 8, yoga: 4, swim: 130,
};

// Max realistic speeds in m/s per activity
const MAX_SPEED: Record<ActivityType, number> = {
  walk: 3.5, run: 9, hike: 2.5, cycle: 15,
  treadmill: 9, gym: 0.5, yoga: 0.2, swim: 3,
};

// Milestones
const STEP_MILESTONES = [
  { steps: 1000, msg: "1,000 steps! You're moving 🚶" },
  { steps: 2500, msg: "2,500 steps! Keep it up 💪" },
  { steps: 5000, msg: "5,000 steps! Halfway to 10K 🔥" },
  { steps: 7500, msg: "7,500 steps! Almost there ⚡" },
  { steps: 10000, msg: "10,000 steps! Goal smashed! 🏆" },
  { steps: 15000, msg: "15,000 steps! Unstoppable! 🌟" },
  { steps: 20000, msg: "20,000 steps! Legendary! 💎" },
];

const DISTANCE_MILESTONES = [
  { meters: 1000, msg: "1km done! 🏃" },
  { meters: 5000, msg: "5km! Real workout 🔥" },
  { meters: 10000, msg: "10km! Incredible 🏅" },
];

const GPS_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10000,
};

// ─── GPS smoother (exponential moving average) ─────────────────────────────────
function smoothLatLng(
  prev: { lat: number; lng: number } | null,
  next: { lat: number; lng: number },
  alpha = 0.6
): { lat: number; lng: number } {
  if (!prev) return next;
  return {
    lat: alpha * next.lat + (1 - alpha) * prev.lat,
    lng: alpha * next.lng + (1 - alpha) * prev.lng,
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function LiveTracker({ authed }: { authed: boolean }) {
  const router = useRouter();

  // ─ State ─
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

  // ─ Refs (never cause re-renders) ─
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);          // seconds accumulated before pauses
  const lastAcceptedRef = useRef<LatLng | null>(null); // last accepted GPS point
  const smoothedPosRef = useRef<{ lat: number; lng: number } | null>(null);
  const stationaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const achievementTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredStepsRef = useRef<Set<number>>(new Set());
  const triggeredDistRef = useRef<Set<number>>(new Set());
  const statusRef = useRef<Status>("idle"); // mirror for callbacks

  // keep statusRef in sync
  useEffect(() => { statusRef.current = status; }, [status]);

  // ─── Timer helpers ──────────────────────────────────────────────────────────
  function startTimer() {
    if (timerRef.current) return; // guard duplicate
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current) / 1000);
    }, 500);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function pauseTimer() {
    accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000;
    stopTimer();
  }

  // ─── Achievement toast ──────────────────────────────────────────────────────
  function showAchievement(msg: string) {
    setAchievement(msg);
    if (achievementTimerRef.current) clearTimeout(achievementTimerRef.current);
    achievementTimerRef.current = setTimeout(() => setAchievement(null), 4000);
  }

  // ─── GPS position handler ───────────────────────────────────────────────────
  const handlePosition = useCallback((pos: GeolocationPosition) => {
    setGpsReady(true);
    setGpsAccuracy(Math.round(pos.coords.accuracy));

    // 1. Reject inaccurate fixes
    if (pos.coords.accuracy > 20) return;

    // 2. Smooth the raw reading
    const rawLatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
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
    const maxMs = MAX_SPEED[activityType] ?? 9;

    // 4. Speed gate — reject teleports
    if (speedMs > maxMs * 1.5) return;

    // 5. Minimum movement gate — ignore sub-3m jitter
    if (distM < 3) {
      // May be stationary — start stationary timer
      if (!stationaryTimerRef.current) {
        stationaryTimerRef.current = setTimeout(() => {
          setIsStationary(true);
        }, 8000);
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
      // distance milestones
      DISTANCE_MILESTONES.forEach(({ meters, msg }) => {
        if (next >= meters && !triggeredDistRef.current.has(meters)) {
          triggeredDistRef.current.add(meters);
          showAchievement(msg);
        }
      });
      return next;
    });

    // Estimate steps from accepted distance
    const stride = STRIDE_METERS[activityType] || 0.762;
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
  }, [activityType]);

  const handleError = useCallback((err: GeolocationPositionError) => {
    if (err.code === err.PERMISSION_DENIED) {
      setError("Location permission denied. Enable location to track your route.");
    } else if (err.code === err.TIMEOUT) {
      setError("GPS signal lost. Move to an open area.");
    } else {
      setError("Unable to get location. Check that GPS is enabled.");
    }
  }, []);

  // ─── Watch / unwatch ────────────────────────────────────────────────────────
  function startWatch() {
    if (watchIdRef.current !== null) return; // already watching
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this browser.");
      return false;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition, handleError, GPS_OPTIONS
    );
    return true;
  }

  function stopWatch() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }

  // Cleanup on unmount
  useEffect(() => () => {
    stopWatch();
    stopTimer();
    if (stationaryTimerRef.current) clearTimeout(stationaryTimerRef.current);
    if (achievementTimerRef.current) clearTimeout(achievementTimerRef.current);
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────────────
  function start() {
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
  }

  function pause() {
    pauseTimer();
    lastAcceptedRef.current = null; // reset so next point re-primes
    setStatus("paused");
    setIsStationary(false);
  }

  function resume() {
    setError(null);
    startTimer();
    setStatus("tracking");
  }

  function reset() {
    stopWatch();
    stopTimer();
    if (stationaryTimerRef.current) { clearTimeout(stationaryTimerRef.current); stationaryTimerRef.current = null; }
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
    triggeredStepsRef.current.clear();
    triggeredDistRef.current.clear();
  }

  async function finish() {
    stopWatch();
    stopTimer();
    if (!authed) {
      setStatus("done");
      setMessage("Sign up free to save this activity and track your progress.");
      return;
    }
    setStatus("saving");
    const miles = metersToMiles(distanceMeters);
    const paceSecPerMile = miles > 0.01 ? elapsed / miles : 0;
    const isTimeBasedCalorie = activityType === "gym" || activityType === "yoga";
    const calories = isTimeBasedCalorie
      ? Math.round((elapsed / 60) * (CALORIE_RATE[activityType] || 95))
      : Math.round(miles * (CALORIE_RATE[activityType] || 95));

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activityType,
          title: `${activityType[0].toUpperCase()}${activityType.slice(1)} · ${formatMiles(distanceMeters)} mi`,
          distanceMeters,
          durationSeconds: Math.round(elapsed),
          steps,
          calories,
          avgPaceSecPerMile: Math.round(paceSecPerMile),
          route,
          startedAt: new Date(Date.now() - elapsed * 1000).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus("done"); setError(data.error || "Could not save."); return; }
      setStatus("done");
      setMessage("Activity saved! Redirecting…");
      setTimeout(() => { router.push("/dashboard"); router.refresh(); }, 1200);
    } catch {
      setStatus("done");
      setError("Network error while saving.");
    }
  }

  // ─── Derived values ─────────────────────────────────────────────────────────
  const active = status === "tracking";
  const miles = metersToMiles(distanceMeters);
  const paceSecPerMile = miles > 0.01 ? elapsed / miles : 0;
  const speedMph = elapsed > 0 ? (miles / (elapsed / 3600)) : 0;
  const isTimeBasedCalorie = activityType === "gym" || activityType === "yoga";
  const calories = isTimeBasedCalorie
    ? Math.round((elapsed / 60) * (CALORIE_RATE[activityType] || 95))
    : Math.round(miles * (CALORIE_RATE[activityType] || 95));

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full relative overflow-hidden">
      {/* Achievement toast */}
      {achievement && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 w-[90vw] max-w-xs px-4"
          style={{ animation: "slideDown 0.4s ease-out" }}>
          <div className="rounded-2xl bg-gradient-to-r from-mint to-teal px-5 py-4 text-center shadow-2xl shadow-mint/30">
            <p className="font-black text-ink text-sm">{achievement}</p>
          </div>
        </div>
      )}

      <div className="glass overflow-hidden rounded-3xl p-1">
        <div className="rounded-[22px] bg-gradient-to-b from-ink-soft to-[#0a0e14] p-4 sm:p-6">

          {/* Activity type selector */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex overflow-x-auto rounded-xl bg-white/5 p-1.5 gap-1 scrollbar-none flex-1"
              style={{ WebkitOverflowScrolling: "touch" }}>
              {(["walk","run","hike","cycle","treadmill","gym","yoga","swim"] as ActivityType[]).map((t) => (
                <button key={t}
                  disabled={active || status === "paused"}
                  onClick={() => setActivityType(t)}
                  className={`flex-shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors disabled:opacity-40 ${
                    activityType === t ? "bg-mint text-ink" : "text-slate-300 hover:text-white"
                  }`}>
                  {t}
                </button>
              ))}
            </div>

            {/* GPS indicator */}
            <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
              <span className={`relative flex h-2.5 w-2.5 ${active ? "" : "opacity-40"}`}>
                {active && <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"
                  style={{ animation: "ping 1.5s ease-out infinite" }} />}
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${active ? "bg-mint" : "bg-slate-500"}`} />
              </span>
              <span className="text-slate-400">
                {active
                  ? gpsAccuracy ? `±${gpsAccuracy}m` : "GPS"
                  : gpsReady ? "GPS ready" : "GPS idle"}
              </span>
            </div>
          </div>

          {/* Stationary warning */}
          {isStationary && active && (
            <div className="mb-4 rounded-xl bg-yellow-400/10 border border-yellow-400/20 px-4 py-2.5 text-center text-xs text-yellow-400">
              Auto-paused — move to resume tracking
            </div>
          )}

          {/* Primary metric */}
          <div className="text-center mb-2">
            <div className="text-6xl font-black leading-none tracking-tighter text-white sm:text-7xl">
              {formatMiles(distanceMeters)}
            </div>
            <div className="mt-1 text-sm font-semibold uppercase tracking-widest text-mint">
              Miles Covered
            </div>
          </div>

          {/* Step progress bar */}
          {(active || status === "paused") && (
            <div className="mb-4 px-1">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>{steps.toLocaleString()} steps</span>
                <span>Goal: 10,000</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-mint to-teal transition-all duration-500"
                  style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }} />
              </div>
            </div>
          )}

          {/* Map */}
          <div className="mb-4 overflow-hidden rounded-2xl"
            style={{ height: "clamp(140px, 35vw, 200px)", width: "100%" }}>
            <RouteMap route={route} active={active} />
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Steps" value={steps.toLocaleString()} highlight={steps >= 10000} />
            <Metric label="Time" value={formatDuration(elapsed)} />
            <Metric label="Pace /mi" value={formatPace(paceSecPerMile)} />
            <Metric label="Calories" value={`${calories}`} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs text-slate-400">
            <div className="rounded-lg bg-white/5 py-2">
              Speed <span className="font-bold text-white">{speedMph.toFixed(1)}</span> mph
            </div>
            <div className="rounded-lg bg-white/5 py-2">
              GPS pts <span className="font-bold text-white">{route.length}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6">
            {status === "idle" && (
              <button onClick={start}
                className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-lg font-black text-ink">
                ▶ Start Tracking
              </button>
            )}
            {status === "tracking" && (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={pause}
                  className="rounded-xl border border-white/15 bg-white/5 py-4 text-base font-bold text-white hover:bg-white/10">
                  ❚❚ Pause
                </button>
                <button onClick={finish}
                  className="rounded-xl bg-lime py-4 text-base font-black text-ink hover:opacity-90">
                  ■ Finish
                </button>
              </div>
            )}
            {status === "paused" && (
              <div className="grid grid-cols-3 gap-3">
                <button onClick={resume}
                  className="rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-base font-black text-ink">
                  ▶ Resume
                </button>
                <button onClick={finish}
                  className="rounded-xl bg-lime py-4 text-base font-black text-ink hover:opacity-90">
                  ■ Finish
                </button>
                <button onClick={reset}
                  className="rounded-xl border border-white/15 bg-white/5 py-4 text-base font-bold text-white">
                  Reset
                </button>
              </div>
            )}
            {status === "saving" && (
              <button disabled
                className="w-full rounded-xl bg-white/10 py-4 text-lg font-bold text-slate-300">
                Saving activity…
              </button>
            )}
            {status === "done" && (
              <button onClick={reset}
                className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-lg font-black text-ink">
                Track Another
              </button>
            )}
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">{error}</p>
          )}
          {message && (
            <p className="mt-4 rounded-lg bg-mint/10 px-4 py-3 text-center text-sm text-mint">
              {message}
              {!authed && status === "done" && (
                <> <a href="/signup" className="font-bold underline">Create free account →</a></>
              )}
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center transition-all ${highlight ? "bg-mint/20 ring-1 ring-mint/50" : "bg-white/5"}`}>
      <div className={`truncate text-xl font-black ${highlight ? "text-mint" : "text-white"}`}>{value}</div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}
