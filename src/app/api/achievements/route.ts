import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/auth";
import { BADGES, checkNewBadges } from "@/lib/badges";
import type { UserStats } from "@/lib/badges";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // Get user stats
  const { data: userData } = await supabase
    .from("users")
    .select("current_streak, longest_streak, total_steps, total_distance_meters, total_activities, last_active_date")
    .eq("id", user.id)
    .single();

  // Get earned badges
  const { data: earnedData } = await supabase
    .from("user_badges")
    .select("badge_id, earned_at")
    .eq("user_id", user.id);

  // Get today's steps
  const today = new Date().toISOString().split("T")[0];
  const { data: todayData } = await supabase
    .from("daily_steps")
    .select("steps, distance_meters")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  const stats: UserStats = {
    totalSteps: userData?.total_steps || 0,
    totalDistanceMeters: userData?.total_distance_meters || 0,
    totalActivities: userData?.total_activities || 0,
    currentStreak: userData?.current_streak || 0,
    longestStreak: userData?.longest_streak || 0,
  };

  const earnedIds = (earnedData || []).map((e: any) => e.badge_id);
  const earnedMap = Object.fromEntries((earnedData || []).map((e: any) => [e.badge_id, e.earned_at]));

  // Check and award new badges
  const newBadges = checkNewBadges(stats, earnedIds);
  if (newBadges.length > 0) {
    await supabase.from("user_badges").insert(
      newBadges.map((b) => ({ user_id: user.id, badge_id: b.id }))
    );
    newBadges.forEach((b) => earnedIds.push(b.id));
  }

  return Response.json({
    stats,
    todaySteps: todayData?.steps || 0,
    todayDistance: todayData?.distance_meters || 0,
    earnedBadgeIds: earnedIds,
    earnedMap,
    allBadges: BADGES,
    newBadges: newBadges.map((b) => b.id),
  });
}
