import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * GET /api/testimonials
 *
 * Returns up to 6 real ratings (4-5 stars only) joined with user
 * name and avatar. If fewer than 3 exist, returns whatever is there.
 * Never returns fake data.
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("ratings")
      .select(`
        id,
        rating,
        created_at,
        users!inner (
          name,
          avatar_url
        )
      `)
      .gte("rating", 4)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw error;

    const reviews = (data ?? []).map((r: any) => ({
      id: r.id,
      name: r.users?.name ?? "Vytora User",
      avatar_url: r.users?.avatar_url ?? null,
      rating: r.rating,
      created_at: r.created_at,
    }));

    return NextResponse.json(reviews, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (err: any) {
    console.error("[testimonials]", err);
    return NextResponse.json([], { status: 200 }); // return empty, never crash the page
  }
}
