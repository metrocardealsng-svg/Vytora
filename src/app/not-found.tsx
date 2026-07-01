import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex flex-1 flex-col items-center justify-center px-5 py-24 text-center">
        <div className="text-7xl font-black text-gradient">404</div>
        <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
        <p className="mt-2 text-slate-400">This route drifted off the map.</p>
        <Link
          href="/"
          className="btn-glow mt-8 rounded-xl bg-gradient-to-r from-mint to-teal px-7 py-3.5 font-black text-ink"
        >
          Back home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
