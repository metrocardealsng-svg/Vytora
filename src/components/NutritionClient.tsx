import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NutritionClient from "@/components/NutritionClient";
import PlanGate from "@/components/PlanGate";

export const dynamic = "force-dynamic";

export default async function NutritionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <PlanGate requiredPlan="pro" currentPlan={user.plan} featureName="Nutrition & Meal Plans">
          <NutritionClient goal={user.fitnessGoal || "general"} />
        </PlanGate>
      </main>
      <Footer />
    </div>
  );
}
