import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("joins conditional classes", () => {
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("lets the last conflicting utility win", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("bg-ink", "bg-ink-2")).toBe("bg-ink-2");
  });

  it("knows the project radius tokens and type scale", () => {
    expect(cn("rounded-control", "rounded-card")).toBe("rounded-card");
    expect(cn("type-body", "type-small")).toBe("type-small");
  });
});
