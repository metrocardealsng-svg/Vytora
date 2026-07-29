"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

/**
 * Testimonials
 *
 * Pulls real ratings from /api/testimonials which reads from the
 * `ratings` table joined with `users` for name and avatar.
 * Shows nothing if there are no ratings yet — no fake data ever.
 */

type Review = {
  id: string;
  name: string;
  avatar_url: string | null;
  rating: number;
  created_at: string;
};

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data: Review[]) => setReviews(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Don't render the section if no real reviews exist yet
  if (!loading && reviews.length === 0) return null;

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
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-3xl bg-white/5"
                />
              ))
            : reviews.map((review, index) => (
                <motion.figure
                  key={review.id}
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
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-[#34E0A1] text-[#34E0A1]"
                        />
                      ))}
                    </div>
                    <p className="text-[15px] leading-relaxed text-white/70">
                      Rated {review.rating} out of 5 stars
                    </p>
                  </div>

                  <figcaption className="mt-8 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#34E0A1]/20">
                      {review.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={review.avatar_url}
                          alt={review.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-[#34E0A1]">
                          {review.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {review.name}
                      </p>
                      <p className="text-xs text-white/40">Vytora user</p>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
        </div>
      </div>
    </section>
  );
}
