"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";

/**
 * PricingPreview
 *
 * Two-card pricing comparison: Free and Premium. Premium is visually
 * promoted with a glowing gradient border and a "Most popular" tag,
 * matching the brief's "highlight Premium with glowing border" note.
 *
 * Usage:
 *   <PricingPreview />
 */

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to start tracking consistently.",
    features: [
      "Automatic step tracking",
      "Basic route mapping",
      "Weekly challenges",
      "7-day activity history",
    ],
    cta: "Get Started",
    href: "/signup",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$9",
    period: "/month",
    description: "Full access to coaching, analytics, and unlimited history.",
    features: [
      "Everything in Free",
      "AI Health Coach",
      "Advanced health analytics",
      "Unlimited activity history",
      "Priority support",
    ],
    cta: "Start Premium",
    href: "/signup?plan=premium",
    highlighted: true,
  },
];

export default function PricingPreview() {
  return (
    <section className="relative w-full px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-[#34E0A1]">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Start free. Upgrade when you&apos;re ready.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.12,
              }}
              className="relative"
            >
              {plan.highlighted && (
                <div
                  className="absolute -inset-[1.5px] rounded-[1.75rem] opacity-80 blur-[2px]"
                  style={{
                    background:
                      "linear-gradient(135deg, #34E0A1, #00D4B4, #34E0A1)",
                  }}
                  aria-hidden="true"
                />
              )}

              <div
                className={`relative flex h-full flex-col rounded-3xl border p-8 backdrop-blur-xl ${
                  plan.highlighted
                    ? "border-transparent bg-[#0B0E15]"
                    : "border-white/10 bg-[#10131B]/60"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-8 rounded-full bg-[#34E0A1] px-3 py-1 text-[11px] font-semibold text-[#05070B]">
                    Most popular
                  </span>
                )}

                <h3 className="text-lg font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-white/50">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-white/40">{plan.period}</span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-white/70"
                    >
                      <Check className="h-4 w-4 shrink-0 text-[#34E0A1]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-[#34E0A1] text-[#05070B] hover:shadow-[0_0_28px_2px_rgba(52,224,161,0.4)]"
                      : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
