"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  }

  if (!token) {
    return (
      <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-black text-white">Invalid link</h2>
        <p className="mt-2 text-sm text-slate-400">This reset link is missing or broken.</p>
        <Link href="/forgot-password" className="mt-6 inline-block text-sm font-semibold text-mint hover:underline">
          Request a new one
        </Link>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint/15">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-mint" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white">Password updated</h2>
        <p className="mt-2 text-sm text-slate-400">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div className="glass w-full max-w-md rounded-3xl p-8">
      <h1 className="text-3xl font-black tracking-tight text-white">Set new password</h1>
      <p className="mt-2 text-sm text-slate-400">Choose a strong password for your account.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">New password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-mint/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Confirm password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-mint/50"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-3.5 text-base font-black text-ink disabled:opacity-60"
        >
          {status === "loading" ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
