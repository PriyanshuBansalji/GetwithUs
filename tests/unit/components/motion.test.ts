import { describe, expect, it } from "vitest";
import { isEmail } from "@/components/cta/TerminalCta";

describe("isEmail", () => {
  it("accepts an address with a domain and rejects anything else", () => {
    expect(isEmail("name@company.com")).toBe(true);
    expect(isEmail("  name@company.co.uk ")).toBe(true);
    for (const value of ["", "name", "name@company", "name @company.com", "@company.com"]) {
      expect(isEmail(value)).toBe(false);
    }
  });
});
