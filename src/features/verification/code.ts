import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

/** Codes expire 10 minutes after they are sent. */
export const CODE_TTL_MS = 10 * 60 * 1000;
/** Wrong attempts allowed before a code is locked. */
export const MAX_ATTEMPTS = 5;
/** A new code can be requested 60 seconds after the last one. */
export const RESEND_COOLDOWN_MS = 60 * 1000;
/** At most three new codes per lead per hour. */
export const RESENDS_PER_HOUR = 3;

/** A uniformly random 6-digit code; leading zeros are kept. */
export function generateCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/** HMAC-SHA256 of the code with the pepper, as hex. This is all that is ever stored. */
export function hashCode(code: string, pepper: string): string {
  return createHmac("sha256", pepper).update(code).digest("hex");
}

/** Compares a submitted code against a stored hash in constant time. */
export function codeMatches(code: string, storedHash: string, pepper: string): boolean {
  const submitted = Buffer.from(hashCode(code, pepper), "hex");
  const stored = Buffer.from(storedHash, "hex");
  return submitted.length === stored.length && timingSafeEqual(submitted, stored);
}

type VerificationState = { expiresAt: Date; attempts: number; maxAttempts: number };

export type AttemptOutcome =
  | { outcome: "verified" }
  | { outcome: "expired" }
  | { outcome: "locked" }
  | { outcome: "invalid"; attempts: number; remaining: number };

/**
 * Decides what one attempt means. Expired beats everything; a code already at
 * its attempt limit is locked; a wrong code uses up an attempt, and the attempt
 * that reaches the limit locks it.
 */
export function evaluateAttempt(
  state: VerificationState,
  matches: boolean,
  now: Date,
): AttemptOutcome {
  if (now.getTime() > state.expiresAt.getTime()) return { outcome: "expired" };
  if (state.attempts >= state.maxAttempts) return { outcome: "locked" };
  if (matches) return { outcome: "verified" };
  const attempts = state.attempts + 1;
  if (attempts >= state.maxAttempts) return { outcome: "locked" };
  return { outcome: "invalid", attempts, remaining: state.maxAttempts - attempts };
}
