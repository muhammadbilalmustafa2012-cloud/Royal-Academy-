import rateLimit from "express-rate-limit";

/**
 * Tiered rate limiters for different endpoint categories.
 */

/** Strict limiter for authentication endpoints (5 requests per 15 minutes) */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false
});

/** Moderate limiter for form submissions (20 requests per 15 minutes) */
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many form submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

/** Relaxed limiter for general API reads (200 requests per 15 minutes) */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests from this IP. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false
});

/** AI chat limiter (30 requests per 15 minutes) */
export const aiChatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many AI chat requests. Please wait before sending more." },
  standardHeaders: true,
  legacyHeaders: false
});
