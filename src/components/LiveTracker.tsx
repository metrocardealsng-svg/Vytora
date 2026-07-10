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

const STRIDE_METERS = 0.74;

export default function LiveTracker({ authed }: { authed: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [route, setRoute] = useState<LatLng[]>([]);
  const [distance, setDistance] = useState(0); // meters
  const [elapsed, setElapsed] = useState(0); // seconds
  const [error, setError] = useState<string | null>(null);
  const [gpsReady, setGpsReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [activityType, setActivityType] = useState<"walk" | "run" | "hike" | "cycle" | "treadmill" | "gym" | "yoga" | "swim">("walk");

  const watchId = useRef<number | null>(null);
  const lastPoint = useRef<LatLng | null>(null);
  const startTime = useRef<number>(0);
  const accumulated = useRef<number>(0); // seconds from previous segments
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const steps = Math.round(distance / STRIDE_METERS);
  const miles = metersToMiles(distance);
  const calorieRate: Record<string, number> = { walk: 95, run: 110, hike: 100, cycle: 50, treadmill: 105, gym: 8, yoga: 4, swim: 130 };
  const calories = activityType === "gym" || activityType === "yoga"
    ? Math.round((elapsed / 60) * (calorieRate[activityType] || 95))
    : Math.round(miles * (calorieRate[activityType] || 95));
  const paceSecPerMile = miles > 0.01 ? elapsed / miles : 0;
  const speedMph = elapsed > 0 ? (miles / (elapsed / 3600)) : 0;

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
    // Filter out jittery low-accuracy points.
    if (pos.coords.accuracy && pos.coords.accuracy > 45) return;

    if (lastPoint.current) {
      const d = haversine(lastPoint.current, point);
      // ignore tiny GPS noise (< 1.2m) and unrealistic jumps (> 60m/sample)
      if (d >= 1.2 && d < 80) {
        setDistance((prev) => prev + d);
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
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 }
    );
    return true;
  }, [handlePosition]);

  function start() {
    setError(null);
    setMessage(null);
    const ok = beginWatch();
    if (!ok) return;
    startTime.current = Date.now();
    accumulated.current = 0;
    timerRef.current = setInterval(() => {
      setElapsed(accumulated.current + (Date.now() - startTime.current) / 1000);
    }, 500);
    setStatus("tracking");
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
    lastPoint.current = null;
    accumulated.current = 0;
    setMessage(null);
    setError(null);
  }

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
          steps,
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
    <div className="w-full">
      <div className="glass overflow-hidden rounded-3xl p-1">
       <div className="rounded-[22px] bg-gradient-to-b from-ink-soft to-[#0a0e14] p-4 sm:p-6">
          {/* Type selector */}
          <div className="mb-6 flex items-center justify-between gap-3">
           <div className="flex flex-wrap gap-2 rounded-xl bg-white/5 p-2">
              {(["walk", "run", "hike", "cycle", "treadmill", "gym", "yoga", "swim"] as const).map((t) => (
                <button
                  key={t}
                  disabled={active || status === "paused"}
                  onClick={() => setActivityType(t)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors disabled:opacity-40 ${
                    activityType === t ? "bg-mint text-ink" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <span
                className={`relative flex h-2.5 w-2.5 ${active ? "" : "opacity-40"}`}
              >
                {active && (
                  <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" style={{ animation: "pulse-ring 1.5s ease-out infinite" }} />
                )}
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${active ? "bg-mint" : "bg-slate-500"}`} />
              </span>
              <span className="text-slate-300">
                {active ? "Live GPS" : gpsReady ? "GPS ready" : "GPS idle"}
              </span>
            </div>
          </div>

          {/* Primary metric: distance */}
          <div className="text-center">
            <div className="text-5xl font-black leading-none tracking-tighter text-white sm:text-7xl">
              {formatMiles(distance)}l
            </div>
            <div className="mt-1 text-sm font-semibold uppercase tracking-widest text-mint">
              Miles Covered
            </div>
          </div>

          {/* Map */}
       <div className="my-6 h-56 overflow-hidden rounded-2xl">
          <RouteMap route={route} active={active} />
       </div>
    

          {/* Secondary metrics */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Steps" value={steps.toLocaleString()} />
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
              <button
                onClick={start}
                className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-lg font-black text-ink"
              >
                ▶ Start Tracking
              </button>
            )}
            {status === "tracking" && (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={pause} className="rounded-xl border border-white/15 bg-white/5 py-4 text-base font-bold text-white hover:bg-white/10">
                  ❚❚ Pause
                </button>
                <button onClick={finish} className="rounded-xl bg-lime py-4 text-base font-black text-ink hover:opacity-90">
                  ■ Finish
                </button>
              </div>
            )}
            {status === "paused" && (
              <div className="grid grid-cols-3 gap-3">
                <button onClick={resume} className="rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-base font-black text-ink">
                  ▶ Resume
                </button>
                <button onClick={finish} className="rounded-xl bg-lime py-4 text-base font-black text-ink hover:opacity-90">
                  ■ Finish
                </button>
                <button onClick={reset} className="rounded-xl border border-white/15 bg-white/5 py-4 text-base font-bold text-white hover:bg-white/10">
                  Reset
                </button>
              </div>
            )}
            {status === "saving" && (
              <button disabled className="w-full rounded-xl bg-white/10 py-4 text-lg font-bold text-slate-300">
                Saving activity…
              </button>
            )}
            {status === "done" && (
              <button onClick={reset} className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-4 text-lg font-black text-ink">
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
                <>
                  {" "}
                  <a href="/signup" className="font-bold underline">Create free account →</a>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3 text-center">
      <div className="truncate text-xl font-black text-white">{value}</div>
      <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </div>
    </div>
  );
}
