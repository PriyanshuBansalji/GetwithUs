"use client";

import { useEffect } from "react";
import { resolveTheme, THEME_KEY } from "@/lib/theme";

/**
 * Keeps the admin dark even after a client-side navigation into it (the theme
 * script in the root layout already sets dark on a full load of an /admin
 * path), and restores the visitor's theme when leaving.
 */
export default function ForceDarkTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "dark");
    return () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_KEY);
      } catch {
        // Storage blocked: fall back to the default.
      }
      root.setAttribute("data-theme", resolveTheme(stored, window.location.pathname));
    };
  }, []);
  return null;
}
