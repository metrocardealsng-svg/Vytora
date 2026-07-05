import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profile] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      plan: users.plan,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      weightKg: users.weightKg,
      heightCm: users.heightCm,
      fitnessGoal: users.fitnessGoal,
      location: users.location,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  return NextResponse.json({ profile });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed = ["name", "bio", "weightKg", "heightCm", "fitnessGoal", "location", "avatarUrl"];
  const update: Record<string, unknown> = {};

  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  await db.update(users).set(update).where(eq(users.id, user.id));
  return NextResponse.json({ success: true });
}
