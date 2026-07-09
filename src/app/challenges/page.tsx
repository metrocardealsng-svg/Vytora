import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChallengesClient from "@/components/ChallengesClient";
import PlanGate from "@/components/PlanGate";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <PlanGate requiredPlan="pro" currentPlan={user.plan} featureName="Challenges & Badges">
          <ChallengesClient userName={user.name || user.email.split("@")[0]} />
        </PlanGate>
      </main>
      <Footer />
    </div>
  );
}
