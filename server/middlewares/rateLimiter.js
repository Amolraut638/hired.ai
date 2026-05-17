import rateLimit from "express-rate-limit";

// General limiter — for all routes
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                   // max 100 requests per IP
    standardHeaders: true,      // sends RateLimit headers in response
    legacyHeaders: false,
    message: {
        status: 429,
        error: "Too many requests, please try again after 15 minutes."
    }
});

// Strict limiter — for AI routes (Gemini API calls are expensive)
export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 20,                    // max 20 AI requests per IP per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: "AI request limit reached. Please try again after an hour."
    }
});

// Auth limiter — prevent brute force on login/register
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 10,                    // max 10 attempts
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: "Too many login attempts. Please try again after 15 minutes."
    }
});