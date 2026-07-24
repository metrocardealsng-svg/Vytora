"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import PhoneMockup from "./PhoneMockup";

/**
 * Hero
 *
 * First section of the Vytora homepage. Combines:
 *   - AnimatedBackground (fixed, mounted here so it's present as soon
 *     as the hero paints — safe to mount again lower on the page only
 *     if you want a second atmosphere; otherwise mount once at the
 *     page/layout level and remove the import here)
 *   - Headline + subtitle + CTAs, staggered fade/slide entrance
 *   - PhoneMockup, the visual centerpiece with orbiting stat cards
 *
 * Note on AnimatedBackground placement: it renders as `fixed inset-0`,
 * so mounting it here is safe even though Hero itself is not the full
 * page — it will still cover the full viewport. Don't mount it again
 * in other section components.
 */

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden px-6 pb-24 pt-32 sm:px-10 lg:px-16">
      <AnimatedBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Copy column */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start text-left"
        >
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-white/60 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#34E0A1] shadow-[0_0_8px_rgba(52,224,161,0.8)]" />
            Now tracking 10M+ steps daily
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Track Every Step.
            <br />
            <span className="bg-gradient-to-r from-[#34E0A1] to-[#00D4B4] bg-clip-text text-transparent">
              Transform Every Day.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-lg leading-relaxed text-white/50"
          >
            Vytora automatically tracks your walks, runs, workouts and
            health progress while rewarding consistency.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/download"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#34E0A1] px-7 py-3.5 text-sm font-semibold text-[#05070B] shadow-[0_0_0_0_rgba(52,224,161,0.5)] transition-all duration-300 hover:shadow-[0_0_32px_4px_rgba(52,224,161,0.45)]"
            >
              Download App
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/tracker"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/10"
            >
              <Play className="h-3.5 w-3.5" />
              Start Tracking
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-14 flex items-center gap-8 text-white/40"
          >
            <div>
              <p className="text-2xl font-semibold text-white">4.9★</p>
              <p className="text-xs">App Store Rating</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-semibold text-white">250K+</p>
              <p className="text-xs">Active Members</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Phone column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="relative flex items-center justify-center"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}
