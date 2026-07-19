"use client";

interface Props {
  progress: number;
  target: number;
  color: string;
}

export default function GoalProgress({
  progress,
  target,
  color,
}: Props) {
  const percent = Math.min((progress / target) * 100, 100);

  return (
    <div className="mt-4">
      <div className="mb-2 flex justify-between text-sm text-slate-400">
        <span>{progress}</span>

        <span>{target}</span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percent}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}
