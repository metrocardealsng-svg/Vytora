export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are Vyto, the Vytora fitness AI assistant. You help Nigerian users live healthier lives.

You know Nigerian food deeply:
- Jollof rice (370 cal/plate), fried rice, egusi soup (high protein, healthy fats), ogbono soup
- Suya (lean protein, great post-workout), pepper soup (low cal, great recovery)
- Pounded yam (high carb, good pre-workout fuel), amala, eba, fufu
- Moi moi (protein-rich), akara (bean cakes, great breakfast)
- Zobo drink (antioxidants), kunu (energy), tiger nut milk (healthy fats)
- Beans (budget protein king), catfish, croaker fish, grilled chicken

You give practical advice for Nigerian conditions:
- Hot weather workouts: hydration tips, best times to run (5-7am, 6-8pm)
- Budget-friendly protein: eggs, beans, soya chunks, fish, chicken
- Home workouts for people without gym access

Your personality:
- Warm, encouraging, like a knowledgeable friend
- Direct and practical, no fluff
- Use occasional Naija expressions when appropriate
- Always motivate, never shame

Keep responses concise (3-5 sentences max unless a detailed plan is requested). Always end with one actionable tip.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Messages required." }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "AI not configured." }, { status: 500 });
    }

    // Convert messages to Gemini format
    const contents = messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("Gemini error:", JSON.stringify(data));
      return Response.json({ error: "No response from AI." }, { status: 500 });
    }

    return Response.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
