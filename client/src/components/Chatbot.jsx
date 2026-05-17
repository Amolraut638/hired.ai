import { useState, useRef, useEffect } from "react";
import { chatbotAPI } from "../services/api";

// ─── Quick reply suggestions ────────────────────────────────────────────────
const SUGGESTIONS = [
  "Create a React roadmap for me",
  "How do I crack frontend interviews?",
  "Mock HR interview me",
  "Teach me DSA from scratch",
];

// ─── MASTER SYSTEM PROMPT ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are Hired.ai Assistant, an intelligent AI mentor and interview coach.

You help users with:
- Career guidance
- Resume improvement
- Interview preparation
- Technical interview preparation
- HR interview preparation
- DSA and coding guidance
- Study roadmaps
- Communication skills
- Productivity and motivation
- Software engineering guidance
- Platform-related support for Hired.ai

Behavior Rules:
- Be friendly, conversational, and supportive.
- Answer like an experienced mentor.
- Give practical and actionable advice.
- Use bullet points where useful.
- Keep explanations easy to understand.
- Use examples whenever helpful.
- Encourage users positively.
- Never say you only answer platform questions.
- If the question is career or study related, help fully.
- If the question is platform related, explain clearly.
- Keep responses modern and engaging.

Communication Style:
- Natural like ChatGPT
- Not robotic
- Professional but friendly
- Concise but informative
`;

// ─── SIMPLE USER PROFILE CONTEXT ────────────────────────────────────────────
const USER_PROFILE = `
User Profile:
- Likely a student or fresher
- Interested in software engineering
- Wants interview preparation and career guidance
`;

// ─── DYNAMIC CONTEXT ENGINE ────────────────────────────────────────────────
function getDynamicContext(message) {
  const msg = message.toLowerCase();

  // Resume
  if (
    msg.includes("resume") ||
    msg.includes("cv")
  ) {
    return `
The user needs resume guidance.

Focus on:
- ATS optimization
- Resume structure
- Project quality
- Skills improvement
- Fresher resume guidance
`;
  }

  // Frontend
  if (
    msg.includes("frontend") ||
    msg.includes("react") ||
    msg.includes("javascript") ||
    msg.includes("html") ||
    msg.includes("css")
  ) {
    return `
The user is learning frontend development.

Focus on:
- React
- JavaScript
- Frontend roadmap
- Best practices
- Interview preparation
- Project building
`;
  }

  // Backend
  if (
    msg.includes("backend") ||
    msg.includes("node") ||
    msg.includes("express") ||
    msg.includes("mongodb")
  ) {
    return `
The user is learning backend development.

Focus on:
- Backend architecture
- APIs
- Databases
- Node.js best practices
- Scalability
`;
  }

  // DSA
  if (
    msg.includes("dsa") ||
    msg.includes("leetcode") ||
    msg.includes("problem solving")
  ) {
    return `
The user needs DSA guidance.

Focus on:
- Beginner-friendly explanations
- Interview-focused DSA
- Problem-solving strategies
- Learning roadmap
`;
  }

  // Interview
  if (
    msg.includes("interview") ||
    msg.includes("hr") ||
    msg.includes("mock")
  ) {
    return `
The user is preparing for interviews.

Act like a professional interview coach.

Focus on:
- Confidence building
- HR questions
- Technical preparation
- STAR method
- Communication improvement
`;
  }

  // Study / roadmap
  if (
    msg.includes("roadmap") ||
    msg.includes("study") ||
    msg.includes("learn")
  ) {
    return `
The user wants a learning roadmap.

Provide:
- Step-by-step roadmap
- Beginner to advanced guidance
- Practical learning sequence
`;
  }

  // Platform-related
  if (
    msg.includes("hired.ai") ||
    msg.includes("voice interview") ||
    msg.includes("score") ||
    msg.includes("platform")
  ) {
    return `
The user is asking about Hired.ai platform features.

Explain clearly and professionally.
`;
  }

  // Default
  return `
General mentoring mode.

Help the user professionally and conversationally.
`;
}

// ─── FORMAT HISTORY FOR GEMINI ─────────────────────────────────────────────
function buildConversation(history, userMessage) {
  const dynamicContext = getDynamicContext(userMessage);

  // Send only recent messages for better performance
  const recentHistory = history.slice(-8);

  return [
    {
      role: "user",
      parts: [
        {
          text: `
${SYSTEM_PROMPT}

${USER_PROFILE}

${dynamicContext}
`,
        },
      ],
    },

    ...recentHistory.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),

    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];
}

// ─── Gemini API call ────────────────────────────────────────────────────────
async function askGemini(history, userMessage) {
  const dynamicContext = getDynamicContext(userMessage);

  const recentHistory = [
    ...history.slice(-12),
  ];

  const enhancedHistory = [
    {
      role: "assistant",
      content: `
${SYSTEM_PROMPT}

${USER_PROFILE}

