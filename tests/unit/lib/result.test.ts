import { describe, expect, it } from "vitest";
import { notFound } from "@/lib/errors";
import { err, ok, type Result } from "@/lib/result";

describe("Result", () => {
  it("wraps data", () => {
    const result: Result<number> = ok(42);
    expect(result).toEqual({ ok: true, data: 42 });
  });

  it("wraps an error and narrows on ok", () => {
    const result: Result<number> = err(notFound());
    if (result.ok) throw new Error("expected a failure");
    expect(result.error.code).toBe("NOT_FOUND");
  });
});
