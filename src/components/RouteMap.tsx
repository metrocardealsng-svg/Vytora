"use client";

import { useMemo } from "react";
import type { LatLng } from "@/db/schema";

export default function RouteMap({
  route,
  active = false,
  height = 220,
}: {
  route: LatLng[];
  active?: boolean;
  height?: number;
}) {
  const W = 600;
  const H = 300;
  const pad = 24;

  const { path, points, hasData } = useMemo(() => {
    if (route.length < 2) {
      return { path: "", points: [] as { x: number; y: number }[], hasData: false };
    }
    const lats = route.map((r) => r.lat);
    const lngs = route.map((r) => r.lng);
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);
    let minLng = Math.min(...lngs);
    let maxLng = Math.max(...lngs);

    // Keep aspect ratio sensible; avoid divide-by-zero
    const latSpan = Math.max(maxLat - minLat, 0.00015);
    const lngSpan = Math.max(maxLng - minLng, 0.00015);
    const pad2 = 0.15;
    minLat -= latSpan * pad2;
    maxLat += latSpan * pad2;
    minLng -= lngSpan * pad2;
    maxLng += lngSpan * pad2;

    const project = (p: LatLng) => {
      const x = pad + ((p.lng - minLng) / (maxLng - minLng)) * (W - pad * 2);
      // invert y (north up)
      const y = pad + (1 - (p.lat - minLat) / (maxLat - minLat)) * (H - pad * 2);
      return { x, y };
    };

    const pts = route.map(project);
    const d = pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");
    return { path: d, points: pts, hasData: true };
  }, [route]);

  const last = points[points.length - 1];
  const first = points[0];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#080b11]"
      style={{ height }}
    >
      {/* grid background */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34e0a1" />
            <stop offset="100%" stopColor="#c8ff5a" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />

        {hasData ? (
          <>
            <path
              d={path}
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {first && (
              <circle cx={first.x} cy={first.y} r="6" fill="#c8ff5a" stroke="#06080c" strokeWidth="2" />
            )}
            {last && (
              <>
                {active && (
                  <circle cx={last.x} cy={last.y} r="12" fill="#34e0a1" opacity="0.25">
                    <animate attributeName="r" from="8" to="18" dur="1.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="1.4s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={last.x} cy={last.y} r="6" fill="#34e0a1" stroke="#06080c" strokeWidth="2" />
              </>
            )}
          </>
        ) : null}
      </svg>

      {!hasData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <svg viewBox="0 0 24 24" className="mb-2 h-9 w-9 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
            <circle cx="12" cy="11" r="2" />
          </svg>
          <p className="text-sm font-medium text-slate-500">
            {active ? "Acquiring GPS signal…" : "Your route will appear here"}
          </p>
        </div>
      )}
    </div>
  );
}
