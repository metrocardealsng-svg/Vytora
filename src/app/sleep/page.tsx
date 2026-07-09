import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SleepClient from "@/components/SleepClient";
import PlanGate from "@/components/PlanGate";

export const dynamic = "force-dynamic";

export default async function SleepPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <PlanGate requiredPlan="pro" currentPlan={user.plan} featureName="Sleep Tracker">
          <SleepClient />
        </PlanGate>
      </main>
      <Footer />
    </div>
  );
}
