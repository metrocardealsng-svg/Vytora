"use client";

import { useEffect, useRef } from "react";
import type { LatLng } from "@/db/schema";

export default function RouteMap({
  route,
  active = false,
  height = 220,
  accuracyMeters = null,
}: {
  route: LatLng[];
  active?: boolean;
  height?: number;
  accuracyMeters?: number | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const polylineRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);
  const accuracyCircleRef = useRef<unknown>(null);

  // Live-position marker + accuracy ring (Nike/Strava-style: a translucent
  // circle around the dot sized to the device's actual GPS accuracy, so
  // precision is visible, not just claimed) — shown even before the route
  // has enough points to draw a polyline.
  function ensureMarker(L: any, map: any, pos: [number, number]) {
    if (markerRef.current) {
      (markerRef.current as any).setLatLng(pos);
    } else {
      const pulseIcon = L.divIcon({
        className: "",
        html: `<div style="width:16px;height:16px;background:#34e0a1;border-radius:50%;border:2px solid #06080c;box-shadow:0 0 0 4px rgba(52,224,161,0.3)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      markerRef.current = L.marker(pos, { icon: pulseIcon, zIndexOffset: 1000 }).addTo(map);
    }

    const radius = accuracyMeters ?? 20;
    if (accuracyCircleRef.current) {
      (accuracyCircleRef.current as any).setLatLng(pos);
      (accuracyCircleRef.current as any).setRadius(radius);
    } else {
      accuracyCircleRef.current = L.circle(pos, {
        radius,
        color: "#34e0a1",
        weight: 1,
        opacity: 0.35,
        fillColor: "#34e0a1",
        fillOpacity: 0.12,
      }).addTo(map);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    // Dynamically load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    // Dynamically load Leaflet JS
    const initMap = async () => {
      // @ts-ignore
      if (!window.L) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      // @ts-ignore
      const L = window.L;
      if (mapInstanceRef.current) return;

      // Default center: Lagos, Nigeria — only used until a real fix comes in
      const defaultCenter: [number, number] = [6.5244, 3.3792];
      const center: [number, number] = route.length > 0
        ? [route[route.length - 1].lat, route[route.length - 1].lng]
        : defaultCenter;

      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView(center, route.length > 1 ? 16 : 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      if (route.length >= 1) {
        const latlngs = route.map((p) => [p.lat, p.lng] as [number, number]);
        if (route.length > 1) {
          const poly = L.polyline(latlngs, {
            color: "#34e0a1",
            weight: 5,
            opacity: 0.9,
          }).addTo(map);
          polylineRef.current = poly;
          map.fitBounds(poly.getBounds(), { padding: [20, 20] });
        }
        ensureMarker(L, map, latlngs[latlngs.length - 1]);
      }
    };

    initMap();
  }, []);

  // As soon as tracking goes active, snap to the device's real position
  // immediately instead of waiting on the default Lagos center or for
  // enough GPS points to accumulate a route.
  useEffect(() => {
    if (!active || route.length > 0 || !navigator.geolocation) return;
    let cancelled = false;
    navigator.geolocation.getCurrentPosition((pos) => {
      if (cancelled) return;
      const map = mapInstanceRef.current as any;
      // @ts-ignore
      const L = window.L;
      if (!map || !L) return;
      const here: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      map.setView(here, 16);
      ensureMarker(L, map, here);
    });
    return () => {
      cancelled = true;
    };
  }, [active, route.length]);

  // Update polyline and marker when route changes
  useEffect(() => {
    if (!mapInstanceRef.current || route.length === 0) return;
    // @ts-ignore
    const L = window.L;
    if (!L) return;

    const latlngs = route.map((p) => [p.lat, p.lng] as [number, number]);
    const map = mapInstanceRef.current as any;
    const last = latlngs[latlngs.length - 1];

    if (route.length > 1) {
      if (polylineRef.current) {
        (polylineRef.current as any).setLatLngs(latlngs);
      } else {
        const poly = L.polyline(latlngs, { color: "#34e0a1", weight: 5, opacity: 0.9 }).addTo(map);
        polylineRef.current = poly;
      }
    }

    ensureMarker(L, map, last);
    map.setView(last, map.getZoom());
  }, [route]);

  // A fresh, more (or less) accurate GPS fix can arrive without the route
  // gaining a point (e.g. rejected by the movement gate) — keep the ring
  // current regardless.
  useEffect(() => {
    if (!accuracyCircleRef.current || accuracyMeters == null) return;
    (accuracyCircleRef.current as any).setRadius(accuracyMeters);
  }, [accuracyMeters]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-white/10"
      style={{ height }}
    >
      <div ref={mapRef} className="h-full w-full" style={{ background: "#080b11" }} />
      {route.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="rounded-xl bg-black/60 px-4 py-3 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" className="mx-auto mb-1.5 h-7 w-7 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
              <circle cx="12" cy="11" r="2" />
            </svg>
            <p className="text-sm text-slate-400">
              {active ? "Acquiring GPS signal..." : "Start tracking to see your route"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
