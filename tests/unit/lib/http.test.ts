import { afterEach, describe, expect, it, vi } from "vitest";

// connection() needs a Next.js request scope; outside one, treat every handler as request-time.
vi.mock("next/server", () => ({ connection: async () => undefined }));

const errors = await import("@/lib/errors");
const { fail, ok, parseJson, toResponse, withHandler } = await import("@/lib/http");
const { err, ok: success } = await import("@/lib/result");
const { z } = await import("zod");

afterEach(() => {
  vi.restoreAllMocks();
});

const cases = [
  [errors.validationError(), 400],
  [errors.unauthorized(), 401],
  [errors.forbidden(), 403],
  [errors.notFound(), 404],
  [errors.conflict("Already confirmed."), 409],
  [errors.rateLimited(30), 429],
  [errors.verificationInvalid(2), 400],
  [errors.verificationExpired(), 410],
  [errors.verificationLocked(), 423],
  [errors.botCheckFailed(), 400],
  [errors.dbError(new Error("db down")), 500],
  [errors.emailError(new Error("timeout")), 502],
  [errors.internal(new Error("boom")), 500],
] as const;

describe("fail", () => {
  it.each(cases)("maps %s to its status and envelope", async (error, status) => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = fail(error, "req-1");
    expect(response.status).toBe(status);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe(error.code);
    expect(body.error.requestId).toBe("req-1");
  });

  it("covers every error code", () => {
    expect(new Set(cases.map(([error]) => error.code))).toEqual(
      new Set(Object.keys(errors.ERROR_STATUS)),
    );
  });

  it("hides internal details of server errors and logs them once", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const body = await fail(
      errors.dbError(new Error("password authentication failed")),
      "req-2",
    ).json();
    expect(body.error.message).toBe(errors.GENERIC_SERVER_MESSAGE);
    expect(JSON.stringify(body)).not.toContain("password");
    expect(log).toHaveBeenCalledTimes(1);
  });

  it("keeps client error details and sets Retry-After when rate limited", async () => {
    const response = fail(errors.rateLimited(42.2), "req-3");
    expect(response.headers.get("Retry-After")).toBe("43");
    const body = await response.json();
    expect(body.error.details).toEqual({ retryAfterSeconds: 42.2 });
  });
});

describe("ok and toResponse", () => {
  it("wraps data in the envelope with the given status", async () => {
    const response = ok({ leadId: "x" }, { status: 201 });
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true, data: { leadId: "x" } });
  });

  it("maps a Result either way", async () => {
    expect((await toResponse(success({ verified: true }), "r").json()).ok).toBe(true);
    expect(toResponse(err(errors.notFound()), "r").status).toBe(404);
  });
});

describe("parseJson", () => {
  const schema = z.object({ name: z.string().min(1, "Enter your name.") });

  it("returns field errors for invalid bodies", async () => {
    const request = new Request("http://test/api", {
      method: "POST",
      body: JSON.stringify({ name: "" }),
    });
    const result = await parseJson(request, schema);
    expect(!result.ok && result.error.details).toEqual({
      fieldErrors: { name: ["Enter your name."] },
    });
  });

  it("rejects malformed JSON as a validation error", async () => {
    const request = new Request("http://test/api", { method: "POST", body: "{not json" });
    const result = await parseJson(request, schema);
    expect(!result.ok && result.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("withHandler", () => {
  it("adds a request ID header", async () => {
    const handler = withHandler(async () => ok({ fine: true }));
    const response = await handler(new Request("http://test/api"), { params: Promise.resolve({}) });
    expect(response.headers.get("x-request-id")).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("turns a thrown error into a logged INTERNAL response with the same request ID", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const handler = withHandler(async () => {
      throw new Error("unexpected");
    });
    const response = await handler(new Request("http://test/api"), { params: Promise.resolve({}) });
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.error.code).toBe("INTERNAL");
    expect(body.error.requestId).toBe(response.headers.get("x-request-id"));
    expect(log).toHaveBeenCalledTimes(1);
  });
});
