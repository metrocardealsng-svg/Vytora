import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export type LeaderboardEntry = {
  rank: number;
  user_id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  current_streak: number;
  period_steps: number;
  period_distance_meters: number;
  period_calories: number;
  period_activities: number;
  score: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getRangeStart(range: string): string | null {
  const now = new Date();
  if (range === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }
  if (range === "month") {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 1);
    return d.toISOString();
  }
  return null;
}

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("range") ?? "week";
  const rangeStart = getRangeStart(range);

  try {
    if (range === "alltime") {
      const { data, error } = await supabase
        .from("users")
        .select(`id, name, avatar_url, current_streak, total_steps, total_distance_meters, total_activities, profiles!inner(username, avatar_url, is_public)`)
        .eq("profiles.is_public", true)
        .order("total_steps", { ascending: false })
        .limit(50);

      if (error) throw error;

      const entries: LeaderboardEntry[] = (data ?? [])
        .map((u: any) => {
          const steps = u.total_steps ?? 0;
          const distance = u.total_distance_meters ?? 0;
          const streak = u.current_streak ?? 0;
          const score = steps * 1 + distance * 0.1 + streak * 500;
          return {
            user_id: u.id,
            name: u.name,
            username: u.profiles?.username ?? u.name,
            avatar_url: u.profiles?.avatar_url ?? u.avatar_url,
            current_streak: streak,
            period_steps: steps,
            period_distance_meters: distance,
            period_calories: 0,
            period_activities: u.total_activities ?? 0,
            score,
            rank: 0,
          };
        })
        .sort((a: any, b: any) => b.score - a.score)
        .map((e: any, i: number) => ({ ...e, rank: i + 1 }));

      return NextResponse.json(entries);
    }

    const { data, error } = await supabase
      .from("activities")
      .select(`user_id, steps, calories, distance_meters, users!inner(name, avatar_url, current_streak, profiles!inner(username, avatar_url, is_public))`)
      .gte("started_at", rangeStart!)
      .eq("users.profiles.is_public", true);

    if (error) throw error;

    const map = new Map<string, LeaderboardEntry>();

    for (const row of data ?? []) {
      const user = (row as any).users;
      const profile = user?.profiles;
      if (!profile?.is_public) continue;

      const existing = map.get(row.user_id);
      if (existing) {
        existing.period_steps += row.steps ?? 0;
        existing.period_distance_meters += row.distance_meters ?? 0;
        existing.period_calories += row.calories ?? 0;
        existing.period_activities += 1;
      } else {
        map.set(row.user_id, {
          rank: 0,
          user_id: row.user_id,
          name: user?.name ?? "Unknown",
          username: profile?.username ?? user?.name ?? "Unknown",
          avatar_url: profile?.avatar_url ?? user?.avatar_url ?? null,
          current_streak: user?.current_streak ?? 0,
          period_steps: row.steps ?? 0,
          period_distance_meters: row.distance_meters ?? 0,
          period_calories: row.calories ?? 0,
          period_activities: 1,
          score: 0,
        });
      }
    }

    const entries: LeaderboardEntry[] = Array.from(map.values())
      .map((e) => ({
        ...e,
        score: e.period_steps * 1 + e.period_distance_meters * 0.1 + e.period_calories * 0.5 + e.current_streak * 500,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 50)
      .map((e, i) => ({ ...e, rank: i + 1 }));

    return NextResponse.json(entries);
  } catch (err: any) {
    console.error("[leaderboard]", err);
    return NextResponse.json({ error: err.message ?? "Internal server error" }, { status: 500 });
  }
}
