import { createClient } from "@supabase/supabase-js";

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
  const { content, media_urls, userId, username } = await req.json();
  if (!content?.trim() && (!media_urls || media_urls.length === 0)) {
    return Response.json({ error: "Content required" }, { status: 400 });
  }
  if (!userId || !username) {
    return Response.json({ error: "User info required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("tribe_posts").insert({
    user_id: userId,
    username,
    content: content?.trim() || "",
    media_urls: media_urls || [],
  }).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ post: data });
}

export async function PATCH(req: Request) {
  const { postId } = await req.json();
  if (!postId) return Response.json({ error: "postId required" }, { status: 400 });
  await supabase.rpc("increment_likes", { post_id: postId });
  return Response.json({ success: true });
}
