import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return Response.json({ error: "Token and password required." }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.resetToken, token)).limit(1);

    if (!user || !user.resetTokenExpires) {
      return Response.json({ error: "Invalid or expired reset link." }, { status: 400 });
    }

    if (new Date() > new Date(user.resetTokenExpires)) {
      return Response.json({ error: "Reset link has expired. Request a new one." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await db.update(users)
      .set({ passwordHash, resetToken: null, resetTokenExpires: null })
      .where(eq(users.id, user.id));

    return Response.json({ success: true });
  } catch (err) {
    console.error("reset-password error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
