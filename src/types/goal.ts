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
