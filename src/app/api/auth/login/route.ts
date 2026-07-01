import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ error: "Email and password are required." }, { status: 400 });
    }
    const normalized = String(email).trim().toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
    if (!user) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const ok = await verifyPassword(String(password), user.passwordHash);
    if (!ok) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }
    await setSessionCookie(user.id);
    return Response.json({ user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