${dynamicContext}
      `,
    },

    ...recentHistory,
  ];

  const data = await chatbotAPI.sendMessage(
    enhancedHistory.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    userMessage
  );

  return data.reply;
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! 👋 I'm your Hired.ai assistant. Ask me anything about interviews, career guidance, coding, studies, or the platform!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setHasUnread(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // ─── SEND MESSAGE ────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const msg = text || input.trim();

    if (!msg || loading) return;

    setInput("");
    setShowSuggestions(false);

    const newMessages = [
      ...messages,
      {
        role: "user",
        content: msg,
      },
    ];

    setMessages(newMessages);
    setLoading(true);

    try {
      const reply = await askGemini(
        newMessages.slice(0, -1),
        msg
      );

      // ─────────────────────────────────────────
      // EMPTY / BAD AI RESPONSE
      // ─────────────────────────────────────────
      if (
        !reply ||
        typeof reply !== "string" ||
        reply.trim().length < 2
      ) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "🤔 I couldn't properly understand or answer that question. Try asking in a different way or provide a bit more detail.",
          },
        ]);

        return;
      }

      // ─────────────────────────────────────────
      // NORMAL SUCCESS RESPONSE
      // ─────────────────────────────────────────
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
        },
      ]);

      if (!open) {
        setHasUnread(true);
      }

    } catch (err) {
      console.error("Chatbot Error:", err);

      let errorMessage =
        "⚠️ Something went wrong. Please try again.";

      // ─────────────────────────────────────────
      // NETWORK ERROR
      // ─────────────────────────────────────────
      if (
        err.message?.includes("Network") ||
        err.message?.includes("fetch")
      ) {
        errorMessage =
          "🌐 Network issue detected. Please check your internet connection.";
      }

      // ─────────────────────────────────────────
      // GEMINI RATE LIMIT
      // ─────────────────────────────────────────
      else if (
        err.message?.includes("429")
      ) {
        errorMessage =
          "⏳ Too many requests right now. Please wait a few seconds and try again.";
      }

      // ─────────────────────────────────────────
      // SERVER ERROR
      // ─────────────────────────────────────────
      else if (
        err.message?.includes("500")
      ) {
        errorMessage =
          "🚨 Server issue detected. Please try again shortly.";
      }

      // ─────────────────────────────────────────
      // API KEY ISSUE
      // ─────────────────────────────────────────
      else if (
        err.message?.includes("401") ||
        err.message?.includes("403")
      ) {
        errorMessage =
          "🔑 API authentication issue detected.";
      }

      // ─────────────────────────────────────────
      // GENERIC ERROR
      // ─────────────────────────────────────────
      else {
        errorMessage =
          "⚠️ The assistant faced an unexpected issue. Please try again.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);

    } finally {
      setLoading(false);
    }

    // ─── ENTER KEY ───────────────────────────────────────────────────────────
    const handleKey = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    return (
      <>
        {/* ── Floating bubble ── */}
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 24px rgba(99,102,241,0.45)",
            zIndex: 9999,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.08)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
          aria-label="Open chatbot"
        >
          {open ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}

          {hasUnread && !open && (
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#f43f5e",
                border: "2px solid white",
              }}
            />
          )}
        </button>

        {/* ── Chat window ── */}
        {open && (
          <div
            style={{
              position: "fixed",
              bottom: "92px",
              right: "24px",
              width: "360px",
              maxHeight: "520px",
              borderRadius: "18px",
              background: "#ffffff",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              zIndex: 9998,
              overflow: "hidden",
              fontFamily: "'Segoe UI', system-ui, sans-serif",
              animation: "chatSlideUp 0.2s ease",
            }}
          >
            {/* Header */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                </svg>
              </div>

              <div>
                <div
                  style={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Hired.ai Assistant
                </div>

                <div
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#4ade80",
                      display: "inline-block",
                    }}
                  />
                  Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                background: "#f8f7ff",
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.role === "user"
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "9px 13px",
                      borderRadius:
                        m.role === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      background:
                        m.role === "user"
                          ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                          : "#ffffff",
                      color:
                        m.role === "user"
                          ? "white"
                          : "#1e1b4b",
                      fontSize: "13px",
                      lineHeight: "1.55",
                      boxShadow:
                        m.role === "user"
                          ? "none"
                          : "0 1px 4px rgba(0,0,0,0.08)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius:
                        "16px 16px 16px 4px",
                      background: "#ffffff",
                      boxShadow:
                        "0 1px 4px rgba(0,0,0,0.08)",
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#8b5cf6",
                          animation: `bounce 1s ease infinite`,
                          animationDelay: `${d * 0.15}s`,
                          display: "inline-block",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {showSuggestions &&
                messages.length === 1 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      marginTop: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        textAlign: "center",
                      }}
                    >
                      Quick questions
                    </div>

                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        style={{
                          background: "white",
                          border: "1px solid #e0e7ff",
                          borderRadius: "10px",
                          padding: "7px 12px",
                          fontSize: "12px",
                          color: "#6366f1",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "#f0f0ff")
                        }
                        onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "white")
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "10px 12px",
                borderTop: "1px solid #e9e8f5",
                display: "flex",
                gap: "8px",
                background: "white",
                alignItems: "flex-end",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKey}
                placeholder="Ask anything..."
                rows={1}
                style={{
                  flex: 1,
                  border: "1.5px solid #e0e7ff",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  lineHeight: "1.4",
                  color: "#1e1b4b",
                  background: "#f8f7ff",
                  maxHeight: "80px",
                  overflowY: "auto",
                }}
                onFocus={(e) =>
                (e.target.style.borderColor =
                  "#8b5cf6")
                }
                onBlur={(e) =>
                (e.target.style.borderColor =
                  "#e0e7ff")
                }
              />

              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background:
                    input.trim() && !loading
                      ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                      : "#e5e7eb",
                  border: "none",
                  cursor:
                    input.trim() && !loading
                      ? "pointer"
                      : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={
                    input.trim() && !loading
                      ? "white"
                      : "#9ca3af"
                  }
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <style>{`
        @keyframes chatSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
        }
      `}</style>
      </>
    );
  }