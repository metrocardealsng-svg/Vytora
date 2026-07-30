"use client";

import { useReducedMotion, motion } from "framer-motion";

/**
 * AnimatedBackground — lightweight version
 *
 * Reduced to 3 blobs, no JS particles, no Math.random on mount.
 * Pure CSS + Framer Motion only. Renders instantly, no useEffect needed.
 */

export default function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05070B]"
    >
      {/* Blob 1 — top left, mint */}
      <motion.div
        className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ background: "rgba(52,224,161,0.22)" }}
        animate={prefersReducedMotion ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Blob 2 — top right, teal */}
      <motion.div
        className="absolute -right-32 top-10 h-[420px] w-[420px] rounded-full blur-[120px]"
        style={{ background: "rgba(0,212,180,0.18)" }}
        animate={prefersReducedMotion ? undefined : { x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Blob 3 — bottom center, mint */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full blur-[100px]"
        style={{ background: "rgba(52,224,161,0.14)" }}
        animate={prefersReducedMotion ? undefined : { y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(120% 90% at 50% 0%, rgba(5,7,11,0.3) 0%, rgba(5,7,11,0.95) 70%)",
        }}
      />
    </div>
  );
}
