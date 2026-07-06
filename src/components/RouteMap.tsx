"use client";

import { useEffect, useRef } from "react";
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const polylineRef = useRef<unknown>(null);
  const markerRef = useRef<unknown>(null);

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

      // Default center: Lagos, Nigeria
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

      if (route.length > 1) {
        const latlngs = route.map((p) => [p.lat, p.lng] as [number, number]);
        const poly = L.polyline(latlngs, {
          color: "#34e0a1",
          weight: 5,
          opacity: 0.9,
        }).addTo(map);
        polylineRef.current = poly;
        map.fitBounds(poly.getBounds(), { padding: [20, 20] });

        const pulseIcon = L.divIcon({
          className: "",
          html: `<div style="width:16px;height:16px;background:#34e0a1;border-radius:50%;border:2px solid #06080c;box-shadow:0 0 0 4px rgba(52,224,161,0.3)"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        const last = latlngs[latlngs.length - 1];
        const marker = L.marker(last, { icon: pulseIcon }).addTo(map);
        markerRef.current = marker;
      } else if (active) {
        // Show current location
        navigator.geolocation?.getCurrentPosition((pos) => {
          // @ts-ignore
          const m = mapInstanceRef.current as any;
          if (m) m.setView([pos.coords.latitude, pos.coords.longitude], 16);
        });
      }
    };

    initMap();
  }, []);

  // Update polyline and marker when route changes
  useEffect(() => {
    if (!mapInstanceRef.current || route.length < 2) return;
    // @ts-ignore
    const L = window.L;
    if (!L) return;

    const latlngs = route.map((p) => [p.lat, p.lng] as [number, number]);
    const map = mapInstanceRef.current as any;

    if (polylineRef.current) {
      (polylineRef.current as any).setLatLngs(latlngs);
    } else {
      const poly = L.polyline(latlngs, { color: "#34e0a1", weight: 5, opacity: 0.9 }).addTo(map);
      polylineRef.current = poly;
    }

    const last = latlngs[latlngs.length - 1];
    if (markerRef.current) {
      (markerRef.current as any).setLatLng(last);
    }

    map.setView(last, map.getZoom());
  }, [route]);

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
