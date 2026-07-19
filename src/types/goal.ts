export type GoalCategory =
  | "steps"
  | "distance"
  | "calories"
  | "water"
  | "sleep"
  | "workout"
  | "running"
  | "walking"
  | "cycling"
  | "custom";

export interface Goal {
  id: string;

  title: string;

  category: GoalCategory;

  target: number;

  progress: number;

  unit: string;

  completed: boolean;

  xp: number;

  color: string;

  createdAt: string;
}

export interface Badge {
  id: string;

  title: string;

  description: string;

  icon: string;

  unlocked: boolean;

  unlockedAt?: string;
}

export interface UserLevel {
  level: number;

  xp: number;

  nextLevelXP: number;

  title: string;
}

export interface DailyStreak {
  current: number;

  longest: number;

  lastCompleted: string;
}
