"use client";

import { useLiveTracker } from "./useLiveTracker";
import { TrackerHeader } from "./TrackerHeader";
import { TrackerMap } from "./TrackerMap";
import { TrackerStats } from "./TrackerStats";
import { TrackerControls } from "./TrackerControls";

interface LiveTrackerProps {
  authed: boolean;
}

export default function LiveTracker({ authed }: LiveTrackerProps) {
  const tracker = useLiveTracker(authed);

  return (
    <div className="w-full relative overflow-hidden">
      <div className="glass overflow-hidden rounded-3xl p-1">
        <div className="rounded-[22px] bg-gradient-to-b from-ink-soft to-[#0a0e14] p-4 sm:p-6">
          <TrackerHeader
            activityType={tracker.activityType}
            status={tracker.status}
            gpsReady={tracker.gpsReady}
            gpsAccuracy={tracker.gpsAccuracy}
            achievement={tracker.achievement}
            isStationary={tracker.isStationary}
            onActivityChange={tracker.setActivityType}
          />

          <TrackerMap
            route={tracker.route}
            distanceMeters={tracker.distanceMeters}
            steps={tracker.steps}
            status={tracker.status}
          />

          <TrackerStats
            steps={tracker.steps}
            calories={tracker.calories}
            elapsed={tracker.elapsed}
            pace={tracker.pace}
            speed={tracker.speed}
            routeLength={tracker.route.length}
          />

          <TrackerControls
            status={tracker.status}
            error={tracker.error}
            message={tracker.message}
            authed={authed}
            onStart={tracker.start}
            onPause={tracker.pause}
            onResume={tracker.resume}
            onFinish={tracker.finish}
            onReset={tracker.reset}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
