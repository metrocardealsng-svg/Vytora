"use client";

import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import PricingPreview from "@/components/home/PricingPreview";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

/**
 * CinematicHome
 *
 * Master homepage wrapper. Receives `userId` from the server component
 * (page.tsx) so child components can conditionally render
 * authenticated states (e.g. "Go to Dashboard" instead of "Download"
 * in the CTA) without needing their own auth calls.
 *
 * AnimatedBackground is mounted once inside Hero (it renders as
 * `fixed inset-0`) so it covers the entire page automatically — no
 * need to mount it here again.
 *
 * Section order follows the brief:
 *   Navbar → Hero → Features → Stats → Testimonials
 *   → Pricing → FAQ → CTA
 *
 * Usage (src/app/page.tsx):
 *   import CinematicHome from "@/components/CinematicHome";
 *   <CinematicHome userId={userId} />
 */

type CinematicHomeProps = {
  userId?: string | null;
};

export default function CinematicHome({ userId }: CinematicHomeProps) {
  return (
    <main className="relative w-full overflow-x-hidden bg-[#05070B]">
      {/* Sticky glass nav */}
      <Navbar />

      {/* Hero — also mounts AnimatedBackground (fixed, covers full page) */}
      <Hero />

      {/* Features grid */}
      <section id="features">
        <FeatureGrid />
      </section>

      {/* Animated stat counters */}
      <Stats />

      {/* Testimonials */}
      <Testimonials />

      {/* Pricing */}
      <section id="pricing">
        <PricingPreview />
      </section>

      {/* FAQ accordion */}
      <section id="faq">
        <FAQ />
      </section>

      {/* Final CTA — swap CTA button text if user is already logged in */}
      <CTA userId={userId} />
    </main>
  );
}
