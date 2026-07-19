"use client";

import { useMemo, useState } from "react";
import GoalCard from "./GoalCard";
import LevelCard from "./LevelCard";
import BadgeGrid from "./BadgeGrid";
import StreakCard from "./StreakCard";
import { Goal } from "@/types/goals";
import {
  completedGoals,
  totalXP,
  updateGoalProgress,
} from "@/lib/goals";

export default function GoalManager() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Daily Steps",
      category: "steps",
      target: 10000,
      progress: 4200,
      unit: "steps",
      completed: false,
      xp: 100,
      color: "#22c55e",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Drink Water",
      category: "water",
      target: 3,
      progress: 1,
      unit: "litres",
      completed: false,
      xp: 60,
      color: "#3b82f6",
      createdAt: new Date().toISOString(),
    },
  ]);

  const xp = useMemo(() => totalXP(goals), [goals]);

  const finishSteps = () => {
    setGoals((g) => updateGoalProgress(g, "steps", 6000));
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            title={goal.title}
            progress={goal.progress}
            target={goal.target}
            unit={goal.unit}
          />
        ))}

        <LevelCard xp={xp} />
      </div>

      <div className="mt-8">
        <button
          onClick={finishSteps}
          className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-black"
        >
          Complete Daily Steps
        </button>
      </div>

      <div className="mt-10">
        <StreakCard />
      </div>

      <div className="mt-10">
        <BadgeGrid />
      </div>

      <div className="mt-8 rounded-xl border border-slate-800 p-5">
        <h3 className="font-bold text-emerald-400">
          Completed Goals
        </h3>

        <p className="mt-2 text-slate-400">
          {completedGoals(goals).length}
        </p>
      </div>
    </>
  );
}
