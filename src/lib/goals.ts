import { Goal } from "@/types/goals";
export const totalXP = (goals: Goal[]) => {
  return goals.reduce((total, goal) => {
    return total + (goal.xp || 0);
  }, 0);
};


export const totalXP = (goals: Goal[]) => {
  return goals.reduce((total, goal) => {
    return total + (goal.xp || 0);
  }, 0);
};

export const completedGoals = (goals: Goal[]) => {
  return goals.filter((goal) => goal.completed);
};

export const updateGoalProgress = (
  goals: Goal[],
  category: string,
  progress: number
) => {
  return goals.map((goal) =>
    goal.category === category
      ? {
          ...goal,
          progress,
          completed: progress >= goal.target,
        }
      : goal
  );
};
export const updateGoalProgress = (
  goals: Goal[],
  category: string,
  progress: number
) => {
  return goals.map((goal) =>
    goal.category === category
      ? {
          ...goal,
          progress,
          completed: progress >= goal.target,
        }
      : goal
  );
};
export const defaultGoals: Goal[] = [
  {
    id: crypto.randomUUID(),

    title: "Daily Steps",

    category: "steps",

    target: 10000,

    progress: 0,

    unit: "steps",

    completed: false,

    xp: 100,

    color: "#34E0A1",

    createdAt: new Date().toISOString(),
  },

  {
    id: crypto.randomUUID(),

    title: "Drink Water",

    category: "water",

    target: 3,

    progress: 0,

    unit: "L",

    completed: false,

    xp: 60,

    color: "#38BDF8",

    createdAt: new Date().toISOString(),
  },

  {
    id: crypto.randomUUID(),

    title: "Sleep",

    category: "sleep",

    target: 8,

    progress: 0,

    unit: "hrs",

    completed: false,

    xp: 80,

    color: "#A78BFA",

    createdAt: new Date().toISOString(),
  }
];
