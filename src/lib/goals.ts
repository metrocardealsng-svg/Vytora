import { Goal } from "@/types/goals";

export const totalXP = (goals: Goal[]) => {
  return goals.reduce((total, goal) => {
    return total + (goal.xp || 0);
  }, 0);
};

export const completedGoals = (goals: Goal[]) => {
  return goals.filter((goal) => goal.completed);
};

export const activeGoals = (goals: Goal[]) => {
  return goals.filter((goal) => !goal.completed);
};
