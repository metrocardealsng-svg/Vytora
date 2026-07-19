"use client";

import { useState } from "react";

export default function GoalCreator() {
  const [steps, setSteps] = useState(10000);
  const [distance, setDistance] = useState(5);
  const [calories, setCalories] = useState(500);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

      <h2 className="text-2xl font-bold text-white">
        My Daily Goals
      </h2>

      <p className="mt-2 text-slate-400">
        Set your own targets.
      </p>

      <div className="mt-8 space-y-6">

        <div>
          <label className="text-white font-medium">
            Daily Steps
          </label>

          <input
            type="range"
            min={1000}
            max={50000}
            step={500}
            value={steps}
            onChange={(e)=>setSteps(Number(e.target.value))}
            className="w-full mt-2"
          />

          <p className="text-mint mt-2 font-bold">
            {steps.toLocaleString()} Steps
          </p>
        </div>

        <div>
          <label className="text-white font-medium">
            Distance Goal
          </label>

          <input
            type="range"
            min={1}
            max={50}
            value={distance}
            onChange={(e)=>setDistance(Number(e.target.value))}
            className="w-full mt-2"
          />

          <p className="text-mint mt-2 font-bold">
            {distance} km
          </p>
        </div>

        <div>
          <label className="text-white font-medium">
            Calories
          </label>

          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={calories}
            onChange={(e)=>setCalories(Number(e.target.value))}
            className="w-full mt-2"
          />

          <p className="text-mint mt-2 font-bold">
            {calories} kcal
          </p>
        </div>

        <button
          className="mt-6 w-full rounded-xl bg-mint py-4 font-bold text-black transition hover:scale-105"
        >
          Save Goals
        </button>

      </div>

    </div>
  );
}
