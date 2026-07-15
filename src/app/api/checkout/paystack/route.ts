import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const PLAN_PRICES: Record<string, number> = {
  pro: 450000,   // ₦4,500 in kobo
  elite: 900000, // ₦9,000 in kobo
};

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  const amount = PLAN_PRICES[plan];
  if (!amount) return Response.json({ error: "Invalid plan" }, { status: 400 });

  const paystackKey = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackKey) {
    return Response.json({ error: "Payment not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount,
      currency: "NGN",
      metadata: {
        userId: user.id,
        plan,
        custom_fields: [
          { display_name: "Plan", variable_name: "plan", value: plan },
          { display_name: "User ID", variable_name: "user_id", value: user.id },
        ],
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/paystack/callback`,
    }),
  });

  const data = await res.json();
  if (!data.status) {
    return Response.json({ error: data.message || "Payment init failed" }, { status: 500 });
  }

  return Response.json({ url: data.data.authorization_url });
}
