type Props = {
  xp: number;
};

export default function LevelCard({ xp }: Props) {
  const level = Math.floor(xp / 500) + 1;
  const currentXP = xp % 500;
  const progress = (currentXP / 500) * 100;
  const nextLevelXP = 500 - currentXP;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white">
          Level {level}
        </h2>

        <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-400">
          {xp} XP
        </div>
      </div>

      <p className="mt-4 text-slate-400">
        {nextLevelXP} XP until Level {level + 1}
      </p>

      <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex justify-between text-sm text-slate-500">
        <span>{currentXP} XP</span>
        <span>500 XP</span>
      </div>

    </div>
  );
}
