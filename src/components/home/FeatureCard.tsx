"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

/**
 * FeatureCard
 *
 * Single glass card for the six-feature grid. Reveals on scroll with
 * a fade/slide/scale, and lifts slightly on hover. Takes an `index`
 * so FeatureGrid can stagger the reveal without each card needing to
 * know about its siblings.
 *
 * Usage:
 *   <FeatureCard
 *     index={0}
 *     icon={Footprints}
 *     title="Automatic Step Tracking"
 *     description="..."
 *   />
 */

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
};

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: (index % 3) * 0.12,
      }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#10131B]/60 p-8 backdrop-blur-xl transition-colors duration-300 hover:border-[#34E0A1]/30"
    >
      {/* Soft glow that appears on hover, anchored top-left of the card */}
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, rgba(52,224,161,0.25) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Icon className="h-5 w-5 text-[#34E0A1]" strokeWidth={2} />
        </span>

        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
