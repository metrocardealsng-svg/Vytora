import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveTracker from "@/components/LiveTracker";
import { getSessionUserId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Live Step & GPS Tracker",
  description:
    "Track your walk, run, or hike live with GPS. See your distance, steps, pace, and calories in real time with Vytora.",
};

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  const userId = await getSessionUserId();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <div className="mx-auto max-w-2xl px-5 py-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Live <span className="text-gradient">Activity Tracker</span>
            </h1>
            <p className="mt-3 text-slate-400">
              Vytora uses your device GPS to know exactly where you&apos;re walking
              and how many miles you cover — in real time.
            </p>
          </div>
          <LiveTracker authed={Boolean(userId)} />
          {!userId && (
            <p className="mt-6 text-center text-sm text-slate-500">
              You can track without an account, but{" "}
              <a href="/signup" className="font-semibold text-mint hover:underline">
                sign up free
              </a>{" "}
              to save activities and see your progress.
            </p>
          )}
          <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-slate-400 sm:grid-cols-3">
            <Tip title="Best accuracy" body="Keep your phone unlocked with location set to High Accuracy." />
            <Tip title="Real distance" body="We filter GPS noise so your mileage is accurate, not inflated." />
            <Tip title="Privacy first" body="Your route is only saved when you choose to finish an activity." />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Tip({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-slate-400">{body}</p>
    </div>
  );
}
