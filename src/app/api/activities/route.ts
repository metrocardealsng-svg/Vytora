import { db } from "@/db";
import { activities, users } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { getSessionUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db
    .select()
    .from(activities)
    .where(eq(activities.userId, userId))
    .orderBy(desc(activities.startedAt))
    .limit(200);
  return Response.json({ activities: rows });
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    // Enforce free tier limit of 20 activities.
    const [me] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (me && me.plan === "free") {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(activities)
        .where(eq(activities.userId, userId));
      if (count >= 20) {
        return Response.json(
          { error: "Free plan limit reached (20 activities). Upgrade to Pro for unlimited history." },
          { status: 402 }
        );
      }
    }

    const [row] = await db
      .insert(activities)
      .values({
        userId,
        type: body.type || "walk",
        title: body.title || "Untitled Activity",
        distanceMeters: Number(body.distanceMeters) || 0,
        durationSeconds: Math.round(Number(body.durationSeconds) || 0),
        steps: Math.round(Number(body.steps) || 0),
        calories: Math.round(Number(body.calories) || 0),
        avgPaceSecPerMile: Math.round(Number(body.avgPaceSecPerMile) || 0),
        route: Array.isArray(body.route) ? body.route : [],
        startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
      })
      .returning();
    return Response.json({ activity: row });
  } catch {
    return Response.json({ error: "Invalid activity data." }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  await db
    .delete(activities)
    .where(and(eq(activities.id, id), eq(activities.userId, userId)));
  return Response.json({ ok: true });
}
