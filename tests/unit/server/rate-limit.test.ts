import { describe, expect, it } from "vitest";
import { ok } from "@/lib/result";
import { createRateLimiter, type RateLimitStore } from "@/server/rate-limit";

/** In-memory double with the same fixed-window semantics as the SQL upsert. */
function memoryStore(): RateLimitStore {
  const rows = new Map<string, { count: number; windowStart: Date }>();
  return {
    async increment(key, windowSeconds, now) {
      const row = rows.get(key);
      const expired = !row || row.windowStart.getTime() <= now.getTime() - windowSeconds * 1000;
      const next = expired
        ? { count: 1, windowStart: now }
        : { count: row.count + 1, windowStart: row.windowStart };
      rows.set(key, next);
      return ok({ ...next });
    },
  };
}

function fakeClock(start: string) {
  let now = new Date(start).getTime();
  return { now: () => new Date(now), advance: (seconds: number) => (now += seconds * 1000) };
}

describe("createRateLimiter", () => {
  const rule = { key: "lead_create:ip:abc", limit: 5, windowSeconds: 3600 };

  it("allows up to the limit and counts down", async () => {
    const clock = fakeClock("2026-10-31T10:00:00Z");
    const check = createRateLimiter(memoryStore(), clock.now);
    const remaining = [];
    for (let i = 0; i < 5; i++) {
      const result = await check(rule);
      if (!result.ok) throw new Error("expected to pass");
      remaining.push(result.data.remaining);
    }
    expect(remaining).toEqual([4, 3, 2, 1, 0]);
  });

  it("rejects past the limit with the seconds until the window resets", async () => {
    const clock = fakeClock("2026-10-31T10:00:00Z");
    const check = createRateLimiter(memoryStore(), clock.now);
    for (let i = 0; i < 5; i++) await check(rule);
    clock.advance(600);
    const result = await check(rule);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("RATE_LIMITED");
    expect(result.error.details?.retryAfterSeconds).toBe(3000);
  });

  it("opens a new window once the old one has passed", async () => {
    const clock = fakeClock("2026-10-31T10:00:00Z");
    const check = createRateLimiter(memoryStore(), clock.now);
    for (let i = 0; i < 6; i++) await check(rule);
    clock.advance(3600);
    const result = await check(rule);
    expect(result.ok && result.data.remaining).toBe(4);
  });

  it("keeps keys independent", async () => {
    const clock = fakeClock("2026-10-31T10:00:00Z");
    const check = createRateLimiter(memoryStore(), clock.now);
    for (let i = 0; i < 6; i++) await check(rule);
    expect((await check({ ...rule, key: "lead_create:ip:other" })).ok).toBe(true);
  });

  it("passes store failures through", async () => {
    const failing: RateLimitStore = {
      async increment() {
        const { dbError } = await import("@/lib/errors");
        return { ok: false, error: dbError(new Error("down")) };
      },
    };
    const result = await createRateLimiter(failing)(rule);
    expect(!result.ok && result.error.code).toBe("DB_ERROR");
  });
});
