import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nigerian Food Calorie Guide: Eba, Jollof Rice, Pounded Yam & More — Vytora",
  description: "Complete calorie and nutrition guide for Nigerian foods. Calories in jollof rice, eba, pounded yam, egusi soup, suya, akara and more.",
  keywords: ["Nigerian food calories", "calories in jollof rice", "eba calories", "pounded yam calories", "Nigerian diet fitness"],
};

const foods = [
  { name: "Jollof Rice", serving: "1 plate (300g)", cal: 370, protein: 7, carbs: 65, fat: 8, note: "High carb. Good pre-workout meal." },
  { name: "Fried Rice", serving: "1 plate (300g)", cal: 400, protein: 8, carbs: 60, fat: 12, note: "Higher fat than jollof. Eat before workouts." },
  { name: "Eba / Garri", serving: "1 wrap (200g)", cal: 290, protein: 2, carbs: 70, fat: 0, note: "Pure carbs. Fast energy. Low protein." },
  { name: "Pounded Yam", serving: "1 wrap (200g)", cal: 330, protein: 3, carbs: 78, fat: 1, note: "High carb, lower GI than eba." },
  { name: "Amala", serving: "1 wrap (200g)", cal: 270, protein: 3, carbs: 64, fat: 1, note: "Yam flour. Moderate carbs." },
  { name: "Oat Swallow", serving: "1 wrap (200g)", cal: 190, protein: 6, carbs: 38, fat: 3, note: "Best swallow for weight loss. High fibre." },
  { name: "Egusi Soup", serving: "1 bowl (200g)", cal: 320, protein: 18, carbs: 8, fat: 24, note: "High protein and healthy fats. Great for muscle." },
  { name: "Ogbono Soup", serving: "1 bowl (200g)", cal: 280, protein: 15, carbs: 6, fat: 20, note: "Rich in omega-3. Good post-workout." },
  { name: "Pepper Soup", serving: "1 bowl (300g)", cal: 180, protein: 20, carbs: 4, fat: 8, note: "Best low-calorie Nigerian meal. High protein." },
  { name: "Suya", serving: "100g", cal: 195, protein: 22, carbs: 4, fat: 10, note: "Excellent lean protein. Great post-workout." },
  { name: "Moi Moi", serving: "1 wrap (150g)", cal: 160, protein: 10, carbs: 18, fat: 5, note: "High protein, balanced macros." },
  { name: "Akara", serving: "3 pieces", cal: 210, protein: 8, carbs: 22, fat: 10, note: "Good breakfast protein." },
  { name: "Beans (cooked)", serving: "1 plate (250g)", cal: 230, protein: 15, carbs: 40, fat: 3, note: "Budget protein king. Excellent for muscle." },
  { name: "Boiled Plantain", serving: "4 pieces (200g)", cal: 180, protein: 2, carbs: 44, fat: 0, note: "Lower cal than fried. Good carb source." },
  { name: "Fried Plantain", serving: "4 pieces (200g)", cal: 240, protein: 2, carbs: 48, fat: 6, note: "Higher cal. Eat in moderation." },
  { name: "Grilled Chicken", serving: "100g", cal: 165, protein: 31, carbs: 0, fat: 4, note: "Best protein source. Eat this daily." },
  { name: "Catfish", serving: "100g", cal: 105, protein: 18, carbs: 0, fat: 3, note: "Cheap, high protein, low fat." },
  { name: "Boiled Egg", serving: "1 egg", cal: 78, protein: 6, carbs: 0, fat: 5, note: "Perfect pre-workout snack." },
  { name: "Zobo (no sugar)", serving: "1 cup (250ml)", cal: 15, protein: 0, carbs: 3, fat: 0, note: "Antioxidant drink. Zero guilt." },
  { name: "Indomie Noodles", serving: "1 pack", cal: 330, protein: 7, carbs: 52, fat: 11, note: "High cal, low protein. Limit this." },
];

