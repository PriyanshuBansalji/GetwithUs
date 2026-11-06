import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/config/env";

/**
 * The client's IP. On Vercel the first entry of `x-forwarded-for` is the client
 * as seen by the edge; behind another proxy, check that it overwrites the header
 * rather than appending to a client-supplied one (see docs/architecture.md).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** A salt that changes every UTC day, derived from the pepper, so IP hashes cannot be joined across days. */
function dailySalt(now: Date): string {
  return createHmac("sha256", env.VERIFICATION_PEPPER)
    .update(now.toISOString().slice(0, 10))
    .digest("hex");
}

/** sha256(ip + daily salt). Raw IP addresses are never stored. */
export function hashIp(ip: string, now = new Date()): string {
  return createHash("sha256")
    .update(ip + dailySalt(now))
    .digest("hex");
}

/** sha256 of an identifier (an email or an API key) for use in rate-limit keys. */
export function hashKey(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

function originsAllowed(): Set<string> {
  const origins = new Set([new URL(env.NEXT_PUBLIC_SITE_URL).origin]);
  for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL]) {
    if (host) origins.add(`https://${host}`);
  }
  return origins;
}

/** True when the request's Origin is this site (or this deployment's own preview URL). */
export function verifyOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return origin !== null && originsAllowed().has(origin);
}

/** Request facts stored with a lead: hashed IP, user agent, and preferred language. */
export function requestContext(request: Request): {
  ip: string;
  ipHash: string;
  userAgent?: string;
  locale?: string;
} {
  const ip = getClientIp(request);
  return {
    ip,
    ipHash: hashIp(ip),
    userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? undefined,
    locale: request.headers.get("accept-language")?.split(",")[0]?.trim().slice(0, 35) || undefined,
  };
}

/** Compares a presented secret with the expected one in constant time, whatever their lengths. */
export function secretsMatch(
  presented: string | null | undefined,
  expected: string | undefined,
): boolean {
  if (!presented || !expected) return false;
  const a = createHash("sha256").update(presented).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/** The client IP from request headers, for server actions that have headers but no Request. */
export function ipHashFromHeaders(headers: Headers): string {
  return hashIp(getClientIp(new Request("http://local", { headers })));
}
