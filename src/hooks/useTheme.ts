"use client";

import { useSyncExternalStore } from "react";
import { currentTheme, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** The theme on the page, live. "light" during server rendering, the default. */
export function useTheme(): Theme {
  return useSyncExternalStore<Theme>(subscribe, currentTheme, () => "light");
}
