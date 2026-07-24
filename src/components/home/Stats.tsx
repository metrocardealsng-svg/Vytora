"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * Stats
 *
 * Large animated counters that count upward once the section enters
 * the viewport. Numbers are stored as raw targets with a separate
 * prefix/suffix so the spring animates a plain number, then formatting
 * is applied on render.
 *
 * Usage:
 *   <Stats />
 */

type Stat = {
  id: string;
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
  decimals?: number;
};

const STATS: Stat[] = [
  { id: "steps", target: 10, suffix: "M+", label: "Steps Tracked" },
  { id: "activities", target: 250, suffix: "K+", label: "Activities Logged" },
  { id: "completion", target: 95, suffix: "%", label: "Daily Goal Completion" },
  { id: "rating", target: 4.9, suffix: "★", label: "User Rating", decimals: 1 },
];

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1.8, bounce: 0 });

  useEffect(() => {
    if (isInView) {
      motionValue.set(prefersReducedMotion ? stat.target : stat.target);
    }
  }, [isInView, motionValue, prefersReducedMotion, stat.target]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (!ref.current) return;
      const decimals = stat.decimals ?? 0;
      ref.current.textContent = `${latest.toFixed(decimals)}${stat.suffix}`;
    });
    return unsubscribe;
  }, [spring, stat.decimals, stat.suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      0{stat.suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative w-full px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-[#10131B]/50 px-8 py-16 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-y-12 text-center lg:grid-cols-4 lg:gap-y-0">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center px-4"
            >
              <p className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
                <Counter stat={stat} />
              </p>
              <p className="mt-3 text-sm text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
