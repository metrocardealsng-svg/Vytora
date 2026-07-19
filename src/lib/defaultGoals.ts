import { Goal } from "@/types/goal";

export function updateGoalProgress(
  goals: Goal[],
  category: Goal["category"],
  amount: number
) {
  return goals.map((goal) => {
    if (goal.category !== category) return goal;

    const progress = Math.min(goal.progress + amount, goal.target);

    return {
      ...goal,
      progress,
      completed: progress >= goal.target,
    };
  });
}

export function completedGoals(goals: Goal[]) {
  return goals.filter((goal) => goal.completed);
}

export function totalXP(goals: Goal[]) {
  return goals
    .filter((goal) => goal.completed)
    .reduce((xp, goal) => xp + goal.xp, 0);
}
