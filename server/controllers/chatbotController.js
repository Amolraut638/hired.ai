import { generate } from "../services/geminiClient.js";

// Chat can use its own model if you set GEMINI_CHAT_MODEL; otherwise it shares GEMINI_MODEL.
const CHAT_MODEL = process.env.GEMINI_CHAT_MODEL || undefined;

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

  // Fewer history turns = fewer input tokens = faster replies
  for (const m of Array.isArray(history) ? history.slice(-6) : []) {
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

    const { text, finishReason, blockReason } = await generate({
      model: CHAT_MODEL,
      system: SYSTEM_PROMPT,
      contents: buildContents(history, message),
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    });

    if (!text) {
      console.error("Empty Gemini reply:", finishReason, blockReason);
      return res.status(502).json({ error: "Empty response from AI" });
    }

    res.json({ reply: text });
  } catch (err) {
    console.error("Chatbot error:", err.message);
    // Forward 429 so the client can react; hide upstream details otherwise
    const status = err.status === 429 ? 429 : err.status ? 502 : 500;
    res.status(status).json({ error: "AI service error" });
  }
};