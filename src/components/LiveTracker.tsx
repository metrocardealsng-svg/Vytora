"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatDuration,
  formatMiles,
  formatPace,
  haversine,
  metersToMiles,
} from "@/lib/format";
import type { LatLng } from "@/db/schema";
import RouteMap from "./RouteMap";

type Status = "idle" | "tracking" | "paused" | "saving" | "done";

// Stride length by activity type in meters
const STRIDE_BY_TYPE: Record<string, number> = {
  walk: 0.74,
  run: 1.2,
  hike: 0.85,
  cycle: 0,
  treadmill: 1.0,
  gym: 0,
  yoga: 0,
  swim: 1.5,
};

// Achievement milestones
const MILESTONES = [
  { steps: 1000, message: "1,000 steps! You're moving 🚶" },
  { steps: 2500, message: "2,500 steps! Quarter way there 💪" },
  { steps: 5000, message: "5,000 steps! Halfway to 10K 🔥" },
  { steps: 7500, message: "7,500 steps! Almost there ⚡" },
  { steps: 10000, message: "10,000 steps! Goal smashed! 🏆" },
  { steps: 15000, message: "15,000 steps! You're unstoppable! 🌟" },
  { steps: 20000, message: "20,000 steps! Legendary! 💎" },
];

const DISTANCE_MILESTONES = [
  { meters: 1000, message: "1km done! Keep going 🏃" },
  { meters: 5000, message: "5km! That's a real workout 🔥" },
  { meters: 10000, message: "10km! Incredible 🏅" },
];

