import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="aurora flex flex-1 items-center justify-center px-5 py-16">
        <ResetPasswordForm />
      </main>
    </div>
  );
}
