import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NutritionClient from "@/components/NutritionClient";

export const dynamic = "force-dynamic";

export default async function NutritionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <NutritionClient goal={user.fitnessGoal || "general"} />
      </main>
      <Footer />
    </div>
  );
}
