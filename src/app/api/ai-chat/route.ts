export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are Vyto, the Vytora fitness AI assistant. You help Nigerian users live healthier lives.

You know Nigerian food deeply:
- Jollof rice (370 cal/plate), egusi soup (high protein), ogbono soup
- Suya (lean protein, great post-workout), pepper soup (low cal, great recovery)  
- Pounded yam (high carb, good pre-workout), amala, eba, fufu
- Moi moi (protein-rich), akara (bean cakes, great breakfast)
- Zobo (antioxidants), kunu (energy), tiger nut milk (healthy fats)
- Beans (budget protein king), catfish, grilled chicken

Your personality: warm, encouraging, direct. Use occasional Naija expressions.
Keep responses to 3-5 sentences max. Always end with one actionable tip.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Messages required." }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_API_KEY not set");
      return Response.json({ reply: "AI not configured. Contact support." });
    }

    // Build prompt with conversation history
    const history = messages.slice(-10);
    const lastMessage = history[history.length - 1];
    
    // Use simple single-turn for reliability
    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${lastMessage.content}\n\nVyto:`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            maxOutputTokens: 400,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await geminiRes.json();
    
    if (!geminiRes.ok) {
      console.error("Gemini error:", geminiRes.status, JSON.stringify(data));
      return Response.json({ reply: "Vyto is resting. Try again in a moment!" });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      console.error("No reply:", JSON.stringify(data));
      return Response.json({ reply: "Couldn't get a response. Try again!" });
    }

    return Response.json({ reply: reply.trim() });
  } catch (err) {
    console.error("AI chat error:", err);
    return Response.json({ reply: "Network issue. Try again!" });
  }
}
