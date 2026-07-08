import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export const dynamic = "force-dynamic";

// Call this from a cron job every Sunday or manually
export async function POST(req: Request) {
  // Simple security check
  const { secret } = await req.json();
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: users } = await supabase
    .from("users")
    .select("id, email, name, current_streak, total_steps, total_activities, plan");

  if (!users) return Response.json({ sent: 0 });

  let sent = 0;
  for (const user of users) {
    const displayName = user.name || user.email.split("@")[0];
    const steps = (user.total_steps || 0).toLocaleString();
    const streak = user.current_streak || 0;
    const activities = user.total_activities || 0;

    const streakMsg = streak === 0
      ? "Start a new streak this week!"
      : streak < 7
      ? `You're on a ${streak}-day streak. Keep it up!`
      : `${streak}-day streak. You're on fire!`;

    try {
      await resend.emails.send({
        from: "Vyto from Vytora <onboarding@resend.dev>",
        to: user.email,
        subject: `Your Vytora Weekly Report 📊`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#06080c;padding:32px 24px;border-radius:16px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="color:#34e0a1;font-size:28px;margin:0;">Vytora</h1>
              <p style="color:#94a3b8;margin:4px 0 0;">Weekly Health Report</p>
            </div>
            
            <p style="color:#e2e8f0;font-size:16px;">Hey ${displayName}!</p>
            <p style="color:#94a3b8;font-size:14px;">Here's how you moved this week:</p>
            
            <div style="display:grid;gap:12px;margin:20px 0;">
              <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;text-align:center;">
                <p style="color:#34e0a1;font-size:28px;font-weight:900;margin:0;">${steps}</p>
                <p style="color:#64748b;font-size:12px;margin:4px 0 0;">Total Steps</p>
              </div>
              <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;text-align:center;">
                <p style="color:#f97316;font-size:28px;font-weight:900;margin:0;">${streak} 🔥</p>
                <p style="color:#64748b;font-size:12px;margin:4px 0 0;">Day Streak</p>
              </div>
              <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:16px;text-align:center;">
                <p style="color:#a78bfa;font-size:28px;font-weight:900;margin:0;">${activities}</p>
                <p style="color:#64748b;font-size:12px;margin:4px 0 0;">Total Activities</p>
              </div>
            </div>
            
            <p style="color:#34e0a1;font-size:14px;font-weight:700;text-align:center;">${streakMsg}</p>
            
            <div style="text-align:center;margin-top:24px;">
              <a href="https://vytora.fit/tracker" 
                 style="background:linear-gradient(135deg,#34e0a1,#0ea5e9);color:#06080c;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:900;font-size:15px;display:inline-block;">
                Track Today's Activity
              </a>
            </div>
            
            <p style="color:#334155;font-size:11px;text-align:center;margin-top:32px;">
              This app is owned by MetroCarDeals Ltd. • <a href="https://vytora.fit" style="color:#475569;">vytora.fit</a>
            </p>
          </div>
        `,
      });
      sent++;
    } catch (e) {
      console.error(`Failed to send to ${user.email}:`, e);
    }
  }

  return Response.json({ sent });
}
