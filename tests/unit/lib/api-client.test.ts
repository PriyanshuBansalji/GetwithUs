import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/lib/api-client";

afterEach(() => {
  vi.unstubAllGlobals();
});

function respondWith(body: unknown, status = 200) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("apiRequest", () => {
  it("posts JSON and returns the data on success", async () => {
    const fetchMock = respondWith({ ok: true, data: { verified: true } });
    const result = await apiRequest<{ verified: boolean }>("/api/v1/leads/verify", {
      body: { code: "123456" },
    });
    expect(result).toEqual({ ok: true, data: { verified: true } });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/leads/verify",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ code: "123456" }) }),
    );
  });

  it("returns the envelope error with its code and request ID", async () => {
    respondWith(
      {
        ok: false,
        error: { code: "VERIFICATION_EXPIRED", message: "That code has expired.", requestId: "r1" },
      },
      410,
    );
    const result = await apiRequest("/api/v1/leads/verify", { body: {} });
    expect(result).toEqual({
      ok: false,
      error: { code: "VERIFICATION_EXPIRED", message: "That code has expired.", requestId: "r1" },
    });
  });

  it("turns a network failure into one generic error instead of throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new TypeError("offline"))),
    );
    const result = await apiRequest("/api/v1/forms/token");
    expect(!result.ok && result.error.code).toBe("INTERNAL");
  });
});
