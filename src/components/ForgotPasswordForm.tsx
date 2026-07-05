"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint/15">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-mint" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-white">Check your email</h2>
        <p className="mt-2 text-sm text-slate-400">
          We sent a reset link to <span className="text-white">{email}</span>. Check your inbox and spam folder.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-mint hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="glass w-full max-w-md rounded-3xl p-8">
      <h1 className="text-3xl font-black tracking-tight text-white">Forgot password?</h1>
      <p className="mt-2 text-sm text-slate-400">
        Enter your email and we will send a reset link.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
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

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-glow w-full rounded-xl bg-gradient-to-r from-mint to-teal py-3.5 text-base font-black text-ink disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-mint hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
