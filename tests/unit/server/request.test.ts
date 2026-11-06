import { describe, expect, it } from "vitest";
import { getClientIp, hashIp, secretsMatch, verifyOrigin } from "@/server/request";

const request = (headers: Record<string, string>) =>
  new Request("http://localhost:3000/api/v1/leads", { headers });

describe("getClientIp", () => {
  it("uses the first x-forwarded-for entry, then x-real-ip", () => {
    expect(getClientIp(request({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" }))).toBe(
      "203.0.113.5",
    );
    expect(getClientIp(request({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(getClientIp(request({}))).toBe("unknown");
  });
});

describe("hashIp", () => {
  const day = new Date("2026-10-31T08:00:00Z");

  it("never contains the IP and is stable within a UTC day", () => {
    const hash = hashIp("203.0.113.5", day);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain("203.0.113.5");
    expect(hashIp("203.0.113.5", new Date("2026-10-31T23:59:00Z"))).toBe(hash);
  });

  it("changes with the day's salt, so hashes cannot be joined across days", () => {
    expect(hashIp("203.0.113.5", day)).not.toBe(
      hashIp("203.0.113.5", new Date("2026-11-01T08:00:00Z")),
    );
  });
});

describe("verifyOrigin", () => {
  it("accepts only the site's own origin", () => {
    expect(verifyOrigin(request({ origin: "http://localhost:3000" }))).toBe(true);
    expect(verifyOrigin(request({ origin: "https://evil.example" }))).toBe(false);
    expect(verifyOrigin(request({}))).toBe(false);
  });
});

describe("secretsMatch", () => {
  it("matches equal secrets of any length and rejects the rest", () => {
    expect(secretsMatch("a-long-secret", "a-long-secret")).toBe(true);
    expect(secretsMatch("short", "a-long-secret")).toBe(false);
    expect(secretsMatch(null, "a-long-secret")).toBe(false);
    expect(secretsMatch("anything", undefined)).toBe(false);
  });
});
