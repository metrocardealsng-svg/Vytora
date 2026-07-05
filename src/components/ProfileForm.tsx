"use client";

import { useEffect, useState } from "react";

type Profile = {
  name: string;
  email: string;
  plan: string;
  bio: string;
  weightKg: string;
  heightCm: string;
  fitnessGoal: string;
  location: string;
  avatarUrl: string;
  createdAt: string;
};

const GOALS = [
  { value: "general", label: "General fitness" },
  { value: "weight_loss", label: "Lose weight" },
  { value: "muscle", label: "Build muscle" },
  { value: "endurance", label: "Endurance / Running" },
  { value: "health", label: "Better health" },
];

const PLAN_COLORS: Record<string, string> = {
  free: "text-slate-400 bg-white/5",
  pro: "text-mint bg-mint/10",
  elite: "text-yellow-400 bg-yellow-400/10",
};

export default function ProfileForm({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          setProfile({
            name: d.profile.name || "",
            email: d.profile.email || userEmail,
            plan: d.profile.plan || "free",
            bio: d.profile.bio || "",
            weightKg: d.profile.weightKg ? String(d.profile.weightKg) : "",
            heightCm: d.profile.heightCm ? String(d.profile.heightCm) : "",
            fitnessGoal: d.profile.fitnessGoal || "general",
            location: d.profile.location || "",
            avatarUrl: d.profile.avatarUrl || "",
            createdAt: d.profile.createdAt || "",
          });
        }
      });
  }, [userEmail]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profile.name,
        bio: profile.bio,
        weightKg: profile.weightKg ? parseFloat(profile.weightKg) : null,
        heightCm: profile.heightCm ? parseFloat(profile.heightCm) : null,
        fitnessGoal: profile.fitnessGoal,
        location: profile.location,
        avatarUrl: profile.avatarUrl,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError("Failed to save. Try again.");
    }
  }

  function field(key: keyof Profile, value: string) {
    setProfile((p) => p ? { ...p, [key]: value } : p);
  }

  if (!profile) {
    return (
      <div className="glass rounded-3xl p-8 text-center text-slate-400 animate-pulse">
        Loading profile...
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : userEmail[0].toUpperCase();

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Avatar + plan badge */}
      <div className="glass rounded-3xl p-6 flex items-center gap-5">
        <div className="h-20 w-20 flex-shrink-0 rounded-full bg-gradient-to-br from-mint to-teal flex items-center justify-center text-2xl font-black text-ink">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
          ) : initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-white text-lg truncate">{profile.name || "No name set"}</p>
          <p className="text-slate-400 text-sm truncate">{profile.email}</p>
          <span className={`mt-1.5 inline-block rounded-full px-3 py-0.5 text-xs font-bold capitalize ${PLAN_COLORS[profile.plan] || "text-slate-400 bg-white/5"}`}>
            {profile.plan} plan
          </span>
        </div>
      </div>

      {/* Basic info */}
      <div className="glass rounded-3xl p-6 space-y-4">
        <h2 className="font-bold text-white text-sm uppercase tracking-wider">Basic Info</h2>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Display Name</label>
          <input
            value={profile.name}
            onChange={(e) => field("name", e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-mint/50"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => field("bio", e.target.value)}
            placeholder="Tell the Tribe a bit about yourself..."
            rows={3}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-mint/50 resize-none"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Location</label>
          <input
            value={profile.location}
            onChange={(e) => field("location", e.target.value)}
            placeholder="e.g. Lagos, Nigeria"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-mint/50"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Avatar URL (optional)</label>
          <input
            value={profile.avatarUrl}
            onChange={(e) => field("avatarUrl", e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-mint/50"
          />
        </div>
      </div>

      {/* Fitness stats */}
      <div className="glass rounded-3xl p-6 space-y-4">
        <h2 className="font-bold text-white text-sm uppercase tracking-wider">Fitness Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Weight (kg)</label>
            <input
              type="number"
              value={profile.weightKg}
              onChange={(e) => field("weightKg", e.target.value)}
              placeholder="70"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-mint/50"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Height (cm)</label>
            <input
              type="number"
              value={profile.heightCm}
              onChange={(e) => field("heightCm", e.target.value)}
              placeholder="170"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-mint/50"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Fitness Goal</label>
          <select
            value={profile.fitnessGoal}
            onChange={(e) => field("fitnessGoal", e.target.value)}
            className="w-full rounded-xl bg-[#0e1118] border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-mint/50"
          >
            {GOALS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-gradient-to-r from-mint to-teal py-3.5 text-base font-black text-ink disabled:opacity-60 hover:opacity-90 transition-opacity"
      >
        {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
      </button>

      {profile.createdAt && (
        <p className="text-center text-xs text-slate-600">
          Member since {new Date(profile.createdAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" })}
        </p>
      )}
    </form>
  );
}
