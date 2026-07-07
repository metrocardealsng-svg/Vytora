import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TipsPage from "@/components/TipsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Tips — Naija Fitness Secrets",
  description: "Workout tips, African food secrets, HIIT guides and carb cycling advice built for Nigerians.",
};

export default function Tips() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <TipsPage />
      </main>
      <Footer />
    </div>
  );
}
