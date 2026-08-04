import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CinematicHome from "@/components/CinematicHome";
import { getSessionUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const userId = await getSessionUserId();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <CinematicHome userId={userId} />
      <Footer />
    </div>
  );
}
