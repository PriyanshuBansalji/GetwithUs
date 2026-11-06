import { afterEach, describe, expect, it, vi } from "vitest";
import { logger, maskEmail } from "@/lib/logger";

describe("logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes a readable line with fields outside production", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    logger.info("Lead created", { requestId: "req-1", source: "contact" });
    expect(spy).toHaveBeenCalledWith("[info] Lead created requestId=req-1 source=contact");
  });

  it("serializes errors with their cause", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    logger.error("Send failed", { error: new Error("outer", { cause: new Error("inner") }) });
    const line = String(spy.mock.calls[0]?.[0]);
    expect(line).toContain('"message":"outer"');
    expect(line).toContain('"cause":{"name":"Error","message":"inner"');
  });
});

describe("maskEmail", () => {
  it("keeps the first character and the domain", () => {
    expect(maskEmail("jane@example.com")).toBe("j***@example.com");
  });

  it("masks malformed input entirely", () => {
    expect(maskEmail("not-an-email")).toBe("***");
    expect(maskEmail("@example.com")).toBe("***");
  });
});