export default function NigerianFoodCalorieGuide() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12">
          <Link href="/blog" className="text-xs text-slate-500 hover:text-mint mb-6 block">← Back to Blog</Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black text-mint uppercase tracking-wider">Nutrition</span>
            <span className="text-xs text-slate-500">8 min read</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-tight mb-4">
            Nigerian Food Calorie Guide: Eba, Jollof Rice, Pounded Yam & More
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Every Nigerian fitness article talks about chicken breast and salad. This one talks about real food. Here is the complete calorie and macro breakdown of the foods Nigerians actually eat.
          </p>

          <div className="glass rounded-2xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase">Food</th>
                    <th className="px-4 py-3 text-xs font-black text-slate-400 uppercase">Serving</th>
                    <th className="px-4 py-3 text-xs font-black text-mint uppercase">Cal</th>
                    <th className="px-4 py-3 text-xs font-black text-blue-400 uppercase">Protein</th>
                    <th className="px-4 py-3 text-xs font-black text-yellow-400 uppercase">Carbs</th>
                    <th className="px-4 py-3 text-xs font-black text-red-400 uppercase">Fat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {foods.map((f) => (
                    <tr key={f.name} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-bold text-white">{f.name}</p>
                        <p className="text-xs text-slate-500">{f.note}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{f.serving}</td>
                      <td className="px-4 py-3 font-black text-mint">{f.cal}</td>
                      <td className="px-4 py-3 text-blue-400">{f.protein}g</td>
                      <td className="px-4 py-3 text-yellow-400">{f.carbs}g</td>
                      <td className="px-4 py-3 text-red-400">{f.fat}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6 text-slate-300">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-3">Key Takeaways</h2>
              <ul className="space-y-2 text-sm">
                <li>✅ <strong className="text-white">Beans</strong> is the cheapest high-protein food in Nigeria at ₦200 per plate</li>
                <li>✅ <strong className="text-white">Pepper soup</strong> is the best low-calorie Nigerian meal. High protein, low carb</li>
                <li>✅ <strong className="text-white">Oat swallow</strong> is better than eba for weight loss. 100 fewer calories per wrap</li>
                <li>✅ <strong className="text-white">Suya</strong> is actually a great post-workout meal. 22g protein per 100g</li>
                <li>⚠️ <strong className="text-white">Indomie</strong> is the worst macro ratio. High calories, low protein</li>
                <li>⚠️ <strong className="text-white">Eba and pounded yam</strong> are pure carbs. Pair with a protein-rich soup always</li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-3">Best Pre-Workout Nigerian Meals</h2>
              <p className="text-sm mb-3">Eat 1-2 hours before training:</p>
              <ul className="space-y-1 text-sm">
                <li>🍠 Boiled yam + egg sauce (350 cal, balanced macros)</li>
                <li>🫘 Beans + plantain (410 cal, high protein + carbs)</li>
                <li>🌽 Jollof rice + grilled chicken (535 cal, high energy)</li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-3">Best Post-Workout Nigerian Meals</h2>
              <p className="text-sm mb-3">Eat within 45 minutes after training:</p>
              <ul className="space-y-1 text-sm">
                <li>🐟 Pepper soup with fish (180 cal, high protein, anti-inflammatory)</li>
                <li>🍢 Suya + boiled yam (440 cal, protein + carbs for recovery)</li>
                <li>🥚 Moi moi + eggs (316 cal, high protein)</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-gradient-to-r from-mint/15 to-teal/5 p-6 ring-1 ring-mint/30">
            <h3 className="font-black text-white mb-2">Log your Nigerian meals on Vytora</h3>
            <p className="text-sm text-slate-300 mb-4">Track calories, protein, carbs and fat using our Nigerian food database. 30 foods pre-loaded.</p>
            <Link href="/nutrition" className="inline-block rounded-xl bg-gradient-to-r from-mint to-teal px-6 py-3 text-sm font-black text-ink">
              Start logging free →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
