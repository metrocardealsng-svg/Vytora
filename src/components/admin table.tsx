"use client";

import { useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  plan: string;
  createdAt: Date;
};

const PLAN_COLORS: Record<string, string> = {
  free: "text-slate-400 bg-white/5",
  pro: "text-mint bg-mint/10",
  elite: "text-yellow-400 bg-yellow-400/10",
};

export default function AdminTable({ users }: { users: UserRow[] }) {
  const [plans, setPlans] = useState<Record<string, string>>(
    Object.fromEntries(users.map((u) => [u.id, u.plan]))
  );
  const [loading, setLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function upgradePlan(userId: string, newPlan: string) {
    setLoading(userId + newPlan);
    try {
      const res = await fetch("/api/admin/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan: newPlan }),
      });
      if (res.ok) {
        setPlans((prev) => ({ ...prev, [userId]: newPlan }));
      } else {
        alert("Failed to upgrade. Try again.");
      }
    } catch {
      alert("Network error.");
    }
    setLoading(null);
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass rounded-3xl overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-white/5">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-mint"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((u) => {
              const currentPlan = plans[u.id];
              return (
                <tr key={u.id} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">{u.name || "No name"}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        PLAN_COLORS[currentPlan] ?? "text-slate-400 bg-white/5"
                      }`}
                    >
                      {currentPlan}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {(["free", "pro", "elite"] as const).map((p) => (
                        <button
                          key={p}
                          disabled={currentPlan === p || loading === u.id + p}
                          onClick={() => upgradePlan(u.id, p)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors capitalize
                            ${
                              currentPlan === p
                                ? "bg-white/5 text-slate-600 cursor-not-allowed"
                                : p === "elite"
                                ? "bg-yellow-400/15 text-yellow-400 hover:bg-yellow-400/25"
                                : p === "pro"
                                ? "bg-mint/15 text-mint hover:bg-mint/25"
                                : "bg-white/10 text-slate-300 hover:bg-white/15"
                            }`}
                        >
                          {loading === u.id + p ? "..." : p}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-500">No users found.</div>
        )}
      </div>
    </div>
  );
}
