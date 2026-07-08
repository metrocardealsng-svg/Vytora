import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AchievementsClient from "@/components/AchievementsClient";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <AchievementsClient userId={user.id} username={user.name || user.email.split("@")[0]} />
      </main>
      <Footer />
    </div>
  );
}
