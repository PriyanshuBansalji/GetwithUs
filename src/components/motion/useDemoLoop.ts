"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useOnScreen } from "@/components/motion/useOnScreen";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Runs a scripted demo while it is on screen: `play` is called again and
 * again (it should start by resetting the demo and end with a hold), and is
 * aborted the moment the demo leaves the screen or the tab is hidden. Under
 * reduced motion it never runs, so the demo keeps its finished first render.
 * Returns whether the demo is on screen and whether motion is reduced.
 */
export function useDemoLoop(
  ref: RefObject<Element | null>,
  play: (signal: AbortSignal) => Promise<void>,
  { threshold = 0.35 }: { threshold?: number } = {},
): { active: boolean; reduce: boolean } {
  const reduce = useReducedMotion();
  const active = useOnScreen(ref, { threshold });
  const latest = useRef(play);

  useEffect(() => {
    latest.current = play;
  });

  useEffect(() => {
    if (reduce || !active) return;
    const controller = new AbortController();
    const loop = async () => {
      for (;;) await latest.current(controller.signal);
    };
    loop().catch(() => {
      // Off screen, hidden, or unmounted: the next run starts the demo again.
    });
    return () => controller.abort();
  }, [active, reduce]);

  return { active, reduce };
}
