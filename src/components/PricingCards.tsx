"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = {
  id: string;
  name: string;
  priceLabel: string;
  price: number;
  tagline: string;
  features: string[];
};

export default function PricingCards({
  plans,
  authed,
}: {
  plans: Plan[];
  authed: boolean;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function choose(planId: string) {
    setError(null);
    if (planId === "free") {
      router.push(authed ? "/dashboard" : "/signup");
      return;
    }
    if (!authed) {
      router.push("/signup");
      return;
    }
    setLoading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start checkout.");
        setLoading(null);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(null);
    }
  }

  return (
    <>
      {error && (
        <p className="mx-auto mb-6 max-w-md rounded-lg bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
          {error}
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((p) => {
          const featured = p.id === "pro";
          return (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-3xl p-8 ${
                featured
                  ? "bg-gradient-to-b from-mint/15 to-teal/5 ring-2 ring-mint"
                  : "glass"
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-mint to-teal px-4 py-1 text-xs font-black text-ink">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-white">{p.priceLabel}</span>
                {p.price > 0 && <span className="mb-1.5 text-slate-400">/mo</span>}
              </div>
              <button
                onClick={() => choose(p.id)}
                disabled={loading === p.id}
                className={`mt-6 w-full rounded-xl py-3.5 text-base font-black transition-colors disabled:opacity-60 ${
                  featured
                    ? "btn-glow bg-gradient-to-r from-mint to-teal text-ink"
                    : "border border-white/15 text-white hover:bg-white/5"
                }`}
              >
                {loading === p.id
                  ? "Redirecting…"
                  : p.id === "free"
                  ? "Get started"
                  : "Upgrade now"}
              </button>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
