"use client";

import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import PricingPreview from "@/components/home/PricingPreview";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

/**
 * CinematicHome — clean, fast, no API calls.
 * All sections are static and render immediately.
 */

type CinematicHomeProps = {
  userId?: string | null;
};

export default function CinematicHome({ userId }: CinematicHomeProps) {
  return (
    <main className="relative w-full overflow-x-hidden bg-[#05070B]">
      <Hero />

      <section id="features">
        <FeatureGrid />
      </section>

      <section id="pricing">
        <PricingPreview />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <CTA userId={userId} />
    </main>
  );
}
