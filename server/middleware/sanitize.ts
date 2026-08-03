import { Request, Response, NextFunction } from "express";

/**
 * Lightweight XSS sanitization middleware.
 * Recursively sanitizes all string values in req.body.
 * Uses a regex-based approach to avoid additional dependency weight.
 */
function sanitizeValue(value: any): any {
  if (typeof value === "string") {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
      // Remove javascript: protocol
      .replace(/javascript\s*:/gi, "")
      // Remove on* event handlers
      .replace(/on\w+\s*=/gi, "");
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      sanitized[key] = sanitizeValue(value[key]);
    }
    return sanitized;
  }
  return value;
}

/**
 * Express middleware that sanitizes request body against XSS attacks.
 */
export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  next();
}
