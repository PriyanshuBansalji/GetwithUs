import { describe, expect, it } from "vitest";
import { codeSamples } from "@/content/code-samples";
import {
  EXAMPLE_LABEL,
  callDemo,
  cmsDemo,
  deployLog,
  searchDemo,
  whatsappDemo,
  workflowDemo,
} from "@/content/demos";

/** Every string inside a value, however deeply nested. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

// Figure dash to horizontal bar, and the minus sign.
const DASH = /[‒-―−]/;
// Pictographic characters, except the two marks the design allows (U+2713 and U+2717).
const EMOJI = /(?![✓✗])\p{Extended_Pictographic}/u;

describe("demo copy", () => {
  const copy = strings([
    whatsappDemo,
    callDemo,
    workflowDemo,
    deployLog,
    searchDemo,
    cmsDemo,
    EXAMPLE_LABEL,
  ]);

  it("has no dashes and no emoji", () => {
    for (const text of copy) {
      expect(text, text).not.toMatch(DASH);
      expect(text, text).not.toMatch(EMOJI);
    }
  });

  it("labels the conversations as examples", () => {
    expect(EXAMPLE_LABEL).toBe("Example conversation");
    expect(whatsappDemo.summary).toMatch(/^Example/);
    expect(callDemo.summary).toMatch(/^Example/);
  });

  it("follows the WhatsApp script: the customer picks an offered quick reply, and the handoff chip is there", () => {
    const offered = whatsappDemo.steps.flatMap((step) => ("replies" in step ? step.replies : []));
    expect(offered).toContain("Google Calendar");
    expect(
      whatsappDemo.steps.some(
        (step) => step.from === "customer" && step.text === "Google Calendar",
      ),
    ).toBe(true);
    expect(whatsappDemo.handoff).toBe("Talk to a person");
  });

  it("ends the call with the CRM summary fields", () => {
    expect(callDemo.crm.fields.map((field) => field.label)).toEqual([
      "Name",
      "Need",
      "Budget range",
      "Next step",
    ]);
  });
});

describe("code samples", () => {
  it("have no typographic dashes in their visible text", () => {
    for (const sample of codeSamples) {
      for (const text of [sample.label, sample.note, sample.run, sample.result, sample.code]) {
        expect(text, sample.name).not.toMatch(DASH);
      }
    }
  });
});
