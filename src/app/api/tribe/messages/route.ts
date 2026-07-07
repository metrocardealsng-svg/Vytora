import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("tribe_messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(50);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ messages: data });
}

export async function POST(req: Request) {
  const { body, userId, username } = await req.json();
  if (!body?.trim()) return Response.json({ error: "Message required" }, { status: 400 });
  if (!userId || !username) return Response.json({ error: "User info required" }, { status: 400 });

  const { data, error } = await supabase.from("tribe_messages").insert({
    user_id: userId,
    username,
    body: body.trim(),
  }).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ message: data });
}
