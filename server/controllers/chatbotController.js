const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
// "gemini-flash-latest" tracks Google's current Flash model (2.5 was retired for new users).
const MODEL = process.env.GEMINI_CHAT_MODEL || process.env.GEMINI_MODEL || "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY is required for the chatbot");

const SYSTEM_PROMPT = `You are Hired.ai's friendly assistant. Hired.ai is an AI-powered interview prep platform.
Help with: creating interviews, voice interview mode, DSA practice, feedback/scoring, career and interview tips.
How it works: Sign up → Dashboard → Create Interview → pick role & experience → practice → get AI feedback.
Share STAR method tips for behavioral questions and DSA approach tips. Be friendly and encouraging.
Keep answers concise (a short paragraph or a few bullets).`;

// Build a valid, alternating user/model conversation from untrusted client input
const buildContents = (history, message) => {
  const out = [];
  const push = (role, text) => {
    text = String(text || "").trim().slice(0, 2000);
    if (!text) return;
    if (out.length === 0 && role === "model") return; // must start with user
    const last = out[out.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += "\n" + text; // merge consecutive same-role turns
    } else {
      out.push({ role, parts: [{ text }] });
    }
  };

  for (const m of Array.isArray(history) ? history.slice(-10) : []) {
    const role = m?.role === "model" ? "model" : m?.role === "user" ? "user" : null;
    if (!role) continue;
    const text = Array.isArray(m.parts) ? m.parts.map((p) => p?.text ?? "").join("") : "";
    push(role, text);
  }
  push("user", message);
  return out;
};

export const chatbotReply = async (req, res) => {
  try {
    const { history = [], message } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const resp = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: buildContents(history, message),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096, // generous, because thinking tokens count toward this limit
        },
      }),
    });

    if (!resp.ok) {
      console.error("Gemini chatbot error:", resp.status, await resp.text());
      // Forward 429 so the client can react; hide upstream details otherwise
      const status = resp.status === 429 ? 429 : 502;
      return res.status(status).json({ error: "AI service error" });
    }

    const data = await resp.json();
    const candidate = data?.candidates?.[0];
    const reply = (candidate?.content?.parts || [])
      .filter((p) => p.text && !p.thought)
      .map((p) => p.text)
      .join("")
      .trim();

    if (!reply) {
      console.error("Empty Gemini reply:", candidate?.finishReason, data?.promptFeedback);
      return res.status(502).json({ error: "Empty response from AI" });
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot controller error:", err);
    res.status(500).json({ error: "Chatbot error" });
  }
};