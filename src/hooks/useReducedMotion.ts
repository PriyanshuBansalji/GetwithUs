"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

/** True when the visitor asked the system to reduce motion. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
