import { describe, expect, it } from "vitest";
import {
  FORM_TOKEN_MAX_AGE_MS,
  FORM_TOKEN_MIN_AGE_MS,
  issueFormToken,
  verifyFormToken,
} from "@/features/leads/bot-checks";

const pepper = "test-pepper-00000000000000000000000000";
const issued = new Date("2026-10-31T10:00:00Z");
const after = (ms: number) => new Date(issued.getTime() + ms);

describe("form token", () => {
  const token = issueFormToken(issued, pepper);

  it("is accepted between 3 seconds and 2 hours after it was issued", () => {
    expect(verifyFormToken(token, after(FORM_TOKEN_MIN_AGE_MS), pepper).ok).toBe(true);
    expect(verifyFormToken(token, after(FORM_TOKEN_MAX_AGE_MS), pepper).ok).toBe(true);
  });

  it("is rejected when submitted too fast or too late", () => {
    expect(verifyFormToken(token, after(FORM_TOKEN_MIN_AGE_MS - 1), pepper).ok).toBe(false);
    expect(verifyFormToken(token, after(FORM_TOKEN_MAX_AGE_MS + 1), pepper).ok).toBe(false);
  });

  it("is rejected when tampered with or signed with another key", () => {
    const [timestamp, signature] = token.split(".");
    const earlier = `${Number(timestamp) - 60_000}.${signature}`;
    expect(verifyFormToken(earlier, after(10_000), pepper).ok).toBe(false);
    expect(verifyFormToken(token, after(10_000), `${pepper}-other`).ok).toBe(false);
    expect(verifyFormToken("garbage", after(10_000), pepper).ok).toBe(false);
  });

  it("fails with the bot check code", () => {
    const result = verifyFormToken("garbage", after(10_000), pepper);
    expect(!result.ok && result.error.code).toBe("BOT_CHECK_FAILED");
  });
});
