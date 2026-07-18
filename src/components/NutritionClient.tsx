"use client";

import { useEffect, useState } from "react";

type Log = {
  id: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meal_type: string;
  logged_at: string;
};

const NIGERIAN_FOODS = [
  { name: "Jollof Rice (1 plate)", calories: 370, protein_g: 7, carbs_g: 65, fat_g: 8, unit: "plate" },
  { name: "Fried Rice (1 plate)", calories: 400, protein_g: 8, carbs_g: 60, fat_g: 12, unit: "plate" },
  { name: "Egusi Soup (1 bowl)", calories: 320, protein_g: 18, carbs_g: 8, fat_g: 24, unit: "bowl" },
  { name: "Ogbono Soup (1 bowl)", calories: 280, protein_g: 15, carbs_g: 6, fat_g: 20, unit: "bowl" },
  { name: "Pounded Yam (1 wrap)", calories: 330, protein_g: 3, carbs_g: 78, fat_g: 1, unit: "wrap" },
  { name: "Eba / Garri (1 wrap)", calories: 290, protein_g: 2, carbs_g: 70, fat_g: 0, unit: "wrap" },
  { name: "Amala (1 wrap)", calories: 270, protein_g: 3, carbs_g: 64, fat_g: 1, unit: "wrap" },
  { name: "Boiled Yam (200g)", calories: 246, protein_g: 3, carbs_g: 58, fat_g: 0, unit: "serving" },
  { name: "Suya (100g)", calories: 195, protein_g: 22, carbs_g: 4, fat_g: 10, unit: "serving" },
  { name: "Pepper Soup (1 bowl)", calories: 180, protein_g: 20, carbs_g: 4, fat_g: 8, unit: "bowl" },
  { name: "Moi Moi (1 wrap)", calories: 160, protein_g: 10, carbs_g: 18, fat_g: 5, unit: "wrap" },
  { name: "Akara (3 pieces)", calories: 210, protein_g: 8, carbs_g: 22, fat_g: 10, unit: "serving" },
  { name: "Beans (1 plate)", calories: 230, protein_g: 15, carbs_g: 40, fat_g: 3, unit: "plate" },
  { name: "Plantain Fried (4 pcs)", calories: 240, protein_g: 2, carbs_g: 48, fat_g: 6, unit: "serving" },
  { name: "Plantain Boiled (4 pcs)", calories: 180, protein_g: 2, carbs_g: 44, fat_g: 0, unit: "serving" },
  { name: "Boiled Egg (1)", calories: 78, protein_g: 6, carbs_g: 0, fat_g: 5, unit: "egg" },
  { name: "Fried Egg (1)", calories: 92, protein_g: 6, carbs_g: 0, fat_g: 7, unit: "egg" },
  { name: "Grilled Chicken (100g)", calories: 165, protein_g: 31, carbs_g: 0, fat_g: 4, unit: "serving" },
  { name: "Fried Chicken (1 piece)", calories: 245, protein_g: 20, carbs_g: 8, fat_g: 14, unit: "piece" },
  { name: "Catfish (100g)", calories: 105, protein_g: 18, carbs_g: 0, fat_g: 3, unit: "serving" },
  { name: "Croaker Fish (100g)", calories: 95, protein_g: 20, carbs_g: 0, fat_g: 2, unit: "serving" },
  { name: "Zobo (1 cup, no sugar)", calories: 15, protein_g: 0, carbs_g: 3, fat_g: 0, unit: "cup" },
  { name: "Kunu (1 cup)", calories: 120, protein_g: 2, carbs_g: 28, fat_g: 1, unit: "cup" },
  { name: "Tiger Nut Milk (1 cup)", calories: 140, protein_g: 2, carbs_g: 20, fat_g: 6, unit: "cup" },
  { name: "Bread (2 slices)", calories: 160, protein_g: 5, carbs_g: 30, fat_g: 2, unit: "serving" },
  { name: "Indomie Noodles (1 pack)", calories: 330, protein_g: 7, carbs_g: 52, fat_g: 11, unit: "pack" },
  { name: "Oat Swallow (1 wrap)", calories: 190, protein_g: 6, carbs_g: 38, fat_g: 3, unit: "wrap" },
  { name: "Garden Egg Stew (1 bowl)", calories: 120, protein_g: 4, carbs_g: 14, fat_g: 6, unit: "bowl" },
  { name: "Coconut (half)", calories: 180, protein_g: 2, carbs_g: 8, fat_g: 17, unit: "serving" },
  { name: "Groundnut (small pack)", calories: 160, protein_g: 7, carbs_g: 6, fat_g: 14, unit: "pack" },
];

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];
const CALORIE_GOAL = 2000;

