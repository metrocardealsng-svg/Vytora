"use client";

import { useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export default function AdminTable({ users }: { users: UserRow[] }) {
  const [search, setSearch] = useState("");

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
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((u) => (
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
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-500">No users found.</div>
        )}
      </div>
    </div>
  );
}
