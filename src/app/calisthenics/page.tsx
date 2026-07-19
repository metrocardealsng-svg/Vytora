import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Military Calisthenics — Vytora",
  description: "Build serious strength with no equipment. Military calisthenics routines for Nigerians.",
};

export const dynamic = "force-dynamic";

const PROGRAMS = [
  {
    name: "Beginner Bootcamp",
    duration: "4 weeks",
    level: "Beginner",
    emoji: "🎯",
    description: "Start here. Build your foundation with basic push-ups, squats and planks.",
    workouts: [
      { day: "Monday", exercises: ["10 Push-ups x3", "20 Squats x3", "30s Plank x3", "10 Lunges each leg x2"] },
      { day: "Wednesday", exercises: ["15 Push-ups x3", "30 Squats x3", "45s Plank x2", "10 Dips x3"] },
      { day: "Friday", exercises: ["20 Push-ups x3", "40 Squats x3", "1min Plank x2", "10 Burpees x3"] },
    ],
  },
  {
    name: "Army Standard",
    duration: "8 weeks",
    level: "Intermediate",
    emoji: "⚡",
    description: "Train to Nigerian Army standard. 40 push-ups, 50 sit-ups, 2.4km run under 12 mins.",
    workouts: [
      { day: "Monday", exercises: ["30 Push-ups x4", "40 Sit-ups x4", "20 Dips x3", "5km Run"] },
      { day: "Tuesday", exercises: ["20 Pull-ups x3", "30 Squats x4", "20 Burpees x3", "Sprints 10x50m"] },
      { day: "Thursday", exercises: ["40 Push-ups x3", "50 Sit-ups x3", "30 Dips x3", "3km Run"] },
      { day: "Saturday", exercises: ["Max Push-ups in 2 mins", "Max Sit-ups in 2 mins", "5km Run timed"] },
    ],
  },
  {
    name: "Combat Strength",
    duration: "12 weeks",
    level: "Advanced",
    emoji: "💎",
    description: "Elite calisthenics. Muscle-ups, one-arm push-up progressions, handstand holds.",
    workouts: [
      { day: "Monday", exercises: ["10 Muscle-ups x3", "20 One-arm push-up negatives x3", "30s Handstand hold x3", "20 Pull-ups x4"] },
      { day: "Wednesday", exercises: ["10km Run", "100 Push-ups for time", "100 Squats for time", "50 Dips"] },
      { day: "Friday", exercises: ["5 Planche negatives x3", "10 Front lever holds x3", "20 Explosive push-ups x4", "Sprint intervals"] },
    ],
  },
];

const EXERCISES = [
  { name: "Push-up", muscles: "Chest, Triceps, Shoulders", howto: "Hands shoulder-width, body straight. Lower chest to floor, push back up. Keep core tight throughout.", variations: ["Wide grip", "Diamond", "Explosive clap", "Decline", "One-arm negative"] },
  { name: "Pull-up", muscles: "Back, Biceps, Core", howto: "Hang from bar, palms forward. Pull chest to bar, lower slowly. Full range of motion every rep.", variations: ["Chin-up", "Wide grip", "Close grip", "Weighted", "Muscle-up progression"] },
  { name: "Squat", muscles: "Quads, Glutes, Hamstrings", howto: "Feet shoulder-width, toes slightly out. Lower until thighs parallel, keep chest up. Drive through heels.", variations: ["Jump squat", "Pistol squat", "Bulgarian split", "Sumo squat", "Wall sit"] },
  { name: "Burpee", muscles: "Full body, Cardio", howto: "Stand, drop to plank, do a push-up, jump feet to hands, explode up with hands overhead. No rest between reps.", variations: ["Half burpee", "Box jump burpee", "Double push-up burpee", "Tuck jump burpee"] },
  { name: "Dip", muscles: "Chest, Triceps, Shoulders", howto: "Use parallel bars or a sturdy chair. Lower body until upper arms parallel, push back up. Lean forward for chest focus.", variations: ["Bench dip", "Ring dip", "Weighted dip", "Korean dip"] },
  { name: "Plank", muscles: "Core, Shoulders, Glutes", howto: "Forearms on floor, body straight like a board. Hold position. Squeeze abs and glutes. Do not let hips sag.", variations: ["Side plank", "RKC plank", "Plank to push-up", "Weighted plank", "Hollow body hold"] },
];

