// Diagnostic endpoint. Disabled unless DEBUG_SECRET is set, and it never returns the API key.
const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;
const BASE = "https://generativelanguage.googleapis.com/v1beta";

export const geminiTest = async (req, res) => {
  try {
    const secret = process.env.DEBUG_SECRET;
    if (!secret) return res.status(404).json({ message: "Not found" });
    if (req.query.secret !== secret) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    if (!GEMINI_KEY) {
      return res.status(400).json({ success: false, message: "GEMINI_API_KEY not set" });
    }

    const headers = { "Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY };
    const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

    let availableModels = "list failed";
    try {
      const r = await fetch(`${BASE}/models`, { headers });
      const j = await r.json();
      availableModels = (j.models || [])
        .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
        .map((m) => m.name);
    } catch {
      /* ignore */
    }

    let attempt;
    try {
      const r = await fetch(`${BASE}/models/${model}:generateContent`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say OK" }] }],
          generationConfig: { maxOutputTokens: 50 },
        }),
      });
      attempt = { model, status: r.status, ok: r.ok, body: (await r.text()).slice(0, 1000) };
    } catch (err) {
      attempt = { model, ok: false, error: err.message };
    }

    return res.json({ success: true, availableModels, attempt });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default { geminiTest };