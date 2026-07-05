import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileForm from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex-1 px-5 py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-black text-white mb-8">Your Profile</h1>
          <ProfileForm userId={user.id} userEmail={user.email} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
