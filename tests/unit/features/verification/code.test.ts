import type * as NodeCrypto from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";

const { randomIntOverride } = vi.hoisted(() => ({
  randomIntOverride: { value: null as number | null },
}));

vi.mock("node:crypto", async (importOriginal) => {
  const actual = await importOriginal<typeof NodeCrypto>();
  return {
    ...actual,
    randomInt: (min: number, max: number) => randomIntOverride.value ?? actual.randomInt(min, max),
  };
});

const { codeMatches, evaluateAttempt, generateCode, hashCode, MAX_ATTEMPTS } =
  await import("@/features/verification/code");

const pepper = "test-pepper-00000000000000000000000000";

afterEach(() => {
  randomIntOverride.value = null;
});

describe("generateCode", () => {
  it("always returns six digits", () => {
    for (let i = 0; i < 500; i++) expect(generateCode()).toMatch(/^\d{6}$/);
  });

  it("keeps leading zeros", () => {
    randomIntOverride.value = 42;
    expect(generateCode()).toBe("000042");
    randomIntOverride.value = 0;
    expect(generateCode()).toBe("000000");
  });
});

describe("hashCode and codeMatches", () => {
  it("is deterministic per pepper and differs across peppers", () => {
    expect(hashCode("123456", pepper)).toBe(hashCode("123456", pepper));
    expect(hashCode("123456", pepper)).not.toBe(hashCode("123456", `${pepper}-other`));
    expect(hashCode("123456", pepper)).toMatch(/^[0-9a-f]{64}$/);
  });

  it("never stores the code itself", () => {
    expect(hashCode("123456", pepper)).not.toContain("123456");
  });

  it("accepts the right code and rejects others", () => {
    const stored = hashCode("123456", pepper);
    expect(codeMatches("123456", stored, pepper)).toBe(true);
    expect(codeMatches("123457", stored, pepper)).toBe(false);
    expect(codeMatches("123456", stored, `${pepper}-other`)).toBe(false);
  });

  it("rejects a malformed stored hash without throwing", () => {
    expect(codeMatches("123456", "not-hex", pepper)).toBe(false);
  });
});

describe("evaluateAttempt", () => {
  const now = new Date("2026-10-31T12:00:00Z");
  const state = (attempts: number, expiresInMs = 60_000) => ({
    attempts,
    maxAttempts: MAX_ATTEMPTS,
    expiresAt: new Date(now.getTime() + expiresInMs),
  });

  it("verifies a matching code inside its window", () => {
    expect(evaluateAttempt(state(0), true, now)).toEqual({ outcome: "verified" });
  });

  it("reports expiry even when the code matches", () => {
    expect(evaluateAttempt(state(0, -1), true, now)).toEqual({ outcome: "expired" });
  });

  it("counts wrong attempts down", () => {
    expect(evaluateAttempt(state(0), false, now)).toEqual({
      outcome: "invalid",
      attempts: 1,
      remaining: 4,
    });
    expect(evaluateAttempt(state(3), false, now)).toEqual({
      outcome: "invalid",
      attempts: 4,
      remaining: 1,
    });
  });

  it("locks on the fifth wrong attempt and stays locked", () => {
    expect(evaluateAttempt(state(4), false, now)).toEqual({ outcome: "locked" });
    expect(evaluateAttempt(state(5), true, now)).toEqual({ outcome: "locked" });
  });
});
