import { describe, expect, it } from "vitest";
import { z } from "zod";
import type { $ZodType } from "zod/v4/core";
import {
  briefFieldsSchema,
  briefStepSchemas,
  contactFieldsSchema,
  integrationLeadSchema,
  leadSubmissionSchema,
} from "@/features/leads/schema";

function fieldErrors(schema: $ZodType, input: unknown): Record<string, string[] | undefined> {
  const result = z.safeParse(schema, input);
  if (result.success) throw new Error("expected validation to fail");
  return z.flattenError(result.error).fieldErrors as Record<string, string[] | undefined>;
}

const validContact = {
  name: "Test Lead",
  email: "test.lead@example.com",
  company: "",
  services: ["web-development"],
  message: "We need a new marketing site with a CMS.",
};

const validBrief = {
  services: ["app-development", "whatsapp-bot"],
  description: "A booking app for a small chain of clinics in two cities.",
  existingUrl: "",
  budgetRange: "not-sure",
  timeline: "exploring",
  name: "Test Lead",
  email: "test.lead@example.com",
  company: "",
  phone: "",
  referral: "",
};

describe("contactFieldsSchema", () => {
  it("accepts valid input and normalizes the email and empty optionals", () => {
    const parsed = contactFieldsSchema.parse({
      ...validContact,
      email: "  Test.Lead@Example.COM ",
    });
    expect(parsed.email).toBe("test.lead@example.com");
    expect(parsed.company).toBeUndefined();
  });

  it("defaults services to an empty list", () => {
    const { services: _services, ...rest } = validContact;
    expect(contactFieldsSchema.parse(rest).services).toEqual([]);
  });

  it.each([
    ["name", { name: "  " }, "Enter your name."],
    [
      "email",
      { email: "not-an-email" },
      "Enter a valid email address, for example name@company.com.",
    ],
    [
      "message",
      { message: "Too short." },
      "Write at least 20 characters so we understand the request.",
    ],
    ["message", { message: "x".repeat(2001) }, "Use 2,000 characters or fewer."],
    ["company", { company: "x".repeat(121) }, "Use 120 characters or fewer."],
  ])("rejects an invalid %s", (field, override, message) => {
    expect(fieldErrors(contactFieldsSchema, { ...validContact, ...override })[field]).toContain(
      message,
    );
  });

  it("rejects services that are not on the site", () => {
    expect(
      fieldErrors(contactFieldsSchema, { ...validContact, services: ["seo-magic"] }).services,
    ).toBeDefined();
  });
});

describe("brief schemas", () => {
  it("accepts a complete brief", () => {
    expect(briefFieldsSchema.safeParse(validBrief).success).toBe(true);
  });

  it("validates each wizard step on its own", () => {
    expect(fieldErrors(briefStepSchemas.services, { services: [] }).services).toContain(
      "Choose at least one service.",
    );
    expect(fieldErrors(briefStepSchemas.project, { description: "Short" }).description).toContain(
      "Write at least 40 characters so we understand the project.",
    );
    expect(fieldErrors(briefStepSchemas.budget, { budgetRange: "", timeline: "" })).toMatchObject({
      budgetRange: ["Choose a budget range, or Not sure yet."],
      timeline: ["Choose a timeline."],
    });
  });

  it("adds https:// to a bare domain and rejects non-web addresses", () => {
    expect(
      briefStepSchemas.project.parse({
        description: validBrief.description,
        existingUrl: "example.com",
      }),
    ).toMatchObject({ existingUrl: "https://example.com" });
    expect(
      fieldErrors(briefStepSchemas.project, {
        description: validBrief.description,
        existingUrl: "ftp://x",
      }).existingUrl,
    ).toBeDefined();
  });

  it("accepts international phone formats and rejects letters", () => {
    expect(briefStepSchemas.details.parse({ ...validBrief, phone: "+91 98765 43210" }).phone).toBe(
      "+91 98765 43210",
    );
    expect(
      fieldErrors(briefStepSchemas.details, { ...validBrief, phone: "call me" }).phone,
    ).toContain("Use digits, spaces, and an optional + for the country code.");
  });
});

describe("leadSubmissionSchema", () => {
  const bot = { formToken: "1700000000000.signature" };

  it("routes by source", () => {
    expect(leadSubmissionSchema.parse({ source: "contact", ...validContact, ...bot }).source).toBe(
      "contact",
    );
    expect(leadSubmissionSchema.parse({ source: "brief", ...validBrief, ...bot }).source).toBe(
      "brief",
    );
  });

  it("requires the form token and rejects unknown sources", () => {
    expect(leadSubmissionSchema.safeParse({ source: "contact", ...validContact }).success).toBe(
      false,
    );
    expect(leadSubmissionSchema.safeParse({ source: "api", ...validContact, ...bot }).success).toBe(
      false,
    );
  });

  it("keeps the honeypot value so the service can recognize bots", () => {
    const parsed = leadSubmissionSchema.parse({
      source: "contact",
      ...validContact,
      ...bot,
      website: "x",
    });
    expect(parsed.website).toBe("x");
  });
});

describe("integrationLeadSchema", () => {
  it("needs only a name and a valid email", () => {
    expect(
      integrationLeadSchema.parse({ name: "Test Lead", email: "Lead@Example.com" }),
    ).toMatchObject({
      email: "lead@example.com",
      services: [],
    });
  });
});
