"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import PricingPreview from "@/components/home/PricingPreview";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

/**
 * CinematicHome
 *
 * Heavy sections (Stats, Testimonials, Leaderboard) are lazy-loaded
 * with dynamic() so they NEVER block the initial page paint.
 * Hero + FeatureGrid + PricingPreview + FAQ + CTA are all static
 * and render immediately with zero API calls.
 */

const Stats = dynamic(() => import("@/components/home/Stats"), {
  ssr: false,
  loading: () => <div className="h-48 w-full" />,
});

const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  ssr: false,
  loading: () => null,
});

const Leaderboard = dynamic(() => import("@/components/home/Leaderboard"), {
  ssr: false,
  loading: () => <div className="h-96 w-full" />,
});

type CinematicHomeProps = {
  userId?: string | null;
};

export default function CinematicHome({ userId }: CinematicHomeProps) {
  return (
    <main className="relative w-full overflow-x-hidden bg-[#05070B]">
      {/* Renders immediately — no API calls, no heavy JS */}
      <Hero />

      <section id="features">
        <FeatureGrid />
      </section>

      {/* Lazy — loads after page is interactive */}
      <Stats />

      <Testimonials />

      <section id="tracker">
        <Leaderboard currentUserId={userId} />
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
