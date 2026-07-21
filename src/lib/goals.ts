import { Goal } from "@/types/goals";

export function updateGoalProgress(
  goals: Goal[],
  category: Goal["category"],
  amount: number
): Goal[] {
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

export function completedGoals(goals: Goal[]): Goal[] {
  return goals.filter((goal) => goal.completed);
}

export function activeGoals(goals: Goal[]): Goal[] {
  return goals.filter((goal) => !goal.completed);
}

export function totalXP(goals: Goal[]): number {
  return goals
    .filter((goal) => goal.completed)
    .reduce((xp, goal) => xp + goal.xp, 0);
}
