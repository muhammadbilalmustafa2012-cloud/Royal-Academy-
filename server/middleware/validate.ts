import { Request, Response, NextFunction } from "express";

/**
 * Lightweight request body validation helpers.
 * No external dependencies — plain TypeScript validation.
 */

export interface ValidationError {
  field: string;
  message: string;
}

type ValidatorFn = (value: any, field: string) => string | null;

/** Check a value is a non-empty string */
export const isRequired: ValidatorFn = (value, field) => {
  if (!value || (typeof value === "string" && value.trim().length === 0)) {
    return `${field} is required.`;
  }
  return null;
};

/** Check value is a valid email (basic regex) */
export const isEmail: ValidatorFn = (value, field) => {
  if (!value) return null; // skip if empty — use isRequired for mandatory
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof value !== "string" || !emailRe.test(value.trim())) {
    return `${field} must be a valid email address.`;
  }
  return null;
};

/** Check value matches a Pakistani phone pattern */
export const isPhone: ValidatorFn = (value, field) => {
  if (!value) return null;
  const digits = String(value).replace(/[^0-9+]/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return `${field} must be a valid phone number (10-15 digits).`;
  }
  return null;
};

/** Check string length is within bounds */
export function maxLength(max: number): ValidatorFn {
  return (value, field) => {
    if (typeof value === "string" && value.length > max) {
      return `${field} must be ${max} characters or less.`;
    }
    return null;
  };
}

/** Check string length is at least min characters */
export function minLength(min: number): ValidatorFn {
  return (value, field) => {
    if (typeof value === "string" && value.trim().length < min) {
      return `${field} must be at least ${min} characters.`;
    }
    return null;
  };
}

/**
 * Creates a validation middleware from a schema definition.
 * Schema maps field names to arrays of validator functions.
 *
 * Usage:
 * ```ts
 * app.post("/api/admissions", validateBody({
 *   studentName: [isRequired, maxLength(200)],
 *   phone: [isRequired, isPhone],
 *   email: [isEmail]
 * }), handler);
 * ```
 */
export function validateBody(
  schema: Record<string, ValidatorFn[]>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];

    for (const [field, validators] of Object.entries(schema)) {
      const value = req.body[field];
      for (const validate of validators) {
        const err = validate(value, field);
        if (err) {
          errors.push({ field, message: err });
          break; // Stop at first error per field
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: "Validation failed.",
        details: errors
      });
      return;
    }

    next();
  };
}
