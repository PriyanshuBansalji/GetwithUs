"use client";

import { useRef, type ReactNode } from "react";
import { useOnScreen } from "@/components/motion/useOnScreen";
import { cn } from "@/lib/cn";

/**
 * Pauses the CSS animations inside it while it is off screen or the tab is
 * hidden (it sets data-paused; see globals.css). For CSS-only loops: marquees,
 * floating tiles, the rotating seal, pulsing dots, the closing band's rings.
 */
export default function OnScreen({
  children,
  className,
  "aria-hidden": ariaHidden,
}: {
  children: ReactNode;
  className?: string;
  "aria-hidden"?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const active = useOnScreen(ref, { threshold: 0 });
  return (
    <div
      ref={ref}
      aria-hidden={ariaHidden}
      data-paused={active ? undefined : ""}
      className={cn("on-screen", className)}
    >
      {children}
    </div>
  );
}
