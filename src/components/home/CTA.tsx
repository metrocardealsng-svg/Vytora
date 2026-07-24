"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * CTA
 *
 * Final full-width call-to-action before the footer. Large centered
 * headline, glowing gradient backdrop, single primary action.
 * Deliberately quieter on animation than the hero — one clean
 * fade/slide entrance rather than a stacked sequence, since this is
 * the closing beat of the page, not another feature moment.
 *
 * Usage:
 *   <CTA />
 */

export default function CTA() {
  return (
    <section className="relative w-full overflow-hidden px-6 py-32 sm:px-10 lg:px-16">
      {/* Localized glow backdrop, separate from the global AnimatedBackground */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(52,224,161,0.22) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center rounded-[2.5rem] border border-white/10 bg-[#10131B]/50 px-8 py-20 text-center backdrop-blur-xl sm:px-16"
      >
        <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Ready to transform
          <br />
          your health?
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/50">
          Download Vytora today and start turning everyday movement into
          measurable progress.
        </p>

        <Link
          href="/download"
          className="group mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-[#34E0A1] px-8 py-4 text-sm font-semibold text-[#05070B] transition-all duration-300 hover:shadow-[0_0_36px_4px_rgba(52,224,161,0.45)]"
        >
          Download Vytora
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
}
