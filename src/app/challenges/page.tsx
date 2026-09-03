import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChallengesClient from "@/components/ChallengesClient";

export const dynamic = "force-dynamic";

export default async function ChallengesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <ChallengesClient userName={user.name || user.email.split("@")[0]} />
      </main>
      <Footer />
    </div>
  );
}
