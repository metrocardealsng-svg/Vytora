import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("tribe_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ posts: data });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { content, media_urls } = await req.json();
  if (!content?.trim()) return Response.json({ error: "Content required" }, { status: 400 });

  const { data, error } = await supabase.from("tribe_posts").insert({
    user_id: user.id,
    username: user.name || user.email.split("@")[0],
    content: content.trim(),
    media_urls: media_urls || [],
  }).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ post: data });
}
