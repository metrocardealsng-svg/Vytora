import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCards from "@/components/PricingCards";
import { PLANS } from "@/lib/plans";

import { getSessionUserId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pricing — Simple plans for every mover",
  description:
    "Vytora pricing: a generous free tier plus Pro and Elite plans with unlimited history, advanced analytics, and AI training plans.",
};

export const dynamic = "force-dynamic";

const faqs = [
  {
    q: "Is there really a free plan?",
    a: "Yes. The Starter plan is free forever and includes live GPS tracking and up to 20 saved activities. No payment required.",
  },
  {
    q: "How do I pay?",
    a: "We accept bank transfers via Moniepoint. After upgrading, send your payment receipt on WhatsApp and your account will be activated within 2 hours.",
  },
  {
    q: "What currency do you charge in?",
    a: "All prices are in Nigerian Naira (₦). No hidden conversion fees.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are month-to-month. Just stop renewing and your account returns to the free Starter plan at the end of the month.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you're not satisfied within 7 days of upgrading, reach out via WhatsApp and we'll sort it out.",
  },
];

export default async function PricingPage() {
  const authed = Boolean(await getSessionUserId());
  const plans = [PLANS.free, PLANS.pro, PLANS.elite].map((p) => ({
    id: p.id,
    name: p.name,
    priceLabel: p.priceLabel,
    price: p.price,
    tagline: p.tagline,
    features: [...p.features],
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Simple, honest <span className="text-gradient">pricing</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400">
              Start free. Upgrade when you&apos;re ready for deeper insights.
              Pay in Naira. No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="mt-16">
            <PricingCards plans={plans} authed={authed} />
          </div>

          {/* How payment works */}
          <div className="mx-auto mt-20 max-w-2xl">
            <h2 className="text-center text-2xl font-black text-white">
              How payment works
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Pick your plan",
                  body: "Choose Pro or Elite and click Upgrade.",
                },
                {
                  step: "2",
                  title: "Transfer via Moniepoint",
                  body: "Pay the exact amount to our account. Takes under a minute.",
                },
                {
                  step: "3",
                  title: "Send your receipt",
                  body: "WhatsApp us your proof of payment. Activated within 2 hours.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="glass rounded-2xl p-6 text-center"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mint/15 text-lg font-black text-mint">
                    {s.step}
                  </span>
                  <h3 className="mt-3 font-bold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-center text-3xl font-black text-white">
              Frequently asked questions
            </h2>
            <div className="mt-8 space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
