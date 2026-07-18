"use client";

import { useEffect, useState } from "react";

type SleepLog = {
  id: string;
  hours: number;
  quality: number;
  notes: string;
  slept_at: string;
};

const QUALITY_LABELS: Record<number, string> = {
  1: "Terrible", 2: "Very Bad", 3: "Bad", 4: "Poor",
  5: "Okay", 6: "Decent", 7: "Good", 8: "Great", 9: "Excellent", 10: "Perfect"
};

const QUALITY_COLORS: Record<number, string> = {
  1: "text-red-500", 2: "text-red-400", 3: "text-orange-500",
  4: "text-orange-400", 5: "text-yellow-500", 6: "text-yellow-400",
  7: "text-mint", 8: "text-mint", 9: "text-green-400", 10: "text-green-300"
};

export default function SleepClient() {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [hours, setHours] = useState("7");
  const [quality, setQuality] = useState(7);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadLogs(); }, []);

  async function loadLogs() {
    const res = await fetch("/api/sleep");
    const data = await res.json();
    if (data.logs) setLogs(data.logs);
  }

  async function logSleep() {
    if (!hours) return;
    setSaving(true);
    await fetch("/api/sleep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours: parseFloat(hours), quality, notes }),
    });
    setSaving(false);
    setSaved(true);
    setNotes("");
    setTimeout(() => setSaved(false), 2000);
    loadLogs();
  }

  const avgHours = logs.length > 0
    ? (logs.reduce((s, l) => s + l.hours, 0) / logs.length).toFixed(1)
    : 0;
  const avgQuality = logs.length > 0
    ? Math.round(logs.reduce((s, l) => s + l.quality, 0) / logs.length)
    : 0;

  const getSleepTip = (h: number) => {
    if (h < 6) return "You're severely under-sleeping. This kills muscle recovery and fat loss. Aim for at least 7 hours tonight.";
    if (h < 7) return "Slightly under target. 7-8 hours is the sweet spot for fitness progress.";
    if (h <= 9) return "You're in the optimal range. Your body is recovering and building muscle tonight.";
    return "Over 9 hours could mean you're overtrained or fighting illness. Check your recovery.";
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Sleep Tracker</h1>
        <p className="mt-1 text-slate-400">Sleep is your free supplement. Track it.</p>
      </div>

      {/* 7-day average */}
      {logs.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5 text-center">
            <p className="text-4xl font-black text-white">{avgHours}h</p>
            <p className="text-sm text-slate-400 mt-1">Avg sleep (7 days)</p>
            <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-mint to-teal"
                style={{ width: `${Math.min(100, (Number(avgHours) / 9) * 100)}%` }} />
            </div>
          </div>
          <div className="glass rounded-2xl p-5 text-center">
            <p className={`text-4xl font-black ${QUALITY_COLORS[avgQuality] || "text-white"}`}>{avgQuality}/10</p>
            <p className="text-sm text-slate-400 mt-1">Avg quality</p>
            <p className="text-xs text-slate-500 mt-1">{QUALITY_LABELS[avgQuality] || ""}</p>
          </div>
        </div>
      )}

      {/* Log sleep */}
      <div className="glass rounded-3xl p-6 space-y-5">
        <h2 className="font-bold text-white">Log Last Night's Sleep</h2>

        <div>
          <label className="text-xs text-slate-400 block mb-2">Hours slept</label>
          <div className="flex gap-2 flex-wrap">
            {["4", "5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "10"].map((h) => (
              <button key={h} onClick={() => setHours(h)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${hours === h ? "bg-mint text-ink" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}>
                {h}h
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-2">
            Sleep quality: <span className={`font-black ${QUALITY_COLORS[quality]}`}>{quality}/10 — {QUALITY_LABELS[quality]}</span>
          </label>
          <input type="range" min="1" max="10" value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-mint" />
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-2">Notes (optional)</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Woke up twice, stress from work..."
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-mint/50" />
        </div>

        {hours && (
          <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-300">
            💡 {getSleepTip(parseFloat(hours))}
          </div>
        )}

        <button onClick={logSleep} disabled={saving || !hours}
          className="w-full rounded-xl bg-gradient-to-r from-mint to-teal py-3.5 text-sm font-black text-ink disabled:opacity-60">
          {saved ? "Logged! 😴" : saving ? "Saving..." : "Log Sleep"}
        </button>
      </div>

      {/* Sleep history */}
      {logs.length > 0 && (
        <div className="glass rounded-3xl p-5">
          <h2 className="font-bold text-white mb-4">Last 7 Nights</h2>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div className="text-center w-12">
                  <p className="text-lg font-black text-white">{log.hours}h</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-mint"
                        style={{ width: `${Math.min(100, (log.hours / 9) * 100)}%` }} />
                    </div>
                    <span className={`text-xs font-bold ${QUALITY_COLORS[log.quality]}`}>
                      {log.quality}/10
                    </span>
                  </div>
                  {log.notes && <p className="text-xs text-slate-500 mt-1">{log.notes}</p>}
                </div>
                <p className="text-xs text-slate-500 flex-shrink-0">
                  {new Date(log.slept_at).toLocaleDateString("en-NG", { weekday: "short", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.length === 0 && (
        <div className="glass rounded-3xl py-12 text-center text-slate-500">
          <p className="text-3xl mb-3">😴</p>
          <p>Log your first night's sleep above.</p>
        </div>
      )}
    </div>
  );
}
