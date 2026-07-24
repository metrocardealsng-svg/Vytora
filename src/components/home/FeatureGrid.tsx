"use client";

import { motion } from "framer-motion";
import {
  Footprints,
  MapPinned,
  Trophy,
  BrainCircuit,
  Award,
  LineChart,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

/**
 * FeatureGrid
 *
 * Six-feature overview section. Each feature is a glass card
 * (FeatureCard) that reveals on scroll with a staggered delay.
 * Grid collapses to a single column on mobile, two on tablet,
 * three on desktop.
 *
 * Usage:
 *   <FeatureGrid />
 */

const FEATURES = [
  {
    icon: Footprints,
    title: "Automatic Step Tracking",
    description:
      "Vytora counts every step in the background, no manual logging, so your activity history stays complete without any effort.",
  },
  {
    icon: MapPinned,
    title: "Live GPS Routes",
    description:
      "Every run and walk is mapped in real time, with pace and elevation laid over the route so you can see exactly where you pushed hardest.",
  },
  {
    icon: Trophy,
    title: "Challenges",
    description:
      "Join weekly challenges with friends or the community and track standings as they update, live, throughout the week.",
  },
  {
    icon: BrainCircuit,
    title: "AI Health Coach",
    description:
      "Get a daily plan that adapts to your recovery, sleep, and recent effort, so you always know what today should look like.",
  },
  {
    icon: Award,
    title: "Achievements",
    description:
      "Milestones unlock automatically as you build streaks and hit personal bests, turning consistency into something worth celebrating.",
  },
  {
    icon: LineChart,
    title: "Health Analytics",
    description:
      "Steps, heart rate, and recovery trends are laid out in one dashboard so you can spot patterns across weeks and months.",
  },
] as const;

export default function FeatureGrid() {
  return (
    <section className="relative w-full px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-[#34E0A1]">
            Everything you need
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for consistency,
            <br />
            not just data.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/50">
            Vytora turns your daily activity into a running story of
            progress, without the busywork of tracking it yourself.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              index={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
