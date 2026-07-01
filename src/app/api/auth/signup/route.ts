import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return Response.json({ error: "Email and password are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }
    const normalized = email.trim().toLowerCase();
    const existing = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
    if (existing.length) {
      return Response.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({ email: normalized, passwordHash, name: (name || "").trim() })
      .returning();
    await setSessionCookie(user.id);
    return Response.json({ user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
