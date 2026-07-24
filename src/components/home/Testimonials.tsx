"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

/**
 * Testimonials
 *
 * Three premium glass cards with profile photos, quotes, and a
 * star rating. Staggered fade/slide entrance on scroll.
 *
 * Swap the `avatar` paths for real assets in /public/testimonials/.
 * Placeholders here point at /public/testimonials/{1,2,3}.jpg —
 * add real photos before shipping, or swap for a generated avatar
 * service if you don't have real ones yet.
 *
 * Usage:
 *   <Testimonials />
 */

type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Maya Chen",
    role: "Marathon runner",
    quote:
      "The route mapping is the most accurate I've used, and the weekly challenges keep me honest even on recovery weeks.",
    avatar: "/testimonials/1.jpg",
    rating: 5,
  },
  {
    id: "t2",
    name: "Daniel Osei",
    role: "Strength & conditioning coach",
    quote:
      "I recommend Vytora to every client now. The AI coach actually adjusts to how their week is going instead of pushing a fixed plan.",
    avatar: "/testimonials/2.jpg",
    rating: 5,
  },
  {
    id: "t3",
    name: "Priya Nair",
    role: "Early riser, daily walker",
    quote:
      "Simple things done well — steps, streaks, and a dashboard that actually makes me want to check it every morning.",
    avatar: "/testimonials/3.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
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
            Loved by the community
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Real progress, from real people.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.12,
              }}
              whileHover={{ y: -6 }}
              className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#10131B]/60 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            >
              <div>
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#34E0A1] text-[#34E0A1]"
                    />
                  ))}
                </div>
                <blockquote className="text-[15px] leading-relaxed text-white/70">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>

              <figcaption className="mt-8 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/10">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
