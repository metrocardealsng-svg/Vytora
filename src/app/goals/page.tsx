import GoalCard from "@/components/goals/GoalCard";
import LevelCard from "@/components/goals/LevelCard";
import StreakCard from "@/components/goals/StreakCard";
import BadgeGrid from "@/components/goals/BadgeGrid";

export default function GoalsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        <h1 className="text-5xl font-black">
          Goals & Achievements
        </h1>

        <p className="mt-3 text-slate-400">
          Set your own fitness goals, level up, unlock achievements and build
          streaks every day.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">

          <GoalCard />

          <LevelCard xp={350} />

        </div>

        <div className="mt-10">

          <StreakCard days={8} />

        </div>

        <div className="mt-14">

          <h2 className="mb-6 text-3xl font-bold">
            Badges
          </h2>

          <BadgeGrid />

        </div>

      </div>
    </main>
  );
}
