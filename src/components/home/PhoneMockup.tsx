"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Flame, Footprints, Heart, MapPin, Zap } from "lucide-react";

/**
 * PhoneMockup
 *
 * The hero's centerpiece: a glowing iPhone-shaped frame with a live
 * Vytora tracker screen inside it, orbited by floating stat cards.
 * Tilts subtly toward the cursor (desktop only, disabled on touch /
 * reduced-motion) to sell the "premium, physical object" feel the
 * brief asks for.
 *
 * Usage (inside Hero.tsx):
 *
 *   <div className="relative flex items-center justify-center">
 *     <PhoneMockup />
 *   </div>
 *
 * Stat cards are positioned with absolute % offsets around the phone
 * so the whole cluster scales together at different breakpoints.
 */

type Stat = {
  id: string;
  label: string;
  value: string;
  icon: typeof Flame;
  className: string;
  delay: number;
};

const STATS: Stat[] = [
  {
    id: "distance",
    label: "Distance",
    value: "8.4 km",
    icon: MapPin,
    className: "left-[-8%] top-[12%] md:left-[-14%]",
    delay: 0.2,
  },
  {
    id: "calories",
    label: "Calories",
    value: "612 kcal",
    icon: Flame,
    className: "right-[-6%] top-[6%] md:right-[-12%]",
    delay: 0.4,
  },
  {
    id: "steps",
    label: "Steps",
    value: "12,204",
    icon: Footprints,
    className: "left-[-12%] bottom-[22%] md:left-[-18%]",
    delay: 0.6,
  },
  {
    id: "heart",
    label: "Heart Rate",
    value: "128 bpm",
    icon: Heart,
    className: "right-[-8%] bottom-[30%] md:right-[-14%]",
    delay: 0.8,
  },
  {
    id: "xp",
    label: "XP Earned",
    value: "+340",
    icon: Zap,
    className: "left-[50%] bottom-[-6%] -translate-x-1/2",
    delay: 1.0,
  },
];

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <motion.div
      className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#10131B]/80 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl ${stat.className}`}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: stat.delay, duration: 0.7, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#34E0A1]/10">
        <Icon className="h-4 w-4 text-[#34E0A1]" strokeWidth={2.25} />
      </span>
      <div className="leading-tight">
        <p className="text-[11px] font-medium uppercase tracking-wide text-white/50">
          {stat.label}
        </p>
        <p className="text-sm font-semibold text-white">{stat.value}</p>
      </div>
    </motion.div>
  );
}

export default function PhoneMockup() {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Raw cursor offset from center, normalized to [-1, 1]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 20, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-1, 1], [8, -8]);
  const rotateY = useTransform(springX, [-1, 1], [-10, 10]);
  const glowX = useTransform(springX, [-1, 1], ["35%", "65%"]);
  const glowY = useTransform(springY, [-1, 1], ["35%", "65%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 -> 1
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x * 2 - 1);
    mouseY.set(y * 2 - 1);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex h-[520px] w-[280px] items-center justify-center [perspective:1200px] sm:h-[600px] sm:w-[320px]"
    >
      {/* Glow behind the phone, follows cursor */}
      <motion.div
        className="absolute -z-10 h-[120%] w-[120%] rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(52,224,161,0.35) 0%, rgba(0,212,180,0.18) 45%, transparent 70%)",
          left: prefersReducedMotion ? "50%" : glowX,
          top: prefersReducedMotion ? "50%" : glowY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Phone frame with parallax tilt */}
      <motion.div
        className="relative h-full w-full rounded-[2.75rem] border border-white/10 bg-[#0B0E15] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.55)] [transform-style:preserve-3d]"
        style={
          prefersReducedMotion
            ? undefined
            : {
                rotateX,
                rotateY,
              }
        }
      >
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] bg-gradient-to-b from-[#10131B] to-[#05070B]">
          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-black/80" />

          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-4 text-[10px] font-medium text-white/40">
            <span>9:41</span>
            <span className="text-[#34E0A1]">Vytora</span>
          </div>

          {/* Fake live tracker preview */}
          <div className="mt-6 flex h-[70%] flex-col justify-between px-5 pb-6">
            <div>
              <p className="text-xs text-white/40">Today&apos;s Activity</p>
              <p className="mt-1 text-3xl font-semibold text-white">
                12,204 <span className="text-sm font-normal text-white/40">steps</span>
              </p>
            </div>

            {/* Fake route line */}
            <svg
              viewBox="0 0 220 90"
              className="my-4 w-full text-[#34E0A1]"
              fill="none"
            >
              <path
                d="M4 70 C 40 20, 70 85, 110 40 S 180 10, 216 30"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.85"
              />
            </svg>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Cal", value: "612" },
                { label: "Km", value: "8.4" },
                { label: "Min", value: "54" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/5 bg-white/5 py-2 text-center"
                >
                  <p className="text-sm font-semibold text-white">{s.value}</p>
                  <p className="text-[10px] text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating stat cards, orbiting the frame */}
      {STATS.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
