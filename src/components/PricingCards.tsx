"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BANK_DETAILS } from "@/lib/plans";

type Plan = {
  id: string;
  name: string;
  priceLabel: string;
  price: number;
  tagline: string;
  features: string[];
};

function BankTransferModal({
  plan,
  onClose,
}: {
  plan: Plan;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-[#0e1118] p-8 ring-1 ring-white/10">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-white">
              Pay for {plan.name}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Transfer{" "}
              <span className="font-bold text-mint">{plan.priceLabel}/mo</span>{" "}
              to any account below
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Amount */}
        <div className="mb-5 rounded-2xl bg-mint/10 px-5 py-4 ring-1 ring-mint/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint">Amount to pay</p>
          <p className="mt-1 text-3xl font-black text-white">{plan.priceLabel}</p>
          <p className="text-xs text-slate-400">per month</p>
        </div>

        {/* Account name */}
        <div className="mb-3 rounded-xl bg-white/5 px-4 py-3">
          <p className="text-xs text-slate-500">Account Name</p>
          <p className="mt-0.5 font-bold text-white">{BANK_DETAILS.accountName}</p>
        </div>

        {/* Bank accounts */}
        <div className="space-y-3">
          {BANK_DETAILS.accounts.map((acc) => (
            <div
              key={acc.number}
              className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/5"
            >
              <div>
                <p className="text-xs text-slate-500">{acc.bank}</p>
                <p className="mt-0.5 font-mono text-lg font-bold text-white">
                  {acc.number}
                </p>
              </div>
              <button
                onClick={() => copy(acc.number, acc.number)}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-mint hover:text-ink"
              >
                {copied === acc.number ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-5 space-y-2 rounded-2xl bg-white/5 px-5 py-4 text-sm text-slate-400">
          <p className="font-semibold text-white">After you pay:</p>
          <ol className="mt-2 space-y-1.5 list-decimal list-inside">
            <li>Screenshot your transfer receipt</li>
            <li>
              Send it via WhatsApp or email with your{" "}
              <span className="text-white">registered email address</span>
            </li>
            <li>Your account will be upgraded within 2 hours</li>
          </ol>
        </div>

        {/* WhatsApp button */}
        <a
          href="https://wa.me/2349073965030?text=Hi%2C%20I%20just%20paid%20for%20Vytora%20" +
            encodeURIComponent(plan.name) +
            "%20plan.%20Here%20is%20my%20receipt."
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 font-black text-white transition-opacity hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Send receipt on WhatsApp
        </a>

        <p className="mt-4 text-center text-xs text-slate-500">
          This app is owned by{" "}
          <span className="text-slate-400">{BANK_DETAILS.owner}</span>
        </p>
      </div>
    </div>
  );
}

export default function PricingCards({
  plans,
  authed,
}: {
  plans: Plan[];
  authed: boolean;
}) {
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
        <BankTransferModal
          plan={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((p) => {
          const featured = p.id === "pro";
          return (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-3xl p-8 ${
                featured
                  ? "bg-gradient-to-b from-mint/15 to-teal/5 ring-2 ring-mint"
                  : "glass"
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-mint to-teal px-4 py-1 text-xs font-black text-ink">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-white">
                  {p.priceLabel}
                </span>
                {p.price > 0 && (
                  <span className="mb-1.5 text-slate-400">/mo</span>
                )}
              </div>
              <button
                onClick={() => choose(p)}
                className={`mt-6 w-full rounded-xl py-3.5 text-base font-black transition-colors ${
                  featured
                    ? "btn-glow bg-gradient-to-r from-mint to-teal text-ink"
                    : "border border-white/15 text-white hover:bg-white/5"
                }`}
              >
                {p.id === "free" ? "Get started" : "Upgrade now"}
              </button>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-mint"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
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
