import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe, stripeEnabled } from "@/lib/stripe";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!stripeEnabled || !stripe) {
    return Response.json({ error: "Stripe not configured." }, { status: 400 });
  }
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    if (secret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, secret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = s.metadata?.userId;
        const plan = s.metadata?.plan;
        if (userId && plan) {
          await db
            .update(users)
            .set({
              plan,
              stripeSubscriptionId: (s.subscription as string) || null,
              stripeCustomerId: (s.customer as string) || null,
            })
            .where(eq(users.id, userId));
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) {
          await db.update(users).set({ plan: "free" }).where(eq(users.id, userId));
        }
        break;
      }
    }
  } catch {
    return Response.json({ error: "Handler error." }, { status: 500 });
  }

  return Response.json({ received: true });
}
