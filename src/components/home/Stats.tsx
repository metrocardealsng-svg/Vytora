"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import type { StatsResponse } from "@/app/api/stats/route";

/**
 * Stats
 *
 * Pulls REAL platform stats from /api/stats (which reads directly from
 * Supabase) then animates them counting upward when they scroll into view.
 * Shows skeleton placeholders while loading.
 */

type Stat = {
  id: string;
  target: number;
  suffix: string;
  label: string;
  decimals?: number;
};

function formatTarget(value: number): { display: number; suffix: string } {
  if (value >= 1_000_000) return { display: value / 1_000_000, suffix: "M+" };
  if (value >= 1_000) return { display: value / 1_000, suffix: "K+" };
  return { display: value, suffix: "+" };
}

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1.8, bounce: 0 });

  useEffect(() => {
    if (isInView) motionValue.set(stat.target);
  }, [isInView, motionValue, stat.target]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (!ref.current) return;
      const decimals = stat.decimals ?? 0;
      ref.current.textContent = `${latest.toFixed(decimals)}${stat.suffix}`;
    });
    return unsubscribe;
  }, [spring, stat.decimals, stat.suffix]);

  if (prefersReducedMotion) {
    return (
      <span ref={ref} className="tabular-nums">
        {stat.target.toFixed(stat.decimals ?? 0)}
        {stat.suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className="tabular-nums">
      0{stat.suffix}
    </span>
  );
}

export default function Stats() {
  const [stats, setStats] = useState<Stat[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: StatsResponse) => {
        const steps = formatTarget(data.total_steps);
        const activities = formatTarget(data.total_activities);
        setStats([
          {
            id: "steps",
            target: parseFloat(steps.display.toFixed(1)),
            suffix: steps.suffix,
            label: "Steps Tracked",
            decimals: steps.display % 1 !== 0 ? 1 : 0,
          },
          {
            id: "activities",
            target: parseFloat(activities.display.toFixed(1)),
            suffix: activities.suffix,
            label: "Activities Logged",
            decimals: activities.display % 1 !== 0 ? 1 : 0,
          },
          {
            id: "completion",
            target: data.goal_completion_rate,
            suffix: "%",
            label: "Daily Goal Completion",
          },
          {
            id: "rating",
            target: data.avg_rating,
            suffix: "★",
            label: "User Rating",
            decimals: 1,
          },
        ]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative w-full px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-[#10131B]/50 px-8 py-16 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-y-12 text-center lg:grid-cols-4 lg:gap-y-0">
          {loading || !stats
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3 px-4">
                  <div className="h-12 w-32 animate-pulse rounded-xl bg-white/10" />
                  <div className="h-4 w-24 animate-pulse rounded-lg bg-white/5" />
                </div>
              ))
            : stats.map((stat, index) => (
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
