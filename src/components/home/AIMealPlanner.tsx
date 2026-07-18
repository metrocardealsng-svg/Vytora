import SectionTitle from "../ui/SectionTitle";
import FeatureCard from "../ui/FeatureCard";

export default function AIMealPlanner(){

return(

<section className="py-24">

<div className="mx-auto max-w-7xl px-5">

<SectionTitle

title="AI Meal Planner"

subtitle="Built for Nigerians. Finally."

/>

<div className="grid lg:grid-cols-2 gap-16 items-center">

<div>

<div className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0d131d] to-[#06080c] p-8">

<div className="space-y-5">

<div className="flex justify-between">

<span className="text-slate-400">

Today's Goal

</span>

<span className="text-mint font-bold">

1800 kcal

</span>

</div>

<div className="h-3 bg-white/10 rounded-full">

<div className="h-full w-3/4 rounded-full bg-gradient-to-r from-mint to-teal"/>

</div>

<div className="space-y-4 mt-8">

<div className="rounded-2xl bg-white/5 p-4">

🍛 Breakfast

<p className="text-slate-400 mt-1">

Moi Moi + Pap

</p>

</div>

<div className="rounded-2xl bg-white/5 p-4">

🍗 Lunch

<p className="text-slate-400 mt-1">

Jollof Rice + Chicken

</p>

</div>

<div className="rounded-2xl bg-white/5 p-4">

🥗 Dinner

<p className="text-slate-400 mt-1">

Grilled Fish + Plantain

</p>

</div>

</div>

</div>

</div>

</div>

<div className="grid gap-5">

<FeatureCard

icon="🤖"

title="AI Nutrition Coach"

body="Personalized Nigerian meal recommendations based on your activity."

/>

<FeatureCard

icon="🍲"

title="500+ Nigerian Foods"

body="Calories for Eba, Pounded Yam, Suya, Jollof Rice, Akara and more."

/>

<FeatureCard

icon="⚡"

title="Weight Goals"

body="Lose fat, gain muscle or maintain weight automatically."

/>

<FeatureCard

icon="🛒"

title="Shopping Lists"

body="AI generates your weekly grocery list."

/>

</div>

</div>

</div>

</section>

)

}
