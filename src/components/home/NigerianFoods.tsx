"use client";

import { useState } from "react";
import { foods } from "@/data/foods";
import SectionTitle from "../ui/SectionTitle";

export default function NigerianFoods() {
  const [search, setSearch] = useState("");

  const filtered = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-5">

        <SectionTitle
          title="Nigerian Food Calories"
          subtitle="Search calories, protein and nutrition for your favourite Nigerian meals."
        />

        <div className="mx-auto mb-10 max-w-xl">

          <input
            type="text"
            placeholder="Search Jollof Rice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none focus:border-mint"
          />

        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {filtered.map((food) => (

            <div
              key={food.name}
              className="glass rounded-3xl p-6 transition hover:-translate-y-2"
            >

              <div className="text-5xl">

                {food.emoji}

              </div>

              <h3 className="mt-5 text-2xl font-black text-white">

                {food.name}

              </h3>

              <div className="mt-6 space-y-3">

                <div className="flex justify-between">

                  <span className="text-slate-400">

                    Calories

                  </span>

                  <span className="font-bold text-mint">

                    {food.calories}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-400">

                    Protein

                  </span>

                  <span className="font-bold text-white">

                    {food.protein}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-400">

                    Carbs

                  </span>

                  <span className="font-bold text-white">

                    {food.carbs}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-400">

                    Fat

                  </span>

                  <span className="font-bold text-white">

                    {food.fat}

                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
