"use client";

import { useState } from "react";

const CATEGORIES = ["All", "Food Secrets", "HIIT", "Carb Cycling", "Recovery", "Mindset"];

const TIPS = [
  {
    category: "Food Secrets",
    emoji: "🍲",
    title: "Egusi Soup Burns Fat",
    body: "Egusi is 70% fat and protein, zero sugar. It keeps you full for 5-6 hours. Eat it with a small swallow before a workout and your energy is steady all through. Skip the eba, use oat swallow instead to cut carbs by 40%.",
    tag: "Nigerian Food",
  },
  {
    category: "Food Secrets",
    emoji: "🌶",
    title: "Pepper Soup = Free Fat Burner",
    body: "The capsaicin in Nigerian pepper raises your body temperature and boosts metabolism by up to 8% for 2 hours after eating. Goat meat pepper soup after a workout is one of the best recovery meals you can have. High protein, anti-inflammatory, zero junk.",
    tag: "Secret",
  },
  {
    category: "Food Secrets",
    emoji: "🫘",
    title: "Beans is the Nigerian Protein King",
    body: "100g of cooked beans = 9g of protein and costs less than ₦200. Bodybuilders in Nigeria spend thousands on protein powder when ewa agoyin does the same job. Eat beans with a boiled egg for a complete amino acid profile.",
    tag: "Budget Tip",
  },
  {
    category: "Food Secrets",
    emoji: "🐟",
    title: "Stockfish and Smoked Fish are Superfoods",
    body: "Dried and smoked fish have concentrated omega-3s. They reduce inflammation, help muscle recovery, and are dirt cheap. Add them to your soups. Your joints will thank you after heavy training weeks.",
    tag: "Nigerian Food",
  },
  {
    category: "Food Secrets",
    emoji: "🥜",
    title: "Tiger Nuts (Ofio) Build Muscle",
    body: "Tiger nut milk has more iron than cow milk and healthy fats that boost testosterone. Nigerians have been drinking kunu aya for centuries without knowing it is basically a natural pre-workout. Drink a cup before morning runs.",
    tag: "Secret",
  },
  {
    category: "Food Secrets",
    emoji: "🍃",
    title: "Zobo Reduces Water Retention",
    body: "Unsweetened zobo (hibiscus tea) is a natural diuretic and antioxidant. Drink it cold after workouts instead of Lucozade. No sugar. No calories. Flushes excess sodium and helps you look leaner within days.",
    tag: "Drink Hack",
  },
  {
    category: "HIIT",
    emoji: "🔥",
    title: "The 4-7 Protocol for Nigerians",
    body: "No gym? No problem. 4 minutes on, 7 seconds rest. Do burpees, mountain climbers, or high knees. 4 rounds. 20 minutes total. This beats 45 minutes of jogging for fat loss. Do it at 6am before the heat kicks in.",
    tag: "HIIT",
  },
  {
    category: "HIIT",
    emoji: "⚡",
    title: "Market Sprint Training",
    body: "Sprint from one end of your street to the other. Walk back. Repeat 8 times. That is a full HIIT session. Takes 15 minutes. Burns more fat than 45 minutes on a treadmill. Your neighbors will think you are crazy. Results will shut them up.",
    tag: "HIIT",
  },
  {
    category: "HIIT",
    emoji: "🌅",
    title: "Beat the Lagos Heat",
    body: "Train before 7am or after 6pm. Between those hours the heat increases perceived effort by 30%. You are not weak, the sun is just brutal. Hydrate with water plus a pinch of salt before outdoor workouts. Electrolytes matter more than sports drinks.",
    tag: "Nigeria Specific",
  },
  {
    category: "HIIT",
    emoji: "💪",
    title: "Staircase is Your Free Gym",
    body: "Running stairs builds your glutes, calves, and cardio faster than any machine. Find a 3-storey building. Run up, walk down. 10 rounds. Done. The best athletes in the world use stairs. Eliud Kipchoge trained on hills before he broke the marathon record.",
    tag: "No Equipment",
  },
  {
    category: "Carb Cycling",
    emoji: "🔄",
    title: "Carb Cycling the Nigerian Way",
    body: "High carb days: eat rice, yam, plantain. Do this on your hardest workout days. Low carb days: eat beans, fish, vegetables, eggs. Do this on rest days. Your body burns fat on low carb days and builds muscle on high carb days. Simple. No calorie counting.",
    tag: "Strategy",
  },
  {
    category: "Carb Cycling",
    emoji: "🍠",
    title: "Yam is Better than Rice",
    body: "Yam has a lower glycemic index than white rice. It releases energy slower so you do not crash mid-workout. Eat boiled yam with egg sauce before training. Skip fried yam. The oil kills the benefit.",
    tag: "Carb Cycling",
  },
  {
    category: "Carb Cycling",
    emoji: "🌽",
    title: "Plantain Timing is Everything",
    body: "Ripe plantain before a workout = fast energy. Unripe plantain after a workout = slower digestion, better for recovery. This is not chemistry, it is just how starch works. Most Nigerians eat plantain randomly. Time it and you will notice the difference.",
    tag: "Carb Cycling",
  },
  {
    category: "Recovery",
    emoji: "😴",
    title: "Sleep is the Real Supplement",
    body: "Your muscles do not grow in the gym. They grow at night while you sleep. 7-8 hours is not laziness, it is training. Nigerians who stay up till 2am watching movies and wonder why they are not building muscle need to hear this. Sleep is a discipline.",
    tag: "Recovery",
  },
  {
    category: "Recovery",
    emoji: "🧂",
    title: "Salt After Sweating is Not Bad",
    body: "You lose sodium when you sweat. In Nigerian heat you lose more than anyone. Add a small pinch of salt to your water after intense workouts. This is not unhealthy. It is what keeps your muscles from cramping and your brain from fogging.",
    tag: "Recovery",
  },
  {
    category: "Recovery",
    emoji: "🍌",
    title: "Banana Before Bed",
    body: "Banana has magnesium and tryptophan. Both help you sleep deeper. Eat one small banana 30 minutes before bed on heavy training days. You will sleep better and wake up less sore. Costs ₦50. Works better than most supplements.",
    tag: "Recovery",
  },
  {
    category: "Mindset",
    emoji: "🧠",
    title: "Consistency Beats Perfection",
    body: "Missing one workout does not matter. Missing two in a row is where habits break. The rule is simple: never miss twice. Did not train Monday? Train Tuesday no matter what. That is the whole system.",
    tag: "Mindset",
  },
  {
    category: "Mindset",
    emoji: "📱",
    title: "Track Everything",
    body: "People who track their workouts lose 2x more weight than those who do not. You do not need to be perfect. You just need to see the data. Use Vytora every single session. Even bad workouts count when they are recorded.",
    tag: "Mindset",
  },
  {
    category: "Mindset",
    emoji: "🎯",
    title: "Set a Nigerian Goal",
    body: "Not a generic goal. A specific, embarrassing, personal goal. Not 'I want to get fit.' Try 'I want to run Eko 10K in March without stopping.' Specific goals create specific actions. Vague goals create vague effort.",
    tag: "Mindset",
  },
];

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? TIPS
    : TIPS.filter((t) => t.category === activeCategory);

  // Get today's featured tip based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const featured = TIPS[dayOfYear % TIPS.length];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Daily Tips</h1>
        <p className="mt-1 text-slate-400">Fitness secrets built for Nigerians. New tip every day.</p>
      </div>

      {/* Featured tip of the day */}
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-mint/20 to-teal/5 p-6 ring-1 ring-mint/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full bg-mint/20 px-3 py-1 text-xs font-black text-mint">TODAY'S TIP</span>
          <span className="text-xs text-slate-500">{featured.tag}</span>
        </div>
        <div className="text-3xl mb-2">{featured.emoji}</div>
        <h2 className="text-xl font-black text-white mb-2">{featured.title}</h2>
        <p className="text-sm text-slate-300 leading-relaxed">{featured.body}</p>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              activeCategory === cat
                ? "bg-mint text-ink"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tips grid */}
      <div className="space-y-4">
        {filtered.map((tip, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-5 cursor-pointer hover:ring-1 hover:ring-white/10 transition-all"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-mint">{tip.category}</span>
                  <span className="text-xs text-slate-600">{tip.tag}</span>
                </div>
                <h3 className="font-black text-white">{tip.title}</h3>
                {expanded === i && (
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{tip.body}</p>
                )}
                {expanded !== i && (
                  <p className="mt-1 text-xs text-slate-500 truncate">{tip.body}</p>
                )}
              </div>
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 flex-shrink-0 text-slate-500 transition-transform ${expanded === i ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
