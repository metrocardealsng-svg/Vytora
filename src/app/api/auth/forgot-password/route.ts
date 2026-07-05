import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return Response.json({ error: "Email required." }, { status: 400 });

    const normalized = String(email).trim().toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.email, normalized)).limit(1);

    // Always return success to avoid email enumeration
    if (!user) return Response.json({ success: true });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.update(users)
      .set({ resetToken: token, resetTokenExpires: expires })
      .where(eq(users.id, user.id));

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://vytora.vercel.app"}/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Vytora <onboarding@resend.dev>",
      to: normalized,
      subject: "Reset your Vytora password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #0ff; margin-bottom: 8px;">Reset your password</h2>
          <p style="color: #94a3b8; margin-bottom: 24px;">
            Someone requested a password reset for your Vytora account. 
            If that was you, click the button below. The link expires in 1 hour.
          </p>
          <a href="${resetUrl}" 
             style="display: inline-block; background: #00e5be; color: #0a0f1a; 
                    padding: 14px 28px; border-radius: 12px; font-weight: 900; 
                    text-decoration: none; font-size: 16px;">
            Reset password
          </a>
          <p style="color: #64748b; margin-top: 24px; font-size: 13px;">
            If you did not request this, ignore this email. Your password will not change.
          </p>
          <p style="color: #334155; margin-top: 32px; font-size: 11px;">
            This app is owned by MetroCarDeals Ltd.
          </p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("forgot-password error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