export default async function CalisthenicsPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10">
          {/* Header */}
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-3.5 py-1.5 text-xs font-semibold text-mint mb-4">
              💪 Military Calisthenics
            </span>
            <h1 className="text-4xl font-black text-white">Build Serious Strength. No Equipment.</h1>
            <p className="mt-3 text-lg text-slate-400 max-w-2xl">
              Military calisthenics training adapted for Nigerian conditions. No gym needed. Just your bodyweight, discipline, and consistency.
            </p>
          </div>

          {/* Programs */}
          <div className="mb-14">
            <h2 className="text-2xl font-black text-white mb-6">Training Programs</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {PROGRAMS.map((prog) => (
                <div key={prog.name} className="glass rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{prog.emoji}</span>
                    <div>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        prog.level === "Beginner" ? "bg-mint/15 text-mint" :
                        prog.level === "Intermediate" ? "bg-yellow-400/15 text-yellow-400" :
                        "bg-red-400/15 text-red-400"
                      }`}>{prog.level}</span>
                    </div>
                  </div>
                  <h3 className="font-black text-white text-lg">{prog.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 mb-3">{prog.duration}</p>
                  <p className="text-sm text-slate-300 leading-relaxed flex-1">{prog.description}</p>
                  <div className="mt-4 space-y-2">
                    {prog.workouts.map((w) => (
                      <div key={w.day} className="rounded-xl bg-white/5 px-3 py-2">
                        <p className="text-xs font-black text-mint mb-1">{w.day}</p>
                        {w.exercises.slice(0, 2).map((e) => (
                          <p key={e} className="text-xs text-slate-400">{e}</p>
                        ))}
                        {w.exercises.length > 2 && <p className="text-xs text-slate-600">+{w.exercises.length - 2} more</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Library */}
          <div className="mb-14">
            <h2 className="text-2xl font-black text-white mb-6">Exercise Library</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {EXERCISES.map((ex) => (
                <div key={ex.name} className="glass rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-black text-white text-lg">{ex.name}</h3>
                    <span className="text-xs text-mint bg-mint/10 px-2 py-1 rounded-lg flex-shrink-0">{ex.muscles}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">{ex.howto}</p>
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1.5">VARIATIONS</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ex.variations.map((v) => (
                        <span key={v} className="text-xs bg-white/5 text-slate-400 px-2 py-1 rounded-lg">{v}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vyto AI CTA */}
          <div className="rounded-3xl bg-gradient-to-r from-mint/15 to-teal/5 p-8 ring-1 ring-mint/30 text-center">
            <h3 className="text-2xl font-black text-white mb-2">Ask Vyto AI for a custom calisthenics plan</h3>
            <p className="text-slate-400 mb-6">Tell Vyto your fitness level, goals, and available time. Get a personalized military calisthenics program instantly.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {user ? (
                <button
                  onClick={() => {
                    const btn = document.querySelector<HTMLButtonElement>('[aria-label="Open Vyto AI"]');
                    btn?.click();
                  }}
                  className="rounded-xl bg-gradient-to-r from-mint to-teal px-6 py-3 text-sm font-black text-ink"
                >
                  Ask Vyto AI now
                </button>
              ) : (
                <Link href="/signup" className="rounded-xl bg-gradient-to-r from-mint to-teal px-6 py-3 text-sm font-black text-ink">
                  Sign up to ask Vyto
                </Link>
              )}
              <Link href="/tracker" className="rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white hover:bg-white/5">
                Track your workout
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
