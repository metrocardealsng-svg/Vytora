"use client";

import { memo } from "react";
import { formatMiles } from "@/lib/format";
import RouteMap from "@/components/RouteMap";
import type { LatLng } from "@/db/schema";
import type { Status } from "./types";

interface TrackerMapProps {
  route: LatLng[];
  distanceMeters: number;
  steps: number;
  status: Status;
}

export const TrackerMap = memo(function TrackerMap({
  route,
  distanceMeters,
  steps,
  status,
}: TrackerMapProps) {
  const active = status === "tracking";
  const inProgress = active || status === "paused";
  const stepPercent = Math.min(100, (steps / 10000) * 100);

  return (
    <>
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
      {inProgress && (
        <div className="mb-4 px-1">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>{steps.toLocaleString()} steps</span>
            <span>Goal: 10,000</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-mint to-teal transition-all duration-500"
              style={{ width: `${stepPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Route map */}
      <div
        className="mb-4 overflow-hidden rounded-2xl"
        style={{ height: "clamp(140px, 35vw, 200px)", width: "100%" }}
      >
        <RouteMap route={route} active={active} />
      </div>
    </>
  );
});
