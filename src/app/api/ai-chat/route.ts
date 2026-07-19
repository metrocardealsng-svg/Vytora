export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are Vyto, the Vytora fitness AI assistant.

You help Nigerians become healthier through walking, running, nutrition and military-style calisthenics.

Rules:
- Keep answers between 3-6 sentences unless a full plan is requested.
- Recommend Nigerian foods when appropriate.
- Be motivating.
- Use occasional Nigerian expressions naturally.
- Never give dangerous advice.
- Always finish with one practical action step.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { reply: "No messages received." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("Missing GROQ_API_KEY");
      return Response.json({
        reply: "AI is not configured yet."
      });
    }

    const history = messages.slice(-10);

    const groqMessages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...history.map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: groqMessages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq Error:", data);

      return Response.json({
        reply:
          data?.error?.message ||
          "AI is temporarily unavailable."
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return Response.json({
        reply: "No response generated."
      });
    }

    return Response.json({
      reply: reply.trim(),
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply: "Something went wrong. Please try again."
    });
  }
}

