import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/config/env";
import { flags } from "@/config/flags";
import { botCheckFailed } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { err, ok, type Result } from "@/lib/result";

/** A form must be open at least this long before it can be submitted. */
export const FORM_TOKEN_MIN_AGE_MS = 3_000;
/** A form token is accepted for two hours after it is issued. */
export const FORM_TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

function sign(issuedAt: string, pepper: string): string {
  return createHmac("sha256", pepper).update(`form-token:${issuedAt}`).digest("base64url");
}

/** An HMAC-signed timestamp the form fetches on mount and sends back with the submission. */
export function issueFormToken(now = new Date(), pepper = env.VERIFICATION_PEPPER): string {
  const issuedAt = String(now.getTime());
  return `${issuedAt}.${sign(issuedAt, pepper)}`;
}

/**
 * Accepts a token only if the signature matches and it is between 3 seconds and
 * 2 hours old. Faster submissions are almost always scripts.
 */
export function verifyFormToken(
  token: string,
  now = new Date(),
  pepper = env.VERIFICATION_PEPPER,
): Result<null> {
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature || !/^\d+$/.test(issuedAt)) return err(botCheckFailed());
  const expected = Buffer.from(sign(issuedAt, pepper));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received))
    return err(botCheckFailed());
  const age = now.getTime() - Number(issuedAt);
  if (age < FORM_TOKEN_MIN_AGE_MS || age > FORM_TOKEN_MAX_AGE_MS) return err(botCheckFailed());
  return ok(null);
}

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verifies a Cloudflare Turnstile token when Turnstile is configured. A token
 * Cloudflare rejects fails the check. If Cloudflare cannot be reached, the
 * submission is allowed and the outage logged: the honeypot, form token, and
 * rate limits still apply, and a provider outage should not lose real leads.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<Result<{ checked: boolean }>> {
  if (!flags.turnstile) return ok({ checked: false });
  if (!token) return err(botCheckFailed());
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY ?? "",
        response: token,
        remoteip: ip,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      logger.warn("Turnstile verification unavailable; submission allowed", {
        status: response.status,
      });
      return ok({ checked: false });
    }
    const outcome = (await response.json()) as { success?: boolean };
    return outcome.success ? ok({ checked: true }) : err(botCheckFailed());
  } catch (error) {
    logger.warn("Turnstile verification unavailable; submission allowed", { error });
    return ok({ checked: false });
  }
}
