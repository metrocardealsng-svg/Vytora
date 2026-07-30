"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

type StatsData = {
  total_steps: number;
  total_activities: number;
  goal_completion_rate: number;
  avg_rating: number;
  total_users: number;
};

type Stat = {
  id: string;
  target: number;
  suffix: string;
  label: string;
  decimals?: number;
};

function formatTarget(value: number): { display: number; suffix: string } {
  if (value >= 1_000_000) return { display: parseFloat((value / 1_000_000).toFixed(1)), suffix: "M+" };
  if (value >= 1_000) return { display: parseFloat((value / 1_000).toFixed(1)), suffix: "K+" };
  return { display: value, suffix: "+" };
}

function buildStats(data: StatsData): Stat[] {
  const steps = formatTarget(data.total_steps);
  const activities = formatTarget(data.total_activities);
  return [
    { id: "steps", target: steps.display, suffix: steps.suffix, label: "Steps Tracked", decimals: steps.display % 1 !== 0 ? 1 : 0 },
    { id: "activities", target: activities.display, suffix: activities.suffix, label: "Activities Logged", decimals: activities.display % 1 !== 0 ? 1 : 0 },
    { id: "completion", target: data.goal_completion_rate, suffix: "%", label: "Daily Goal Completion" },
    { id: "rating", target: data.avg_rating, suffix: "★", label: "User Rating", decimals: 1 },
  ];
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
      ref.current.textContent = `${latest.toFixed(stat.decimals ?? 0)}${stat.suffix}`;
    });
    return unsubscribe;
  }, [spring, stat.decimals, stat.suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefersReducedMotion ? `${stat.target.toFixed(stat.decimals ?? 0)}${stat.suffix}` : `0${stat.suffix}`}
    </span>
  );
}

export default function Stats({ initialData }: { initialData?: StatsData | null }) {
  const [stats, setStats] = useState<Stat[] | null>(
    initialData ? buildStats(initialData) : null
  );

  useEffect(() => {
    if (initialData) return; // already have server data
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: StatsData) => setStats(buildStats(data)))
      .catch(console.error);
  }, [initialData]);

  return (
    <section className="relative w-full px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-[#10131B]/50 px-8 py-16 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-y-12 text-center lg:grid-cols-4 lg:gap-y-0">
          {!stats
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
