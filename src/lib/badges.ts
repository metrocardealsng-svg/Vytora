export type Badge = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  check: (stats: UserStats) => boolean;
};

export type UserStats = {
  totalSteps: number;
  totalDistanceMeters: number;
  totalActivities: number;
  currentStreak: number;
  longestStreak: number;
};

export const BADGES: Badge[] = [
  { id: "first_step", name: "First Step", description: "Complete your first activity", emoji: "👟", color: "from-green-400 to-emerald-500", check: (s) => s.totalActivities >= 1 },
  { id: "step_1k", name: "1K Steps", description: "Walk 1,000 steps total", emoji: "🚶", color: "from-blue-400 to-cyan-500", check: (s) => s.totalSteps >= 1000 },
  { id: "step_10k", name: "10K Day", description: "Hit 10,000 steps in a day", emoji: "🔥", color: "from-orange-400 to-red-500", check: (s) => s.totalSteps >= 10000 },
  { id: "step_100k", name: "100K Club", description: "100,000 total steps", emoji: "💯", color: "from-purple-400 to-pink-500", check: (s) => s.totalSteps >= 100000 },
  { id: "step_1m", name: "Million Mover", description: "1 million total steps", emoji: "🏆", color: "from-yellow-400 to-orange-500", check: (s) => s.totalSteps >= 1000000 },
  { id: "km_5", name: "5K Runner", description: "Run or walk 5km total", emoji: "🏃", color: "from-mint to-teal-500", check: (s) => s.totalDistanceMeters >= 5000 },
  { id: "km_10", name: "10K Beast", description: "Cover 10km total distance", emoji: "⚡", color: "from-yellow-400 to-amber-500", check: (s) => s.totalDistanceMeters >= 10000 },
  { id: "km_50", name: "50K Warrior", description: "50km total distance", emoji: "🦁", color: "from-red-400 to-rose-500", check: (s) => s.totalDistanceMeters >= 50000 },
  { id: "km_100", name: "Century Club", description: "100km total distance", emoji: "🌍", color: "from-blue-500 to-indigo-600", check: (s) => s.totalDistanceMeters >= 100000 },
  { id: "streak_3", name: "3-Day Streak", description: "Train 3 days in a row", emoji: "🔥", color: "from-orange-300 to-red-400", check: (s) => s.currentStreak >= 3 },
  { id: "streak_7", name: "Week Warrior", description: "7-day training streak", emoji: "📅", color: "from-green-400 to-teal-500", check: (s) => s.currentStreak >= 7 },
  { id: "streak_30", name: "30-Day Legend", description: "Train every day for a month", emoji: "👑", color: "from-yellow-400 to-amber-600", check: (s) => s.currentStreak >= 30 },
  { id: "activities_5", name: "Getting Started", description: "Complete 5 activities", emoji: "✅", color: "from-teal-400 to-cyan-500", check: (s) => s.totalActivities >= 5 },
  { id: "activities_20", name: "Consistent Mover", description: "Complete 20 activities", emoji: "💪", color: "from-violet-400 to-purple-500", check: (s) => s.totalActivities >= 20 },
  { id: "activities_50", name: "Vytora Elite", description: "Complete 50 activities", emoji: "🌟", color: "from-pink-400 to-rose-500", check: (s) => s.totalActivities >= 50 },
];

export function checkNewBadges(stats: UserStats, existing: string[]): Badge[] {
  return BADGES.filter((b) => !existing.includes(b.id) && b.check(stats));
}
