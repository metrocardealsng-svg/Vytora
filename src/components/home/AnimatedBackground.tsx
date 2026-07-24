"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Particle = {
  id: number;
  size: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
};

const PARTICLE_COUNT = 28;

const BLOB_CONFIG: {
  className: string;
  color: string;
  x: number[];
  y: number[];
  duration: number;
}[] = [
  {
    className: "left-[-10%] top-[-15%] h-[38rem] w-[38rem]",
    color: "rgba(52,224,161,0.28)",
    x: [0, 40, -20, 0],
    y: [0, 30, 60, 0],
    duration: 26,
  },
  {
    className: "right-[-15%] top-[5%] h-[34rem] w-[34rem]",
    color: "rgba(0,212,180,0.24)",
    x: [0, -30, 20, 0],
    y: [0, 50, -20, 0],
    duration: 32,
  },
  {
    className: "left-[10%] bottom-[-20%] h-[30rem] w-[30rem]",
    color: "rgba(0,212,180,0.18)",
    x: [0, 20, -40, 0],
    y: [0, -40, 10, 0],
    duration: 30,
  },
  {
    className: "right-[5%] bottom-[-15%] h-[26rem] w-[26rem]",
    color: "rgba(52,224,161,0.16)",
    x: [0, -25, 15, 0],
    y: [0, 25, -15, 0],
    duration: 24,
  },
];

export default function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from(
      { length: PARTICLE_COUNT },
      (_, id) => ({
        id,
        size: 1.5 + Math.random() * 2.5,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: 14 + Math.random() * 18,
        delay: Math.random() * -20,
        opacity: 0.15 + Math.random() * 0.35,
      })
    );

    setParticles(generated);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05070B]"
    >
      {/* Base background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, rgba(52,224,161,0.08), transparent 55%), #05070B",
        }}
      />

      {/* Floating blobs */}
      {BLOB_CONFIG.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-[110px] ${blob.className}`}
          style={{
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [...blob.x],
                  y: [...blob.y],
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: blob.duration,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />
      ))}

      {/* Floating particles */}
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
                    y: [0, -25, 0],
                    opacity: [p.opacity, p.opacity * 1.5, p.opacity],
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }
            }
          />
        ))}
      </div>

      {/* Noise overlay */}
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
