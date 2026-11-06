import { describe, expect, it } from "vitest";
import { leadFiltersSchema, loginSchema, statusChangeSchema } from "@/features/admin/schema";

const leadId = "11111111-1111-4111-8111-111111111111";

describe("statusChangeSchema", () => {
  it("accepts every status a team member can choose", () => {
    for (const status of ["new", "contacted", "qualified", "won", "lost", "spam"]) {
      expect(statusChangeSchema.safeParse({ leadId, status }).success).toBe(true);
    }
  });

  it("never lets a lead be moved back to awaiting verification", () => {
    expect(statusChangeSchema.safeParse({ leadId, status: "pending_verification" }).success).toBe(
      false,
    );
  });

  it("rejects unknown statuses and malformed ids", () => {
    expect(statusChangeSchema.safeParse({ leadId, status: "archived" }).success).toBe(false);
    expect(statusChangeSchema.safeParse({ leadId: "1", status: "new" }).success).toBe(false);
  });
});

describe("leadFiltersSchema", () => {
  it("reads filters from search params", () => {
    expect(
      leadFiltersSchema.parse({ status: "won", source: "brief", q: " acme ", page: "3" }),
    ).toEqual({ status: "won", source: "brief", q: "acme", page: 3 });
  });

  it("falls back to defaults for anything malformed", () => {
    expect(leadFiltersSchema.parse({ status: "nope", source: "fax", page: "-2" })).toEqual({
      status: undefined,
      source: undefined,
      q: undefined,
      page: 1,
    });
  });

  it("takes the first value when a param repeats", () => {
    expect(leadFiltersSchema.parse({ status: ["new", "won"], page: ["2", "9"] })).toMatchObject({
      status: "new",
      page: 2,
    });
  });
});

describe("loginSchema", () => {
  it("normalizes the email", () => {
    expect(loginSchema.parse({ email: "  Admin@Example.COM " }).email).toBe("admin@example.com");
  });

  it("rejects an invalid email", () => {
    expect(loginSchema.safeParse({ email: "admin" }).success).toBe(false);
  });
});
