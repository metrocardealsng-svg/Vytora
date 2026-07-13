import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("app_ratings")
    .select("rating");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const total = data.length;

  const average =
    total === 0
      ? 0
      : Number(
          (
            data.reduce((sum, r) => sum + r.rating, 0) / total
          ).toFixed(1)
        );

  return Response.json({
    average,
    total,
  });
}

export async function POST(req: Request) {
  const { userId, rating } = await req.json();

  if (!userId || !rating) {
    return Response.json(
      { error: "Missing data" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("app_ratings")
    .upsert(
      {
        user_id: userId,
        rating,
      },
      {
        onConflict: "user_id",
      }
    );

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json({
    success: true,
  });
}