const MEAL_PLANS: Record<string, { day: string; meals: { type: string; food: string; cal: number }[] }[]> = {
  weight_loss: [
    { day: "Monday", meals: [
      { type: "Breakfast", food: "Akara + Zobo (no sugar)", cal: 225 },
      { type: "Lunch", food: "Beans + small Eba", cal: 520 },
      { type: "Dinner", food: "Pepper Soup (fish)", cal: 180 },
      { type: "Snack", food: "Boiled Egg x2", cal: 156 },
    ]},
    { day: "Tuesday", meals: [
      { type: "Breakfast", food: "Oat Swallow + Garden Egg Stew", cal: 310 },
      { type: "Lunch", food: "Grilled Chicken + Boiled Yam", cal: 411 },
      { type: "Dinner", food: "Egusi Soup (light) + Oat Swallow", cal: 510 },
      { type: "Snack", food: "Tiger Nut Milk", cal: 140 },
    ]},
    { day: "Wednesday", meals: [
      { type: "Breakfast", food: "Moi Moi x2", cal: 320 },
      { type: "Lunch", food: "Jollof Rice (half plate) + Grilled Chicken", cal: 350 },
      { type: "Dinner", food: "Ogbono Soup + small Eba", cal: 570 },
      { type: "Snack", food: "Zobo drink", cal: 15 },
    ]},
    { day: "Thursday", meals: [
      { type: "Breakfast", food: "Boiled Plantain + Egg Sauce", cal: 272 },
      { type: "Lunch", food: "Beans + Plantain (boiled)", cal: 410 },
      { type: "Dinner", food: "Pepper Soup + small Amala", cal: 450 },
      { type: "Snack", food: "Groundnut (small pack)", cal: 160 },
    ]},
    { day: "Friday", meals: [
      { type: "Breakfast", food: "Akara + Kunu", cal: 330 },
      { type: "Lunch", food: "Catfish + Boiled Yam", cal: 351 },
      { type: "Dinner", food: "Egusi Soup + Oat Swallow", cal: 510 },
      { type: "Snack", food: "Coconut (half)", cal: 180 },
    ]},
    { day: "Saturday", meals: [
      { type: "Breakfast", food: "Oat + Tiger Nut Milk", cal: 330 },
      { type: "Lunch", food: "Suya (100g) + Boiled Yam", cal: 441 },
      { type: "Dinner", food: "Pepper Soup", cal: 180 },
      { type: "Snack", food: "Boiled Egg x2", cal: 156 },
    ]},
    { day: "Sunday", meals: [
      { type: "Breakfast", food: "Moi Moi + Zobo", cal: 175 },
      { type: "Lunch", food: "Jollof Rice + Grilled Chicken", cal: 535 },
      { type: "Dinner", food: "Garden Egg Stew + Oat Swallow", cal: 310 },
      { type: "Snack", food: "Groundnut", cal: 160 },
    ]},
  ],
  muscle: [
    { day: "Monday", meals: [
      { type: "Breakfast", food: "Boiled Egg x3 + Bread", cal: 394 },
      { type: "Lunch", food: "Jollof Rice + Grilled Chicken x2", cal: 700 },
      { type: "Dinner", food: "Egusi Soup + Pounded Yam", cal: 650 },
      { type: "Snack", food: "Tiger Nut Milk + Groundnut", cal: 300 },
    ]},
    { day: "Tuesday", meals: [
      { type: "Breakfast", food: "Beans + Fried Plantain", cal: 470 },
      { type: "Lunch", food: "Fried Rice + Fried Chicken", cal: 645 },
      { type: "Dinner", food: "Ogbono Soup + Eba", cal: 570 },
      { type: "Snack", food: "Akara x3 + Kunu", cal: 330 },
    ]},
  ],
  general: [
    { day: "Monday", meals: [
      { type: "Breakfast", food: "Moi Moi + Zobo", cal: 175 },
      { type: "Lunch", food: "Jollof Rice + Chicken", cal: 535 },
      { type: "Dinner", food: "Egusi Soup + Eba", cal: 600 },
      { type: "Snack", food: "Boiled Egg + Tiger Nut Milk", cal: 218 },
    ]},
    { day: "Tuesday", meals: [
      { type: "Breakfast", food: "Akara + Kunu", cal: 330 },
      { type: "Lunch", food: "Beans + Boiled Yam", cal: 476 },
      { type: "Dinner", food: "Pepper Soup + Amala", cal: 450 },
      { type: "Snack", food: "Groundnut", cal: 160 },
    ]},
  ],
};

