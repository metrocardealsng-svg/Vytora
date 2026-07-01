import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import { getSessionUserId } from "@/lib/auth";

export const metadata: Metadata = { title: "Log in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSessionUserId()) redirect("/dashboard");
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex flex-1 items-center justify-center px-5 py-16">
        <AuthForm mode="login" />
      </main>
    </div>
  );
}
