import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_EMAIL = "metrocardealsng@gmail.com";

export async function POST(req: Request) {
  const admin = await getCurrentUser();
  if (!admin || admin.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, plan } = await req.json();

  if (!userId || !["free", "pro", "elite"].includes(plan)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await db.update(users).set({ plan }).where(eq(users.id, userId));

  return NextResponse.json({ success: true });
}
