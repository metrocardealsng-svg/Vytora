"use client";

import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import FreeBanner from "@/components/home/FreeBanner";

/**
 * CinematicHome — clean, fast, no API calls.
 * All sections are static and render immediately.
 * 
 * 🎉 PROMO: All features free for 6 months
 */

type CinematicHomeProps = {
  userId?: string | null;
};

export default function CinematicHome({ userId }: CinematicHomeProps) {
  return (
    <main className="relative w-full overflow-x-hidden bg-[#05070B]">
      <Hero />

      {/* 🎉 FREE FOR 6 MONTHS BANNER */}
      <FreeBanner />

      <section id="features">
        <FeatureGrid />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <CTA userId={userId} />
    </main>
  );
}