export default function NutritionClient({ goal }: { goal: string }) {
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof NIGERIAN_FOODS[0] | null>(null);
  const [mealType, setMealType] = useState("lunch");
  const [quantity, setQuantity] = useState("1");
  const [adding, setAdding] = useState(false);
  const [tab, setTab] = useState<"log" | "plan">("log");
  const [planDay, setPlanDay] = useState(0);

  const filtered = search.length > 1
    ? NIGERIAN_FOODS.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  useEffect(() => { loadLogs(); }, []);

  async function loadLogs() {
    const res = await fetch("/api/nutrition");
    const data = await res.json();
    if (data.logs) setLogs(data.logs);
  }

  async function addLog() {
    if (!selected) return;
    setAdding(true);
    await fetch("/api/nutrition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        food_name: selected.name,
        calories: selected.calories,
        protein_g: selected.protein_g,
        carbs_g: selected.carbs_g,
        fat_g: selected.fat_g,
        meal_type: mealType,
        quantity: parseFloat(quantity) || 1,
        unit: selected.unit,
      }),
    });
    setSelected(null);
    setSearch("");
    setQuantity("1");
    setAdding(false);
    loadLogs();
  }

  async function deleteLog(id: string) {
    await fetch("/api/nutrition", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadLogs();
  }

  const totalCals = logs.reduce((s, l) => s + l.calories, 0);
  const totalProtein = logs.reduce((s, l) => s + (l.protein_g || 0), 0);
  const totalCarbs = logs.reduce((s, l) => s + (l.carbs_g || 0), 0);
  const totalFat = logs.reduce((s, l) => s + (l.fat_g || 0), 0);
  const calProgress = Math.min(100, Math.round((totalCals / CALORIE_GOAL) * 100));

  const planKey = (goal in MEAL_PLANS) ? goal : "general";
  const plan = MEAL_PLANS[planKey];
  const todayPlan = plan[planDay % plan.length];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Nutrition</h1>
        <p className="mt-1 text-slate-400">Track your Nigerian meals. Hit your daily goals.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["log", "plan"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold capitalize transition-colors ${tab === t ? "bg-mint text-ink" : "bg-white/5 text-slate-400"}`}>
            {t === "log" ? "Food Log" : "Meal Plan"}
          </button>
        ))}
      </div>

      {tab === "log" && (
        <>
          {/* Calorie summary */}
          <div className="glass rounded-3xl p-5">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-white">{totalCals} kcal eaten</span>
              <span className="text-sm text-slate-400">{CALORIE_GOAL} goal</span>
            </div>
            <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-4">
              <div className="h-full rounded-full bg-gradient-to-r from-mint to-teal transition-all"
                style={{ width: `${calProgress}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Protein", value: `${Math.round(totalProtein)}g`, color: "text-blue-400" },
                { label: "Carbs", value: `${Math.round(totalCarbs)}g`, color: "text-yellow-400" },
                { label: "Fat", value: `${Math.round(totalFat)}g`, color: "text-red-400" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-white/5 py-2">
                  <p className={`text-lg font-black ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Food search */}
          <div className="glass rounded-3xl p-5 space-y-3">
            <h2 className="font-bold text-white">Add Food</h2>
            <div className="flex gap-2">
              <select value={mealType} onChange={(e) => setMealType(e.target.value)}
                className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white outline-none">
                {MEAL_TYPES.map((m) => <option key={m} value={m} className="bg-[#0e1118] capitalize">{m}</option>)}
              </select>
              <input value={search} onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
                placeholder="Search Nigerian foods..."
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-mint/50" />
            </div>

            {filtered.length > 0 && !selected && (
              <div className="rounded-xl bg-white/5 divide-y divide-white/5 max-h-48 overflow-y-auto">
                {filtered.map((f) => (
                  <button key={f.name} onClick={() => { setSelected(f); setSearch(f.name); }}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5">
                    <span className="text-sm text-white">{f.name}</span>
                    <span className="text-xs text-mint">{f.calories} kcal</span>
                  </button>
                ))}
              </div>
            )}

            {selected && (
              <div className="rounded-xl bg-mint/10 ring-1 ring-mint/30 p-4 space-y-3">
                <p className="font-bold text-white text-sm">{selected.name}</p>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div><p className="text-white font-bold">{selected.calories}</p><p className="text-slate-500">kcal</p></div>
                  <div><p className="text-white font-bold">{selected.protein_g}g</p><p className="text-slate-500">protein</p></div>
                  <div><p className="text-white font-bold">{selected.carbs_g}g</p><p className="text-slate-500">carbs</p></div>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="text-xs text-slate-400">Quantity:</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                    min="0.5" max="10" step="0.5"
                    className="w-20 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-sm text-white outline-none" />
                  <span className="text-xs text-slate-500">{selected.unit}</span>
                </div>
                <button onClick={addLog} disabled={adding}
                  className="w-full rounded-xl bg-gradient-to-r from-mint to-teal py-2.5 text-sm font-black text-ink disabled:opacity-60">
                  {adding ? "Adding..." : "Add to log"}
                </button>
              </div>
            )}
          </div>

          {/* Today's log */}
          {logs.length > 0 && (
            <div className="glass rounded-3xl p-5">
              <h2 className="font-bold text-white mb-4">Today's Log</h2>
              <div className="space-y-2">
                {MEAL_TYPES.map((mt) => {
                  const mtLogs = logs.filter((l) => l.meal_type === mt);
                  if (mtLogs.length === 0) return null;
                  return (
                    <div key={mt}>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5 capitalize">{mt}</p>
                      {mtLogs.map((l) => (
                        <div key={l.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                          <div>
                            <p className="text-sm text-white">{l.food_name}</p>
                            <p className="text-xs text-slate-500">{l.calories} kcal · {Math.round(l.protein_g || 0)}g protein</p>
                          </div>
                          <button onClick={() => deleteLog(l.id)} className="text-slate-600 hover:text-red-400 text-lg px-2">×</button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "plan" && (
        <div className="space-y-4">
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">
                {planKey === "weight_loss" ? "Weight Loss" : planKey === "muscle" ? "Muscle Building" : "Balanced"} Plan
              </h2>
              <span className="text-xs text-slate-400 capitalize">{goal} goal</span>
            </div>

            {/* Day selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
              {plan.map((d, i) => (
                <button key={d.day} onClick={() => setPlanDay(i)}
                  className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${planDay === i ? "bg-mint text-ink" : "bg-white/5 text-slate-400"}`}>
                  {d.day.slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {todayPlan.meals.map((meal) => (
                <div key={meal.type} className="flex items-start justify-between gap-3 rounded-xl bg-white/5 p-3">
                  <div>
                    <p className="text-xs font-black text-mint uppercase">{meal.type}</p>
                    <p className="text-sm text-white mt-0.5">{meal.food}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{meal.cal} kcal</span>
                </div>
              ))}
              <div className="text-right text-xs text-slate-400">
                Total: {todayPlan.meals.reduce((s, m) => s + m.cal, 0)} kcal
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4 text-sm text-slate-400">
            <p className="font-bold text-white mb-1">How to use this plan</p>
            <p>This 7-day meal plan is built around your <span className="text-mint">{goal.replace("_", " ")}</span> goal using Nigerian foods. Follow it as closely as you can. Log each meal in the Food Log tab to track your actual intake.</p>
          </div>
        </div>
      )}
    </div>
  );
}
