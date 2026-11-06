import { describe, expect, it } from "vitest";
import { THEME_KEY, THEME_SCRIPT, resolveTheme } from "@/lib/theme";

/** Runs the inline head script against a fake page and returns the data-theme it set. */
function runScript(pathname: string, stored: string | null | Error): string | null {
  let theme: string | null = null;
  const localStorage = {
    getItem(key: string) {
      if (stored instanceof Error) throw stored;
      return key === THEME_KEY ? stored : null;
    },
  };
  const document = {
    documentElement: {
      setAttribute(name: string, value: string) {
        if (name === "data-theme") theme = value;
      },
    },
  };
  new Function("localStorage", "location", "document", THEME_SCRIPT)(
    localStorage,
    { pathname },
    document,
  );
  return theme;
}

describe("resolveTheme", () => {
  it("opens public pages light unless dark was chosen", () => {
    expect(resolveTheme(null, "/")).toBe("light");
    expect(resolveTheme("light", "/services")).toBe("light");
    expect(resolveTheme("dark", "/services")).toBe("dark");
    expect(resolveTheme("purple", "/")).toBe("light");
  });

  it("always opens the admin dark", () => {
    expect(resolveTheme(null, "/admin")).toBe("dark");
    expect(resolveTheme("light", "/admin/leads")).toBe("dark");
  });

  it("does not mistake a public path that starts with admin for the admin", () => {
    expect(resolveTheme(null, "/administration")).toBe("light");
  });
});

describe("THEME_SCRIPT", () => {
  it("sets the same theme resolveTheme picks", () => {
    for (const pathname of [
      "/",
      "/services/web-development",
      "/admin",
      "/admin/leads",
      "/administration",
    ]) {
      for (const stored of [null, "light", "dark", "other"]) {
        expect(runScript(pathname, stored)).toBe(resolveTheme(stored, pathname));
      }
    }
  });

  it("still sets a theme when storage is blocked", () => {
    expect(runScript("/", new Error("SecurityError"))).toBe("light");
    expect(runScript("/admin", new Error("SecurityError"))).toBe("dark");
  });
});
