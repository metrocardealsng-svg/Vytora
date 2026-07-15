"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Plan = {
  id: string;
  name: string;
  priceLabel: string;
  price: number;
  tagline: string;
  features: string[];
};

const PAYPAL_EMAIL = "michelmartin360.mm@gmail.com";

// Naira to USD approximate rate
const NGN_TO_USD: Record<number, string> = {
  4500: "2.80",
  9000: "5.60",
};

function PaymentModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [method, setMethod] = useState<"paystack" | "paypal" | null>(null);
  const [loading, setLoading] = useState(false);

  const usdAmount = NGN_TO_USD[plan.price] || "0";

  async function payWithPaystack() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/paystack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id, amount: plan.price }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Could not initialize payment. Try again.");
      }
    } catch {
      alert("Network error. Try again.");
    }
    setLoading(false);
  }

  function payWithPayPal() {
    const note = encodeURIComponent(`Vytora ${plan.name} plan - 1 month`);
    const url = `https://www.paypal.com/paypalme/${PAYPAL_EMAIL.split("@")[0]}/${usdAmount}USD?note=${note}`;
    window.open(url, "_blank");
    setMethod("paypal");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-[#0e1118] p-8 ring-1 ring-white/10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Upgrade to {plan.name}</h2>
            <p className="mt-1 text-sm text-slate-400">
              Choose your payment method
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Price */}
        <div className="mb-6 rounded-2xl bg-mint/10 px-5 py-4 ring-1 ring-mint/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">Amount</p>
          <div className="flex items-end gap-3 mt-1">
            <p className="text-3xl font-black text-white">{plan.priceLabel}</p>
            <p className="text-slate-400 mb-1">/ mo · ~${usdAmount} USD</p>
          </div>
        </div>

        {/* Payment methods */}
        {!method && (
          <div className="space-y-3">
            {/* Paystack - Nigeria */}
            <button
              onClick={() => { setMethod("paystack"); payWithPaystack(); }}
              disabled={loading}
              className="w-full flex items-center gap-4 rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10 hover:ring-mint/30 hover:bg-mint/5 transition-all text-left"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00C3F7]/15">
                <svg viewBox="0 0 40 40" className="h-6 w-6" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#00C3F7" opacity="0.2"/>
                  <text x="20" y="26" textAnchor="middle" fontSize="16" fill="#00C3F7" fontWeight="bold">P</text>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">Paystack</p>
                <p className="text-xs text-slate-400">Card, bank transfer, USSD — Nigeria</p>
              </div>
              <span className="text-xs font-bold text-mint">Pay in ₦</span>
            </button>

            {/* PayPal - International */}
            <button
              onClick={payWithPayPal}
              className="w-full flex items-center gap-4 rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10 hover:ring-[#0070BA]/30 hover:bg-[#0070BA]/5 transition-all text-left"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0070BA]/15">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#0070BA">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.813 4.643h-2.189c-.524 0-.968.382-1.05.9l-1.12 7.106-.31 1.99a.64.64 0 0 0 .632.74h3.97c.524 0 .968-.382 1.05-.9l.044-.28.863-5.45.055-.302c.083-.518.527-.9 1.05-.9h.663c4.298 0 7.664-1.747 8.647-6.797.41-2.11.198-3.87-.844-5.106z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">PayPal</p>
                <p className="text-xs text-slate-400">Pay from anywhere in the world</p>
              </div>
              <span className="text-xs font-bold text-[#0070BA]">Pay in $</span>
            </button>
          </div>
        )}

        {/* PayPal instructions after clicking */}
        {method === "paypal" && (
          <div className="rounded-2xl bg-[#0070BA]/10 p-5 ring-1 ring-[#0070BA]/30">
            <p className="font-bold text-white mb-2">PayPal payment opened</p>
            <ol className="space-y-1.5 text-sm text-slate-300 list-decimal list-inside">
              <li>Complete the ${usdAmount} payment on PayPal</li>
              <li>Screenshot your payment confirmation</li>
              <li>Send it to us via WhatsApp with your email</li>
              <li>Account upgraded within 2 hours</li>
            </ol>
            <a
              href={`https://wa.me/2349073965030?text=Hi%2C%20I%20just%20paid%20for%20Vytora%20${encodeURIComponent(plan.name)}%20via%20PayPal.%20Here%20is%20my%20confirmation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-green-500 py-3 font-black text-white hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send receipt on WhatsApp
            </a>
          </div>
        )}

        {loading && (
          <div className="mt-4 text-center text-sm text-slate-400 animate-pulse">
            Connecting to Paystack...
          </div>
        )}

        <p className="mt-5 text-center text-xs text-slate-600">
          This app is owned by MetroCarDeals Ltd.
        </p>
      </div>
    </div>
  );
}

export default function PricingCards({ plans, authed }: { plans: Plan[]; authed: boolean }) {
  const [activeModal, setActiveModal] = useState<Plan | null>(null);
  const router = useRouter();

  function choose(plan: Plan) {
    if (plan.id === "free") {
      router.push(authed ? "/dashboard" : "/signup");
      return;
    }
    if (!authed) {
      router.push("/signup");
      return;
    }
    setActiveModal(plan);
  }

  return (
    <>
      {activeModal && (
        <PaymentModal plan={activeModal} onClose={() => setActiveModal(null)} />
      )}
      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((p) => {
          const featured = p.id === "pro";
          return (
            <div key={p.id} className={`relative flex flex-col rounded-3xl p-8 ${featured ? "bg-gradient-to-b from-mint/15 to-teal/5 ring-2 ring-mint" : "glass"}`}>
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-mint to-teal px-4 py-1 text-xs font-black text-ink">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-white">{p.priceLabel}</span>
                {p.price > 0 && <span className="mb-1.5 text-slate-400">/mo</span>}
              </div>
              <button
                onClick={() => choose(p)}
                className={`mt-6 w-full rounded-xl py-3.5 text-base font-black transition-colors ${featured ? "btn-glow bg-gradient-to-r from-mint to-teal text-ink" : "border border-white/15 text-white hover:bg-white/5"}`}
              >
                {p.id === "free" ? "Get started" : "Upgrade now"}
              </button>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
