"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RouteMap from "./RouteMap";
import type { LatLng } from "@/db/schema";

type Item = {
  id: string;
  type: string;
  title: string;
  miles: string;
  duration: string;
  pace: string;
  steps: number;
  calories: number;
  date: string;
  route: LatLng[];
};

const icons: Record<string, string> = { walk: "🚶", run: "🏃", hike: "🥾" };

export default function ActivityList({ activities }: { activities: Item[] }) {
  const [items, setItems] = useState(activities);
  const [busy, setBusy] = useState<string | null>(null);
  const router = useRouter();

  async function remove(id: string) {
    setBusy(id);
    const res = await fetch(`/api/activities?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    }
    setBusy(null);
  }

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {items.map((a) => (
        <div key={a.id} className="glass overflow-hidden rounded-2xl">
          <RouteMap route={a.route} height={150} />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-white">
                  <span className="mr-1">{icons[a.type] || "🏃"}</span>
                  {a.title}
                </h3>
                <p className="text-xs text-slate-400">{a.date}</p>
              </div>
              <button
                onClick={() => remove(a.id)}
                disabled={busy === a.id}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                aria-label="Delete activity"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                </svg>
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <Cell label="Miles" value={a.miles} />
              <Cell label="Time" value={a.duration} />
              <Cell label="Pace" value={a.pace} />
              <Cell label="Steps" value={a.steps.toLocaleString()} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/5 py-2">
      <div className="truncate text-sm font-bold text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
    </div>
  );
}
