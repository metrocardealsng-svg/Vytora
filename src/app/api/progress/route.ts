import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

const BADGES = [
  { id: "first_steps", name: "First Steps", desc: "Complete your first activity", emoji: "👟", check: (s: Stats) => s.total_activities >= 1 },
  { id: "step_master", name: "Step Master", desc: "Hit 10,000 steps in a day", emoji: "🚶", check: (s: Stats) => s.best_day_steps >= 10000 },
  { id: "week_warrior", name: "Week Warrior", desc: "7-day streak", emoji: "🔥", check: (s: Stats) => s.longest_streak >= 7 },
  { id: "month_legend", name: "Month Legend", desc: "30-day streak", emoji: "🏆", check: (s: Stats) => s.longest_streak >= 30 },
  { id: "century", name: "Century Club", desc: "Run 100km total", emoji: "💯", check: (s: Stats) => s.total_distance_meters >= 100000 },
  { id: "early_bird", name: "Early Bird", desc: "Complete 5 activities", emoji: "🌅", check: (s: Stats) => s.total_activities >= 5 },
  { id: "tribe_member", name: "Tribe Member", desc: "Post in Tribe", emoji: "👥", check: (_s: Stats) => false },
  { id: "marathon", name: "Marathon Soul", desc: "Run 42km in a single activity", emoji: "🎖️", check: (s: Stats) => s.best_single_distance >= 42000 },
];

type Stats = {
  total_activities: number;
  total_steps: number;
  total_distance_meters: number;
  best_day_steps: number;
  best_single_distance: number;
  current_streak: number;
  longest_streak: number;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return Response.json({ error: "userId required" }, { status: 400 });

  // Get streak data
  const { data: streak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  // Get today's challenge
  const today = new Date().toISOString().split("T")[0];
  const { data: challenge } = await supabase
    .from("daily_challenges")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  // Get earned badges
  const { data: earnedBadges } = await supabase
    .from("user_badges")
    .select("badge_id, earned_at")
    .eq("user_id", userId);

  // Get activity stats
  const { data: activities } = await supabase
    .from("activities")
    .select("steps, distance_meters, created_at")
    .eq("user_id", userId);

  const stats: Stats = {
    total_activities: activities?.length || 0,
    total_steps: activities?.reduce((s, a) => s + (a.steps || 0), 0) || 0,
    total_distance_meters: activities?.reduce((s, a) => s + (a.distance_meters || 0), 0) || 0,
    best_day_steps: 0,
    best_single_distance: Math.max(...(activities?.map(a => a.distance_meters || 0) || [0])),
    current_streak: streak?.current_streak || 0,
    longest_streak: streak?.longest_streak || 0,
  };

  // Check and award new badges
  const earnedIds = new Set(earnedBadges?.map(b => b.badge_id) || []);
  const newBadges: string[] = [];
  for (const badge of BADGES) {
    if (!earnedIds.has(badge.id) && badge.check(stats)) {
      await supabase.from("user_badges").insert({ user_id: userId, badge_id: badge.id });
      newBadges.push(badge.id);
      earnedIds.add(badge.id);
    }
  }

  const allBadges = BADGES.map(b => ({
    ...b,
    earned: earnedIds.has(b.id),
    earnedAt: earnedBadges?.find(e => e.badge_id === b.id)?.earned_at || null,
    isNew: newBadges.includes(b.id),
  }));

  return Response.json({
    streak: streak || { current_streak: 0, longest_streak: 0, total_steps: 0, total_distance_meters: 0, total_activities: 0 },
    challenge: challenge || { steps_goal: 10000, steps_achieved: 0, completed: false, date: today },
    badges: allBadges,
    stats,
  });
}

export async function POST(req: Request) {
  const { userId, steps, distanceMeters } = await req.json();
  if (!userId) return Response.json({ error: "userId required" }, { status: 400 });

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Get or create streak
  const { data: existingStreak } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  let currentStreak = existingStreak?.current_streak || 0;
  let longestStreak = existingStreak?.longest_streak || 0;
  const lastActive = existingStreak?.last_active_date;

  if (lastActive === today) {
    // Already active today, no streak change
  } else if (lastActive === yesterday) {
    currentStreak += 1;
    longestStreak = Math.max(longestStreak, currentStreak);
  } else {
    currentStreak = 1;
  }

  await supabase.from("user_streaks").upsert({
    user_id: userId,
    current_streak: currentStreak,
    longest_streak: longestStreak,
    last_active_date: today,
    total_steps: (existingStreak?.total_steps || 0) + (steps || 0),
    total_distance_meters: (existingStreak?.total_distance_meters || 0) + (distanceMeters || 0),
    total_activities: (existingStreak?.total_activities || 0) + 1,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  // Update daily challenge
  const { data: todayChallenge } = await supabase
    .from("daily_challenges")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  const newSteps = (todayChallenge?.steps_achieved || 0) + (steps || 0);
  await supabase.from("daily_challenges").upsert({
    user_id: userId,
    date: today,
    steps_goal: 10000,
    steps_achieved: newSteps,
    completed: newSteps >= 10000,
  }, { onConflict: "user_id,date" });

  return Response.json({ success: true, currentStreak, longestStreak });
}
