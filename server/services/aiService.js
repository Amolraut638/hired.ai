/* =====================================
   Gemini-only AI Service (Realtime)
===================================== */

const GEMINI_KEY =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!GEMINI_KEY) {
  throw new Error("GEMINI_API_KEY is required for AI interview generation");
}

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`;

/* =====================================
   Helper: extract JSON safely
===================================== */

const extractJsonArray = (text) => {
  try {
    // ✅ Strip markdown code blocks if present
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    for (const key in parsed) {
      if (Array.isArray(parsed[key])) return parsed[key];
    }
    if (typeof parsed === "object" && parsed !== null) return [parsed];
    return null;
  } catch {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        // fall through
      }
    }
    const objStart = text.indexOf("{");
    const objEnd = text.lastIndexOf("}");
    if (objStart !== -1 && objEnd !== -1 && objEnd > objStart) {
      try {
        const obj = JSON.parse(text.slice(objStart, objEnd + 1));
        return [obj];
      } catch {
        // fall through
      }
    }
    return null;
  }
};

/* =====================================
   Generate Questions (Realtime AI)
===================================== */

export const generateQuestions = async ({
  position,
  difficulty,
  count,
  jobDescription = "",
  duration = "",
}) => {
  if (!position || !difficulty || !count) {
    throw new Error("position, difficulty and count are required");
  }

  const prompt = `
You are a technical interviewer.

Generate ${count} ${difficulty}-level single line interview questions for the role of "${position}".

Context:
- Job description: ${jobDescription || "Not provided"}
- Expected answer duration per question: ${duration || "Not specified"}

Rules:
- Questions must match the role and difficulty
- Mix conceptual, practical, and scenario-based questions
- Avoid generic or repeated questions
- Return ONLY a JSON array. DO NOT include any markdown formatting or backticks.
- Format:
[
  {
    "question": "string"
  }
]
`;

  const resp = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4000, // ✅ increased from 1000
        // ✅ removed response_mime_type
      },
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini generateQuestions failed: ${err}`);
  }

  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  console.log("Gemini questions raw:", text.substring(0, 300)); // ✅ debug log

  const parsed = extractJsonArray(text);
  if (!parsed) {
    console.error("Gemini raw response:", text);
    throw new Error("Gemini returned invalid question format");
  }

  return {
    usedAI: true,
    questions: parsed.map((q) => q.question),
  };
};

/* =====================================
   Evaluate Answers (Realtime AI)
===================================== */

export const evaluateAnswers = async ({ questions }) => {
  if (!questions || !questions.length) {
    throw new Error("Questions with answers are required for evaluation");
  }

  let prompt = `
You are a senior technical interviewer.

Evaluate the candidate answers below.

Rules:
- Score each answer from 0 to 10
- Give 1–2 lines of constructive feedback
- Provide a short model/suggested answer
- Return a JSON array of objects.
- Each object must match this schema:
  {
    "question": "The exact question text provided",
    "score": number (0-10),
    "feedback": "1-2 lines of constructive feedback",
    "suggestedAnswer": "A concise model answer"
  }
- DO NOT include any markdown code blocks, backticks, or "json" labels. Just the raw JSON array.
`;

  questions.forEach((q, i) => {
    prompt += `

Question ${i + 1}: ${q.questionText}
Answer: ${q.userAnswer || ""}
`;
  });

  const resp = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8000, // ✅ increased for larger evaluations
        // ✅ removed response_mime_type
      },
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Gemini evaluateAnswers failed: ${err}`);
  }

  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  console.log("Gemini eval raw:", text.substring(0, 300)); // ✅ debug log

  const parsed = extractJsonArray(text);
  if (!parsed) {
    console.error("Gemini raw response:", text);
    throw new Error("Gemini returned invalid evaluation format");
  }

  return parsed;
};

export default { generateQuestions, evaluateAnswers };