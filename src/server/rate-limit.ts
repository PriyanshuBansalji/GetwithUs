import { rateLimited } from "@/lib/errors";
import { err, ok, type Result } from "@/lib/result";
import { dbRateLimitStore } from "@/server/rate-limit-store";

/**
 * Storage for fixed-window counters. `increment` must atomically add one to the
 * key's count, or reset it to one with `windowStart = now` when the stored window
 * began at or before `now - windowSeconds`.
 */
export type RateLimitStore = {
  increment(
    key: string,
    windowSeconds: number,
    now: Date,
  ): Promise<Result<{ count: number; windowStart: Date }>>;
};

export type RateLimitRule = { key: string; limit: number; windowSeconds: number };

/**
 * Builds a fixed-window limiter over a store and a clock. Returns RATE_LIMITED,
 * with seconds until the window resets, once the count passes the limit.
 */
export function createRateLimiter(store: RateLimitStore, clock: () => Date = () => new Date()) {
  return async function check(rule: RateLimitRule): Promise<Result<{ remaining: number }>> {
    const now = clock();
    const hit = await store.increment(rule.key, rule.windowSeconds, now);
    if (!hit.ok) return hit;
    const { count, windowStart } = hit.data;
    if (count > rule.limit) {
      const resetsAt = windowStart.getTime() + rule.windowSeconds * 1000;
      return err(rateLimited(Math.max(1, Math.ceil((resetsAt - now.getTime()) / 1000))));
    }
    return ok({ remaining: rule.limit - count });
  };
}

/** Checks rules in order and stops at the first one exceeded. */
export async function checkRateLimits(rules: readonly RateLimitRule[]): Promise<Result<null>> {
  for (const rule of rules) {
    const result = await rateLimit(rule);
    if (!result.ok) return result;
  }
  return ok(null);
}

/** The app's limiter, backed by the rate_limits table. */
export const rateLimit = createRateLimiter(dbRateLimitStore);
