"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * AnimatedBackground
 *
 * Ambient, full-bleed background layer for the Vytora homepage.
 * Composited from three depth layers so it reads as one continuous
 * atmosphere behind every section rather than a per-section effect:
 *
 *   1. Base — near-black canvas (#05070B) with a faint radial vignette
 *   2. Blobs — slow-drifting mint/teal gradient orbs, heavily blurred
 *   3. Particles — sparse floating motes for micro-depth
 *
 * Usage: mount once, fixed behind page content.
 *
 *   <div className="relative min-h-screen bg-[#05070B]">
 *     <AnimatedBackground />
 *     <div className="relative z-10"> ...page content... </div>
 *   </div>
 *
 * Respects prefers-reduced-motion: blobs and particles freeze in place
 * (rendered once, no looping transforms) rather than being removed,
 * so the visual depth is preserved without motion.
 */

type Particle = {
  id: number;
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
};

const BLOB_COUNT = 4;
const PARTICLE_COUNT = 28;

function useParticles(count: number): Particle[] {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generated client-side only, so SSR/CSR markup never mismatches
    // on Math.random() output.
    const next = Array.from({ length: count }, (_, id) => ({
      id,
      size: 1.5 + Math.random() * 2.5,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 14 + Math.random() * 18,
      delay: Math.random() * -20,
      opacity: 0.15 + Math.random() * 0.35,
    }));
    setParticles(next);
  }, [count]);

  return particles;
}

const BLOB_CONFIG = [
  {
    className: "left-[-10%] top-[-15%] h-[38rem] w-[38rem]",
    color: "rgba(52, 224, 161, 0.28)", // mint
    x: [0, 40, -20, 0],
    y: [0, 30, 60, 0],
    duration: 26,
  },
  {
    className: "right-[-15%] top-[5%] h-[34rem] w-[34rem]",
    color: "rgba(0, 212, 180, 0.24)", // teal
    x: [0, -30, 20, 0],
    y: [0, 50, -20, 0],
    duration: 32,
  },
  {
    className: "left-[10%] bottom-[-20%] h-[30rem] w-[30rem]",
    color: "rgba(0, 212, 180, 0.18)",
    x: [0, 20, -40, 0],
    y: [0, -40, 10, 0],
    duration: 30,
  },
  {
    className: "right-[5%] bottom-[-15%] h-[26rem] w-[26rem]",
    color: "rgba(52, 224, 161, 0.16)",
    x: [0, -25, 15, 0],
    y: [0, 25, -15, 0],
    duration: 24,
  },
] as const;

export default function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();
  const particles = useParticles(PARTICLE_COUNT);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05070B]"
    >
      {/* Base vignette — keeps edges dark so blobs feel lit from within */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(16,19,27,0.6) 0%, rgba(5,7,11,1) 65%)",
        }}
      />

      {/* Layer 2: drifting gradient blobs */}
      {BLOB_CONFIG.slice(0, BLOB_COUNT).map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[110px] ${blob.className}`}
          style={{
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: blob.x,
                  y: blob.y,
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: blob.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}

      {/* Layer 3: floating particles for micro-depth */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-[#34E0A1]"
            style={{
              width: p.size,
              height: p.size,
              top: `${p.top}%`,
              left: `${p.left}%`,
              opacity: p.opacity,
            }}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, -24, 0],
                    opacity: [p.opacity, p.opacity * 1.6, p.opacity],
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
        ))}
      </div>

      {/* Fine grain overlay — keeps large blurred gradients from banding */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
