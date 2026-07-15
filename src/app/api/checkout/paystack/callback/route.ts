import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=no_reference`);
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });

  const data = await res.json();

  if (!data.status || data.data.status !== "success") {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/pricing?error=payment_failed`);
  }

  const { userId, plan } = data.data.metadata;

  if (userId && plan) {
    await supabase.from("users").update({ plan }).eq("id", userId);
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`);
}