export default function LiveTracker({ authed }: { authed: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [route, setRoute] = useState<LatLng[]>([]);
  const [distance, setDistance] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [gpsReady, setGpsReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<"walk" | "run" | "hike" | "cycle" | "treadmill" | "gym" | "yoga" | "swim">("walk");
  const [achievement, setAchievement] = useState<string | null>(null);
  const [stepCount, setStepCount] = useState(0);

  const watchId = useRef<number | null>(null);
  const lastPoint = useRef<LatLng | null>(null);
  const startTime = useRef<number>(0);
  const accumulated = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const achievementTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggeredMilestones = useRef<Set<number>>(new Set());
  const distanceMilestonesTriggered = useRef<Set<number>>(new Set());
  
  // Pedometer state - smoothed step counting
  const lastAccelRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const stepBufferRef = useRef<number[]>([]);
  const lastStepTimeRef = useRef<number>(0);

  const router = useRouter();

  // Use accelerometer for step counting when available
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleMotion = (e: DeviceMotionEvent) => {
      if (status !== "tracking") return;
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      
      // Smooth the readings
      stepBufferRef.current.push(magnitude);
      if (stepBufferRef.current.length > 5) stepBufferRef.current.shift();
      const avg = stepBufferRef.current.reduce((a, b) => a + b, 0) / stepBufferRef.current.length;

      const last = lastAccelRef.current;
      const now = Date.now();

      if (last) {
        const lastMag = Math.sqrt(last.x ** 2 + last.y ** 2 + last.z ** 2);
        const delta = Math.abs(avg - lastMag);
        
        // Step detected: threshold crossing + minimum time between steps (250ms = 4 steps/sec max)
        if (delta > 2.5 && now - lastStepTimeRef.current > 250) {
          lastStepTimeRef.current = now;
          setStepCount((prev) => {
            const next = prev + 1;
            checkStepMilestone(next);
            return next;
          });
        }
      }
      
      lastAccelRef.current = { x: acc.x!, y: acc.y!, z: acc.z! };
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [status]);

  function checkStepMilestone(steps: number) {
    for (const m of MILESTONES) {
      if (steps >= m.steps && !triggeredMilestones.current.has(m.steps)) {
        triggeredMilestones.current.add(m.steps);
        showAchievement(m.message);
        break;
      }
    }
  }

  function checkDistanceMilestone(meters: number) {
    for (const m of DISTANCE_MILESTONES) {
      if (meters >= m.meters && !distanceMilestonesTriggered.current.has(m.meters)) {
        distanceMilestonesTriggered.current.add(m.meters);
        showAchievement(m.message);
        break;
      }
    }
  }

  function showAchievement(msg: string) {
    setAchievement(msg);
    if (achievementTimer.current) clearTimeout(achievementTimer.current);
    achievementTimer.current = setTimeout(() => setAchievement(null), 4000);
  }

  const stopWatch = useCallback(() => {
    if (watchId.current !== null && typeof navigator !== "undefined") {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopWatch(), [stopWatch]);

  const handlePosition = useCallback((pos: GeolocationPosition) => {
    setGpsReady(true);
    const point: LatLng = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      t: Date.now(),
    };
    
    // Stricter accuracy filter for Nigeria conditions
    if (pos.coords.accuracy && pos.coords.accuracy > 35) return;

    if (lastPoint.current) {
      const d = haversine(lastPoint.current, point);
      // Tighter noise filter: ignore < 2m and unrealistic jumps > 50m
      if (d >= 2 && d < 50) {
        setDistance((prev) => {
          const next = prev + d;
          checkDistanceMilestone(next);
          return next;
        });
        setRoute((prev) => [...prev, point]);
        lastPoint.current = point;
      }
    } else {
      lastPoint.current = point;
      setRoute([point]);
    }
  }, []);

  const beginWatch = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation is not supported on this device or browser.");
      return false;
    }
    watchId.current = navigator.geolocation.watchPosition(
      handlePosition,
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied. Enable location access to track your route.");
        } else {
          setError("Unable to get your location. Make sure GPS/location is on.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
    return true;
  }, [handlePosition]);

  function start() {
    setError(null);
    setMessage(null);
    setStepCount(0);
    triggeredMilestones.current.clear();
    distanceMilestonesTriggered.current.clear();
    const ok = beginWatch();
    if (!ok) return;
    startTime.current = Date.now();
    accumulated.current = 0;
    timerRef.current = setInterval(() => {
      setElapsed(accumulated.current + (Date.now() - startTime.current) / 1000);
    }, 500);
    setStatus("tracking");
    showAchievement("GPS locked. Let's go! 🚀");
  }

  function pause() {
    stopWatch();
    accumulated.current = elapsed;
    lastPoint.current = null;
    setStatus("paused");
  }

  function resume() {
    setError(null);
    const ok = beginWatch();
    if (!ok) return;
    startTime.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(accumulated.current + (Date.now() - startTime.current) / 1000);
    }, 500);
    setStatus("tracking");
  }

  function reset() {
    stopWatch();
    setStatus("idle");
    setRoute([]);
    setDistance(0);
    setElapsed(0);
    setStepCount(0);
    lastPoint.current = null;
    accumulated.current = 0;
    triggeredMilestones.current.clear();
    distanceMilestonesTriggered.current.clear();
    setMessage(null);
    setError(null);
    setAchievement(null);
  }

  // Final step count: use accelerometer if available, fallback to GPS-based
  const strideLength = STRIDE_BY_TYPE[activityType] || 0.74;
  const gpsSteps = strideLength > 0 ? Math.round(distance / strideLength) : 0;
  const finalSteps = stepCount > 0 ? stepCount : gpsSteps;

  const miles = metersToMiles(distance);
  const calorieRate: Record<string, number> = { walk: 95, run: 110, hike: 100, cycle: 50, treadmill: 105, gym: 8, yoga: 4, swim: 130 };
  const calories = activityType === "gym" || activityType === "yoga"
    ? Math.round((elapsed / 60) * (calorieRate[activityType] || 95))
    : Math.round(miles * (calorieRate[activityType] || 95));
  const paceSecPerMile = miles > 0.01 ? elapsed / miles : 0;
  const speedMph = elapsed > 0 ? (miles / (elapsed / 3600)) : 0;

  async function finish() {
    stopWatch();
    if (!authed) {
      setStatus("done");
      setMessage("Sign up free to save this activity and track your progress.");
      return;
    }
    setStatus("saving");
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activityType,
          title: `${activityType[0].toUpperCase()}${activityType.slice(1)} • ${formatMiles(distance)} mi`,
          distanceMeters: distance,
          durationSeconds: Math.round(elapsed),
          steps: finalSteps,
          calories,
          avgPaceSecPerMile: Math.round(paceSecPerMile),
          route,
          startedAt: new Date(Date.now() - elapsed * 1000).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("done");
        setError(data.error || "Could not save activity.");
        return;
      }
      setStatus("done");
      setMessage("Activity saved! Redirecting to your dashboard…");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch {
      setStatus("done");
      setError("Network error while saving.");
    }
  }

  const active = status === "tracking";

  return (
    <div className="w-full relative overflow-hidden">
      {/* Achievement popup */}
      {achievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-xs w-full px-4"
          style={{ animation: "slideDown 0.4s ease-out" }}>
          <div className="rounded-2xl bg-gradient-to-r from-mint to-teal px-5 py-4 text-center shadow-2xl shadow-mint/30">
            <p className="font-black text-ink text-base">{achievement}</p>
          </div>
        </div>
      )}

      <div className="glass overflow-hidden rounded-3xl p-1">
        <div className="rounded-[22px] bg-gradient-to-b from-ink-soft to-[#0a0e14] p-4 sm:p-6">
          
          {/* Activity type - horizontally scrollable */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex overflow-x-auto rounded-xl bg-white/5 p-1.5 gap-1 scrollbar-none flex-1"
              style={{ WebkitOverflowScrolling: "touch" }}>
              {(["walk", "run", "hike", "cycle", "treadmill", "gym", "yoga", "swim"] as const).map((t) => (
                <button
                  key={t}
                  disabled={active || status === "paused"}
                  onClick={() => setActivityType(t)}
                  className={`flex-shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors disabled:opacity-40 ${
                    activityType === t ? "bg-mint text-ink" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium flex-shrink-0">
              <span className={`relative flex h-2.5 w-2.5 ${active ? "" : "opacity-40"}`}>
                {active && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"
                    style={{ animation: "pulse-ring 1.5s ease-out infinite" }} />
                )}
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${active ? "bg-mint" : "bg-slate-500"}`} />
              </span>
              <span className="text-slate-300">
                {active ? "Live GPS" : gpsReady ? "GPS ready" : "GPS idle"}
              </span>
            </div>
          </div>

          {/* Primary metric */}
          <div className="text-center">
            <div className="text-5xl font-black leading-none tracking-tighter text-white sm:text-7xl">
              {formatMiles(distance)}
            </div>
            <div className="mt-1 text-sm font-semibold uppercase tracking-widest text-mint">
              Miles Covered
            </div>
          </div>

          {/* Step progress bar when active */}
          {(active || status === "paused") && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>{finalSteps.toLocaleString()} steps</span>
                <span>Goal: 10,000</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-mint to-teal transition-all duration-500"
                  style={{ width: `${Math.min(100, (finalSteps / 10000) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Map */}
         <div className="my-4 overflow-hidden rounded-2xl" style={{ height: "clamp(140px, 35vw, 200px)", maxWidth: "100%", width: "100%" }}>
  <div className="relative h-full w-full overflow-hidden">
    <RouteMap route={route} active={active} />
  </div>
</div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Steps" value={finalSteps.toLocaleString()} highlight={finalSteps >= 10000} />
            <Metric label="Time" value={formatDuration(elapsed)} />
            <Metric label="Pace /mi" value={formatPace(paceSecPerMile)} />
            <Metric label="Calories" value={`${calories}`} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-center text-xs text-slate-400">
            <div className="rounded-lg bg-white/5 py-2">
              Speed <span className="font-bold text-white">{speedMph.toFixed(1)}</span> mph
            </div>
            <div className="rounded-lg bg-white/5 py-2">
              GPS points <span className="font-bold text-white">{route.length}</span>
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
                  className="rounded-xl border border-white/15 bg-white/5 py-4 text-base font-bold text-white hover:bg-white/10">
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
            <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
              {error}
            </p>
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
      `}</style>
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 text-center transition-all ${highlight ? "bg-mint/20 ring-1 ring-mint/50" : "bg-white/5"}`}>
      <div className={`truncate text-xl font-black ${highlight ? "text-mint" : "text-white"}`}>{value}</div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
    </div>
  );
}
