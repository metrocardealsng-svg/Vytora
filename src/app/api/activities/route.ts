import { db } from "@/db";
import { activities, users } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { getSessionUserId } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

async function updateStreakAndStats(userId: string, steps: number, distanceMeters: number) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // Upsert today's daily steps
    await supabase.from("daily_steps").upsert({
      user_id: userId,
      date: today,
      steps,
      distance_meters: distanceMeters,
    }, { onConflict: "user_id,date" });

    // Get current user stats
    const { data: userData } = await supabase
      .from("users")
      .select("current_streak, longest_streak, last_active_date, total_steps, total_distance_meters, total_activities")
      .eq("id", userId)
      .single();

    if (!userData) return;

    const lastActive = userData.last_active_date;
    let newStreak = userData.current_streak || 0;

    if (lastActive === today) {
      // Already active today, just update stats
    } else if (lastActive === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    const longestStreak = Math.max(newStreak, userData.longest_streak || 0);

    await supabase.from("users").update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_active_date: today,
      total_steps: (userData.total_steps || 0) + steps,
      total_distance_meters: (userData.total_distance_meters || 0) + distanceMeters,
      total_activities: (userData.total_activities || 0) + 1,
    }).eq("id", userId);
  } catch (e) {
    console.error("Stats update error:", e);
  }
}

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

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

    const steps = Math.round(Number(body.steps) || 0);
    const distanceMeters = Number(body.distanceMeters) || 0;

    const [row] = await db
      .insert(activities)
      .values({
        userId,
        type: body.type || "walk",
        title: body.title || "Untitled Activity",
        distanceMeters,
        durationSeconds: Math.round(Number(body.durationSeconds) || 0),
        steps,
        calories: Math.round(Number(body.calories) || 0),
        avgPaceSecPerMile: Math.round(Number(body.avgPaceSecPerMile) || 0),
        route: Array.isArray(body.route) ? body.route : [],
        startedAt: body.startedAt ? new Date(body.startedAt) : new Date(),
      })
      .returning();

    // Update streak and lifetime stats
    await updateStreakAndStats(userId, steps, distanceMeters);

    return Response.json({ activity: row });
  } catch {
    return Response.json({ error: "Invalid activity data." }, { status: 400 });
  }
}
