import rateLimit from "express-rate-limit";

// Responses include both `error` and `message` so the client can show either.
const tooMany = (text) => ({ status: 429, error: text, message: text });

const base = { standardHeaders: true, legacyHeaders: false };

// General limiter, applied to ALL routes
export const generalLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: tooMany("Too many requests, please try again in a few minutes."),
});

// Strict limiter for expensive AI work (creating an interview, evaluating answers)
export const aiLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 30,
  message: tooMany("AI request limit reached. Please try again later."),
});

// Chatbot gets its own, looser bucket so chatting never eats the interview quota
export const chatLimiter = rateLimit({
  ...base,
  windowMs: 10 * 60 * 1000,
  limit: 40,
  message: tooMany("You're sending messages too fast. Please wait a moment."),
});

// Login / register only. Successful logins don't count, failed attempts do.
export const authLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: tooMany("Too many login attempts. Please try again in 15 minutes."),
});