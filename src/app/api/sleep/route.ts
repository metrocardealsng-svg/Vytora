import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("sleep_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("slept_at", { ascending: false })
    .limit(7);

  return Response.json({ logs: data || [] });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { hours, quality, notes } = await req.json();
  if (!hours) return Response.json({ error: "Hours required" }, { status: 400 });

  const { data, error } = await supabase.from("sleep_logs").insert({
    user_id: user.id,
    hours,
    quality: quality || 7,
    notes: notes || null,
  }).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ log: data });
}
