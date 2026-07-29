import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * GET /api/stats
 *
 * Returns real platform-wide stats pulled directly from Supabase:
 *   - total_steps: sum of all steps across all activities
 *   - total_activities: count of all logged activities
 *   - goal_completion_rate: % of daily challenges marked completed
 *   - avg_rating: average rating from ratings table
 *   - total_users: total registered users
 *
 * Cached for 10 minutes (revalidate: 600) so it's fast but stays fresh.
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type StatsResponse = {
  total_steps: number;
  total_activities: number;
  goal_completion_rate: number;
  avg_rating: number;
  total_users: number;
};

export async function GET() {
  try {
    const [
      stepsRes,
      activitiesRes,
      challengesRes,
      completedRes,
      ratingsRes,
      usersRes,
    ] = await Promise.all([
      // Sum all steps across activities
      supabase
        .from("activities")
        .select("steps"),

      // Count all activities
      supabase
        .from("activities")
        .select("id", { count: "exact", head: true }),

      // Count total daily challenges
      supabase
        .from("daily_challenges")
        .select("id", { count: "exact", head: true }),

      // Count completed daily challenges
      supabase
        .from("daily_challenges")
        .select("id", { count: "exact", head: true })
        .eq("completed", true),

      // Average rating
      supabase
        .from("ratings")
        .select("rating"),

      // Total users
      supabase
        .from("users")
        .select("id", { count: "exact", head: true }),
    ]);

    // Sum steps manually (Supabase JS v2 doesn't support aggregate select cleanly)
    const totalSteps = (stepsRes.data ?? []).reduce(
      (sum: number, row: any) => sum + (row.steps ?? 0),
      0
    );

    const totalActivities = activitiesRes.count ?? 0;

    const totalChallenges = challengesRes.count ?? 0;
    const completedChallenges = completedRes.count ?? 0;
    const goalCompletionRate =
      totalChallenges > 0
        ? Math.round((completedChallenges / totalChallenges) * 100)
        : 0;

    const ratings = ratingsRes.data ?? [];
    const avgRating =
      ratings.length > 0
        ? Math.round(
            (ratings.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) /
              ratings.length) *
              10
          ) / 10
        : 0;

    const totalUsers = usersRes.count ?? 0;

    const stats: StatsResponse = {
      total_steps: totalSteps,
      total_activities: totalActivities,
      goal_completion_rate: goalCompletionRate,
      avg_rating: avgRating,
      total_users: totalUsers,
    };

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
      },
    });
  } catch (err: any) {
    console.error("[stats]", err);
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
