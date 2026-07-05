"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isSignup = mode === "signup";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="glass w-full max-w-md rounded-3xl p-8">
      <h1 className="text-3xl font-black tracking-tight text-white">
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        {isSignup
          ? "Start tracking and saving your activities in seconds."
          : "Log in to see your dashboard and progress."}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {isSignup && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Runner"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-mint/50"
            />
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-mint/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
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

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-3.5 text-base font-black text-ink disabled:opacity-60"
        >
          {loading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        {isSignup ? "Already have an account? " : "New to Vytora? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-semibold text-mint hover:underline"
        >
          {isSignup ? "Log in" : "Create one free"}
        </Link>
      </p>
      {!isSignup && (
  <p className="mt-2 text-center text-sm">
    <Link href="/forgot-password" className="text-slate-400 hover:text-mint">
      Forgot password?
    </Link>
  </p>
)}
    </div>
  );
}
