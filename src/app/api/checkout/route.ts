import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { stripe, stripeEnabled, PLANS, type PlanId } from "@/lib/stripe";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Please sign in to upgrade." }, { status: 401 });
  }

  const { plan } = (await req.json()) as { plan: PlanId };
  if (plan !== "pro" && plan !== "elite") {
    return Response.json({ error: "Invalid plan." }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  const selected = PLANS[plan];

  // Demo mode: Stripe not configured. Simulate an upgrade so the flow is testable.
  if (!stripeEnabled || !stripe || !selected.priceId) {
    await db.update(users).set({ plan }).where(eq(users.id, user.id));
    return Response.json({
      url: `${appUrl}/dashboard?upgraded=${plan}&demo=1`,
      demo: true,
    });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, user.id));
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: selected.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=${plan}`,
    cancel_url: `${appUrl}/pricing?canceled=1`,
    metadata: { userId: user.id, plan },
    subscription_data: { metadata: { userId: user.id, plan } },
  });

  return Response.json({ url: session.url });
}
