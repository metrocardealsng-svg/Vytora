import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import AdminTable from "@/components/AdminTable";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "metrocardealsng@gmail.com";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.email !== ADMIN_EMAIL) redirect("/dashboard");

  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      plan: users.plan,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 aurora px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white">Admin Panel</h1>
            <p className="mt-1 text-slate-400">
              {allUsers.length} users total. Tap a plan button to upgrade instantly.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            {(["free", "pro", "elite"] as const).map((p) => {
              const count = allUsers.filter((u) => u.plan === p).length;
              return (
                <div key={p} className="glass rounded-2xl p-5 text-center">
                  <p className="text-2xl font-black text-white">{count}</p>
                  <p className="text-sm capitalize text-slate-400">{p}</p>
                </div>
              );
            })}
          </div>

          <AdminTable users={allUsers} />
        </div>
      </main>
    </div>
  );
}
