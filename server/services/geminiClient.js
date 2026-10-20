/* =====================================
   Shared Gemini client (used by aiService + chatbotController)
===================================== */

const KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!KEY) throw new Error("GEMINI_API_KEY is required");

// "gemini-flash-latest" always tracks Google's current Flash model.
export const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Newer models "think" before answering, which adds seconds to every call.
// We ask for the least thinking possible. Newer models use thinkingLevel, 2.5 models use
// thinkingBudget, and the two can't be mixed. So we try each style in turn and remember
// the first one the model accepts. Set GEMINI_THINKING_LEVEL=low|medium|high for more
// reasoning, or "off" to send no thinking settings at all.
const LEVEL = process.env.GEMINI_THINKING_LEVEL || "minimal";
const MODES = LEVEL === "off" ? ["none"] : ["level", "budget", "none"];
let modeIndex = 0; // remembered across calls

const thinkingFor = (mode) =>
  mode === "level"
    ? { thinkingConfig: { thinkingLevel: LEVEL } }
    : mode === "budget"
    ? { thinkingConfig: { thinkingBudget: 0 } }
    : {};

/**
 * @returns {{ text: string, finishReason?: string, blockReason?: string }}
 * Throws an Error with .status set when Gemini returns an HTTP error.
 */
export async function generate({ model = DEFAULT_MODEL, system, contents, generationConfig }) {
  for (let i = modeIndex; i < MODES.length; i++) {
    const resp = await fetch(`${BASE}/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        ...(system ? { system_instruction: { parts: [{ text: system }] } } : {}),
        contents,
        generationConfig: { ...generationConfig, ...thinkingFor(MODES[i]) },
      }),
    });

    if (resp.ok) {
      modeIndex = i; // remember what works so later calls don't retry
      const data = await resp.json();
      const candidate = data?.candidates?.[0];
      const text = (candidate?.content?.parts || [])
        .filter((p) => p.text && !p.thought)
        .map((p) => p.text)
        .join("")
        .trim();
      return {
        text,
        finishReason: candidate?.finishReason,
        blockReason: data?.promptFeedback?.blockReason,
      };
    }

    const body = await resp.text();
    // Model rejected the thinking setting: try the next style
    if (resp.status === 400 && /think/i.test(body) && i < MODES.length - 1) continue;

    const err = new Error(`Gemini request failed (${resp.status}): ${body.slice(0, 300)}`);
    err.status = resp.status;
    throw err;
  }
}