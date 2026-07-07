import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return Response.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filename = `${user.id}-${Date.now()}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("tribe-media")
    .upload(filename, buffer, { contentType: file.type });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("tribe-media").getPublicUrl(filename);
  return Response.json({ url: data.publicUrl });
}
