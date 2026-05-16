import fetch from 'node-fetch';

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || null;

export const geminiTest = async (req, res) => {
  try {
    const secret = req.query.secret;
    if (process.env.DEBUG_SECRET && process.env.DEBUG_SECRET !== secret) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    if (!GEMINI_KEY) return res.status(400).json({ success: false, message: 'GEMINI_API_KEY not set' });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`;
    const prompt = 'Generate 1 short interview question for "debug test"';

    const listModelsUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_KEY}`;
    let availableModels = 'Check failed';
    try {
        const lresp = await fetch(listModelsUrl);
        availableModels = await lresp.json();
    } catch(e) {}

    const attempts = [];
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 200 }
        }),
      });

      const text = await resp.text();
      attempts.push({ url, status: resp.status, ok: resp.ok, body: text.slice(0, 5000) });
    } catch (err) {
      attempts.push({ url, status: 'error', ok: false, error: err.message || String(err) });
    }

    return res.json({ success: true, availableModels, attempts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default { geminiTest };
