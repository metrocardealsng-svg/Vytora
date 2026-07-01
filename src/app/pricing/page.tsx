import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCards from "@/components/PricingCards";
import { PLANS } from "@/lib/stripe";
import { getSessionUserId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Pricing — Simple plans for every mover",
  description:
    "Vytora pricing: a generous free tier plus Pro and Elite plans with unlimited history, advanced analytics, and AI training plans.",
};

export const dynamic = "force-dynamic";

const faqs = [
  { q: "Is there really a free plan?", a: "Yes. The Starter plan is free forever and includes live GPS tracking and up to 20 saved activities. No credit card required." },
  { q: "Can I cancel anytime?", a: "Absolutely. Paid plans are month-to-month and you can cancel with one click from your dashboard — no questions asked." },
  { q: "What payment methods do you accept?", a: "All major credit and debit cards through our secure Stripe checkout. Your card details never touch our servers." },
  { q: "Do you offer refunds?", a: "If you're not happy within 14 days of upgrading, contact us for a full refund." },
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
              No ads. No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="mt-16">
            <PricingCards plans={plans} authed={authed} />
          </div>

          <div className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-center text-3xl font-black text-white">
              Frequently asked questions
            </h2>
            <div className="mt-8 space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="glass rounded-2xl p-6">
                  <h3 className="font-bold text-white">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.a}</p>
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
