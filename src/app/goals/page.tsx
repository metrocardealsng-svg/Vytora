import GoalCard from "@/components/goals/GoalCard";
import LevelCard from "@/components/goals/LevelCard";
import BadgeGrid from "@/components/goals/BadgeGrid";
import StreakCard from "@/components/goals/StreakCard";

export default function GoalsPage() {
  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <h1 className="text-4xl font-black text-white">
        Goals & Achievements
      </h1>

      <GoalCard />
      <LevelCard xp={320} />
      <StreakCard days={7} />
      <BadgeGrid />
    </main>
  );
}
