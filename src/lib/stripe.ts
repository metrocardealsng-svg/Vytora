import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

export const stripe = key
  ? new Stripe(key, { apiVersion: "2026-06-24.dahlia" })
  : null;

export const stripeEnabled = false;

export const PLANS = {
  free: { id: "free", name: "Starter", price: 0, priceLabel: "Free", tagline: "Everything you need to start moving.", features: ["Live GPS step & distance tracking", "Up to 20 saved activities", "Basic weekly stats", "Route history map"], priceId: null as string | null },
  pro: { id: "pro", name: "Pro", price: 4500, priceLabel: "₦4,500", tagline: "For dedicated movers who want more insight.", features: ["Unlimited saved activities", "Advanced pace & calorie analytics", "Personal records & streaks", "Segment leaderboards", "Priority support"], priceId: null as string | null },
  elite: { id: "elite", name: "Elite", price: 9000, priceLabel: "₦9,000", tagline: "The complete performance & wellness suite.", features: ["Everything in Pro", "AI adaptive training plans", "Recovery & sleep insights", "Live route safety sharing", "Family accounts (up to 5)", "Early access to new features"], priceId: null as string | null },
} as const;

export type PlanId = keyof  typeof PLANS;
