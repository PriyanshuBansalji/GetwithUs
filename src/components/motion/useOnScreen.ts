"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True while the element is on screen and the tab is visible: the one rule
 * every looping animation follows (docs/design.md, Motion runs only on screen).
 */
export function useOnScreen(
  ref: RefObject<Element | null>,
  { threshold = 0.15, rootMargin = "0px" }: { threshold?: number; rootMargin?: string } = {},
): boolean {
  const [intersecting, setIntersecting] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), {
      threshold,
      rootMargin,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return intersecting && visible;
}
