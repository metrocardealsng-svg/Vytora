import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TribeClient from "@/components/TribeClient";

export const dynamic = "force-dynamic";

export default async function TribePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-white">Tribe</h1>
            <p className="mt-1 text-slate-400">
              Share your journey. Connect with movers.
            </p>
          </div>

          <TribeClient
            userId={user.id}
            username={user.name || user.email.split("@")[0]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
