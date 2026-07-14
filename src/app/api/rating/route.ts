import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

export async function GET() {
  const { data } = await supabase
    .from("ratings")
    .select("rating");

  if (!data || data.length === 0) {
    return Response.json({ average: 0, total: 0 });
  }

  const total = data.length;
  const average = data.reduce((s, r) => s + r.rating, 0) / total;
  return Response.json({ average: Math.round(average * 10) / 10, total });
}

export async function POST(req: Request) {
  const { userId, rating } = await req.json();
  if (!userId || !rating || rating < 1 || rating > 5) {
    return Response.json({ error: "Invalid" }, { status: 400 });
  }

  await supabase.from("ratings").upsert(
    { user_id: userId, rating },
    { onConflict: "user_id" }
  );

  // Return updated stats
  const { data } = await supabase.from("ratings").select("rating");
  const total = data?.length || 0;
  const average = total > 0
    ? Math.round((data!.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
    : 0;

  return Response.json({ success: true, average, total });
}
