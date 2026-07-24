"use client";

import { useLiveTracker } from "./useLiveTracker";
import { TrackerHeader }  from "./TrackerHeader";
import { TrackerMap }     from "./TrackerMap";
import { TrackerStats }   from "./TrackerStats";
import { TrackerControls } from "./TrackerControls";

// ─── LiveTracker ──────────────────────────────────────────────────────────────
// Pure layout orchestrator.
// All business logic lives in useLiveTracker.
// All UI sections live in their respective sub-components.
// This file intentionally contains no state, effects, refs, or callbacks.

interface LiveTrackerProps {
  authed: boolean;
}

export default function LiveTracker({ authed }: LiveTrackerProps) {
  const tracker = useLiveTracker(authed);

  return (
    <div className="w-full relative overflow-hidden">
      <div className="glass overflow-hidden rounded-3xl p-1">
        <div className="rounded-[22px] bg-gradient-to-b from-ink-soft to-[#0a0e14] p-4 sm:p-6">

          {/* Activity selector · GPS indicator · Achievement toast · Stationary warning */}
          <TrackerHeader
            activityType={tracker.activityType}
            setActivityType={tracker.setActivityType}
            status={tracker.status}
            gpsAccuracy={tracker.gpsAccuracy}
            gpsReady={tracker.gpsReady}
            achievement={tracker.achievement}
            isStationary={tracker.isStationary}
          />

          {/* Distance display · Step progress bar · Route map */}
          <TrackerMap
            distanceMeters={tracker.distanceMeters}
            steps={tracker.steps}
            route={tracker.route}
            status={tracker.status}
          />

          {/* Steps · Time · Pace · Calories · Speed · GPS points */}
          <TrackerStats
            steps={tracker.steps}
            elapsed={tracker.elapsed}
            pace={tracker.pace}
            calories={tracker.calories}
            speed={tracker.speed}
            gpsPoints={tracker.route.length}
          />

          {/* Start · Pause · Resume · Finish · Reset · Error · Message */}
          <TrackerControls
            status={tracker.status}
            authed={authed}
            error={tracker.error}
            message={tracker.message}
            start={tracker.start}
            pause={tracker.pause}
            resume={tracker.resume}
            finish={tracker.finish}
            reset={tracker.reset}
          />

        </div>
      </div>
    </div>
  );
}
