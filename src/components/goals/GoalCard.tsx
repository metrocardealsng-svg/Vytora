type Props = {
  title: string;
  progress: number;
  target: number;
  unit: string;
};

export default function GoalCard({
  title,
 progress,
  target,
  unit,
}: Props) {
  const percent = Math.min((progress / target) * 100, 100);

  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-800">
      <h3 className="text-xl font-bold text-white">{title}</h3>

      <p className="mt-2 text-slate-400">
        {progress} / {target} {unit}
      </p>

      <div className="mt-4 h-3 rounded-full bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
