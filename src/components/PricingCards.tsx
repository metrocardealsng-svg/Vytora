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

const PAGA_NUMBER = "0509704223";
const PAGA_NAME = "Nnabuchi Michel Caleb";

const NGN_TO_USD: Record<number, string> = {
  4500: "2.80",
  9000: "5.60",
};

function PaymentModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [method, setMethod] = useState<"paga" | "paypal" | null>(null);
  const [copied, setCopied] = useState(false);
  const usdAmount = NGN_TO_USD[plan.price] || "3";

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-[#0e1118] p-6 ring-1 ring-white/10">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Upgrade to {plan.name}</h2>
            <p className="mt-1 text-sm text-slate-400">Choose your payment method</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Amount */}
        <div className="mb-5 rounded-2xl bg-mint/10 px-4 py-3 ring-1 ring-mint/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">Amount</p>
          <div className="flex items-end gap-3 mt-1">
            <p className="text-3xl font-black text-white">{plan.priceLabel}</p>
            <p className="text-slate-400 mb-1 text-sm">/ mo · ~${usdAmount} USD</p>
          </div>
        </div>

        {!method && (
          <div className="space-y-3">
            {/* Paga - Nigeria */}
            <button
              onClick={() => setMethod("paga")}
              className="w-full flex items-center gap-4 rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10 hover:ring-mint/40 hover:bg-mint/5 transition-all text-left"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-lg">
                🇳🇬
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">Paga Transfer</p>
                <p className="text-xs text-slate-400">Send money via Paga — Nigeria</p>
              </div>
              <span className="text-xs font-bold text-mint">Pay in ₦</span>
            </button>

            {/* PayPal - International */}
            <button
              onClick={() => setMethod("paypal")}
              className="w-full flex items-center gap-4 rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10 hover:ring-[#0070BA]/40 hover:bg-[#0070BA]/5 transition-all text-left"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0070BA]/15">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#0070BA">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.813 4.643h-2.189c-.524 0-.968.382-1.05.9l-1.12 7.106-.31 1.99a.64.64 0 0 0 .632.74h3.97c.524 0 .968-.382 1.05-.9l.044-.28.863-5.45.055-.302c.083-.518.527-.9 1.05-.9h.663c4.298 0 7.664-1.747 8.647-6.797.41-2.11.198-3.87-.844-5.106z"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">PayPal</p>
                <p className="text-xs text-slate-400">Pay from anywhere worldwide</p>
              </div>
              <span className="text-xs font-bold text-[#0070BA]">Pay in $</span>
            </button>
          </div>
        )}

        {/* Paga details */}
        {method === "paga" && (
          <div className="space-y-3">
            <button onClick={() => setMethod(null)} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
              ← Back
            </button>
            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-xs text-slate-500 mb-1">Account Name</p>
              <p className="font-bold text-white">{PAGA_NAME}</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 mb-1">Paga Number</p>
                <p className="font-mono text-xl font-black text-white">{PAGA_NUMBER}</p>
              </div>
              <button
                onClick={() => copy(PAGA_NUMBER)}
                className="rounded-xl bg-mint/15 px-4 py-2 text-sm font-black text-mint hover:bg-mint/25"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-xs text-slate-500 mb-1">Amount to send</p>
              <p className="text-2xl font-black text-mint">{plan.priceLabel}</p>
            </div>
            <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-400 space-y-1">
              <p className="font-bold text-white text-xs mb-2">After payment:</p>
              <p>1. Screenshot your Paga receipt</p>
              <p>2. Send to us on WhatsApp with your email</p>
              <p>3. Account upgraded within 2 hours</p>
            </div>
            <a
              href={`https://wa.me/2349073965030?text=Hi%2C%20I%20paid%20for%20Vytora%20${encodeURIComponent(plan.name)}%20via%20Paga.%20Here%20is%20my%20receipt.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-green-500 py-3 font-black text-white hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send receipt on WhatsApp
            </a>
          </div>
        )}

        {/* PayPal details */}
        {method === "paypal" && (
          <div className="space-y-3">
            <button onClick={() => setMethod(null)} className="text-xs text-slate-500 hover:text-white flex items-center gap-1">
              ← Back
            </button>
            <div className="rounded-xl bg-white/5 p-4">
              <p className="text-xs text-slate-500 mb-1">Send PayPal payment to</p>
              <p className="font-bold text-white">michelmartin360.mm@gmail.com</p>
              <p className="text-mint font-black text-xl mt-1">${usdAmount} USD</p>
            </div>
            <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-400 space-y-1">
              <p className="font-bold text-white text-xs mb-2">After payment:</p>
              <p>1. Screenshot your PayPal confirmation</p>
              <p>2. Send to us on WhatsApp with your Vytora email</p>
              <p>3. Account upgraded within 2 hours</p>
            </div>
            <a
              href={`https://wa.me/2349073965030?text=Hi%2C%20I%20paid%20for%20Vytora%20${encodeURIComponent(plan.name)}%20via%20PayPal.%20Here%20is%20my%20confirmation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-green-500 py-3 font-black text-white hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send receipt on WhatsApp
            </a>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-slate-600">
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
            <div key={p.id} className={`relative flex flex-col rounded-3xl p-6 sm:p-8 ${featured ? "bg-gradient-to-b from-mint/15 to-teal/5 ring-2 ring-mint" : "glass"}`}>
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-mint to-teal px-4 py-1 text-xs font-black text-ink">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-black text-white">{p.priceLabel}</span>
                {p.price > 0 && <span className="mb-1 text-slate-400">/mo</span>}
              </div>
              <button
                onClick={() => choose(p)}
                className={`mt-5 w-full rounded-xl py-3 text-base font-black transition-colors ${featured ? "btn-glow bg-gradient-to-r from-mint to-teal text-ink" : "border border-white/15 text-white hover:bg-white/5"}`}
              >
                {p.id === "free" ? "Get started" : "Upgrade now"}
              </button>
              <ul className="mt-6 space-y-2.5">
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
