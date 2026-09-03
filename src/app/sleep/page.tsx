import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SleepClient from "@/components/SleepClient";

export const dynamic = "force-dynamic";

export default async function SleepPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <SleepClient />
      </main>
      <Footer />
    </div>
  );
}
