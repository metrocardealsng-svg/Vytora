const badges = [
  "🏃 First Run",
  "🚶 10k Steps",
  "💧 Hydration",
  "🔥 7 Day Streak",
  "🥗 Healthy Eating",
  "🏆 Champion",
];

export default function BadgeGrid() {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 border border-slate-800">
      <h2 className="text-2xl font-bold text-white">
        Achievements
      </h2>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {badges.map((badge) => (
          <div
            key={badge}
            className="rounded-xl bg-slate-800 p-4 text-center text-white"
          >
            {badge}
          </div>
        ))}
      </div>
    </div>
  );
}
