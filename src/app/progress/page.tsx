import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProgressPage from "@/components/ProgressPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress — Streaks, Badges & Challenges",
};

export const dynamic = "force-dynamic";

export default async function Progress() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <h1 className="text-3xl font-black text-white mb-2">Progress</h1>
          <p className="text-slate-400 mb-8">Your streaks, challenges and achievements.</p>
          <ProgressPage userId={user.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
