"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

/**
 * FAQ
 *
 * Animated accordion. Only one item open at a time (classic FAQ
 * behavior). Height/opacity animate via AnimatePresence + layout,
 * chevron/plus icon rotates 45deg into an "x" when open.
 *
 * Usage:
 *   <FAQ />
 */

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "How does Vytora track my steps and workouts?",
    answer:
      "Vytora runs in the background using your phone's motion sensors and, if connected, your Apple Watch, Garmin, or Fitbit, so steps, runs, and workouts are logged automatically without opening the app.",
  },
  {
    id: "faq-2",
    question: "Which devices and apps does Vytora connect to?",
    answer:
      "Vytora syncs with Apple Health, Google Fit, Garmin Connect, Fitbit, and Strava, so your existing devices and history carry over instead of starting from zero.",
  },
  {
    id: "faq-3",
    question: "What's included in the free plan?",
    answer:
      "The free plan includes automatic step tracking, basic route mapping, weekly challenges, and 7 days of activity history — enough to build the habit before deciding if you want more.",
  },
  {
    id: "faq-4",
    question: "Can I cancel Premium at any time?",
    answer:
      "Yes. Premium is billed monthly with no lock-in, and you can cancel from your account settings at any time — you'll keep access until the end of the current billing period.",
  },
  {
    id: "faq-5",
    question: "Is my health data private?",
    answer:
      "Your activity and health data is encrypted and never sold to third parties. You control exactly what syncs, and you can export or delete your data at any time from settings.",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="text-base font-medium text-white sm:text-lg">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5"
        >
          <Plus className="h-4 w-4 text-[#34E0A1]" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 text-sm leading-relaxed text-white/50">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  return (
    <section className="relative w-full px-6 py-28 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-[#34E0A1]">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Questions, answered.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          {FAQS.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() =>
                setOpenId((current) => (current === item.id ? null : item.id))
              }
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
