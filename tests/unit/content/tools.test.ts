import { describe, expect, it } from "vitest";
import { hasTechLogo } from "@/components/ui/TechLogo";
import { codeSamples } from "@/content/code-samples";
import { allServicePages } from "@/content/services";
import { findTool, toolCategories, tools, toolsIn } from "@/content/tools";

describe("tools", () => {
  it("gives every tool an official mark that exists, or an explicit no-mark flag", () => {
    for (const tool of tools) {
      if (tool.logo === null) {
        expect(tool.source, tool.name).toMatch(/^No official mark/);
      } else {
        expect(hasTechLogo(tool.logo), `${tool.name}: ${tool.logo}`).toBe(true);
        expect(tool.source, tool.name).toMatch(/simple-icons \d+\.\d+\.\d+/);
      }
    }
  });

  it("lists each tool once, in a known category", () => {
    const names = tools.map((tool) => tool.name);
    expect(new Set(names).size).toBe(names.length);
    const categories = new Set(toolCategories.map((category) => category.key));
    for (const tool of tools) expect(categories.has(tool.category), tool.name).toBe(true);
  });

  it("has tools in every category", () => {
    for (const category of toolCategories) {
      expect(
        tools.some((tool) => tool.category === category.key),
        category.label,
      ).toBe(true);
    }
  });

  it("finds tools by name", () => {
    expect(findTool("Python")?.logo).toBe("python");
    expect(findTool("Not a tool")).toBeUndefined();
  });

  it("has a mark for every editor language", () => {
    for (const sample of codeSamples) expect(hasTechLogo(sample.logo), sample.name).toBe(true);
  });
});

describe("toolsIn", () => {
  const names = (text: string) => toolsIn(text).map((tool) => tool.name);

  it("finds every tool a line names, in order, preferring the longer name", () => {
    expect(names("Expo and React Native")).toEqual(["Expo", "React Native"]);
    expect(names("Next.js")).toEqual(["Next.js"]);
    expect(names("Telephony providers (Twilio, Vonage, or Plivo)")).toEqual([
      "Twilio",
      "Vonage",
      "Plivo",
    ]);
  });

  it("reads the service files' other names for tools", () => {
    expect(names("Postgres")).toEqual(["PostgreSQL"]);
    expect(names("Plausible or GA4")).toEqual(["Plausible", "Google Analytics"]);
    expect(names("WhatsApp Business Cloud API (official, no unofficial libraries)")).toEqual([
      "WhatsApp Business Platform",
    ]);
  });

  it("does not match inside other words", () => {
    expect(names("Reactive dashboards")).toEqual([]);
  });

  it("finds at least one listed tool on every service page", () => {
    for (const page of allServicePages) {
      expect(page.tools.flatMap(toolsIn).length, page.slug).toBeGreaterThan(0);
    }
  });
});
