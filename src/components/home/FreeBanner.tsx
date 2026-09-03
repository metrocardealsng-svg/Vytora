"use client";

import Link from "next/link";

export default function FreeBanner() {
  return (
    <section className="border-y border-mint/20 bg-gradient-to-r from-mint/10 via-teal/10 to-mint/10 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mint to-teal p-10 text-center md:p-16">
          {/* Animated background glow */}
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white, transparent 40%)" }} />
          
          <div className="relative z-10">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
              <span className="text-sm font-black text-ink">🎉 LIMITED TIME OFFER</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
              All Features Free for 6 Months
            </h2>

            {/* Subheading */}
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-ink/80">
              No credit card required. Full access to GPS tracking, AI meal planning, Nigerian food database, community features, and everything else. Start moving today.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row items-center justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-8 py-4 text-base font-black text-white hover:bg-ink/90 transition-all shadow-lg hover:shadow-xl"
              >
                <span>✨ Start Free Today</span>
              </Link>
              <Link
                href="/tracker"
                className="inline-flex items-center gap-2 rounded-xl bg-white/30 px-8 py-4 text-base font-black text-ink backdrop-blur hover:bg-white/40 transition-all"
              >
                <span>Try Tracker Now →</span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-ink/70">
              <div className="text-center">
                <div className="text-2xl font-black">✓</div>
                <p className="text-sm font-semibold">No Payment Methods</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black">✓</div>
                <p className="text-sm font-semibold">Full Feature Access</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black">✓</div>
                <p className="text-sm font-semibold">6 Months Free</p>
              </div>
            </div>

            {/* Fine print */}
            <p className="mx-auto mt-8 max-w-lg text-xs text-ink/60">
              After 6 months, pricing will be announced. Early users get special lifetime benefits. No surprise charges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
