const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const SYSTEM_PROMPT = `You are Hired.ai's friendly assistant. Hired.ai is an AI-powered interview prep platform.
Help users with: creating interviews, voice interview mode, DSA practice, feedback/scoring, and interview tips.
How it works: Sign up → Dashboard → Create Interview → pick role & experience → practice → get AI feedback.
Share STAR method tips for behavioral questions, DSA approach tips, and encourage users.
Keep answers to 2-4 sentences. Be friendly and encouraging.`;

export const chatbotReply = async (req, res) => {
  try {
    const { history = [], message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build conversation contents from history + new message
    const contents = [
      ...history.map((m) => ({
        role: m.role, // "user" or "model"
        parts: m.parts,
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!resp.ok) {
      const err = await resp.text();
      console.error("Gemini chatbot error:", err);
      return res.status(500).json({ error: "Gemini API error", detail: err });
    }

    const data = await resp.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot controller error:", err);
    res.status(500).json({ error: "Chatbot error", detail: err.message });
  }
};