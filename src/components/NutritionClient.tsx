"use client";

export default function NutritionClient({ goal = "general" }: { goal?: string }) {
  goal,
}: {
  goal: string;
}) {
  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold text-white">
        Nutrition Planner
      </h1>

      <p className="mt-4 text-slate-300">
        Fitness Goal: <strong>{goal}</strong>
      </p>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
        Meal planner coming soon...
      </div>
    </div>
  );
}
