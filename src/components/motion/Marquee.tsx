import type { CSSProperties, ReactNode } from "react";
import OnScreen from "@/components/motion/OnScreen";
import { cn } from "@/lib/cn";

type MarqueeProps = {
  /** The items, rendered twice so the loop has no visible join; the copy is hidden from screen readers. */
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  label: string;
  className?: string;
};

/**
 * A row of items that scrolls sideways forever: a duplicated track moved by
 * CSS, with the edges faded. It pauses on hover and while something inside has
 * focus, stops when off screen, and under reduced motion becomes a still row
 * you can scroll sideways (globals.css).
 */
export default function Marquee({
  children,
  duration = 50,
  reverse = false,
  label,
  className,
}: MarqueeProps) {
  return (
    <OnScreen className={cn("marquee", className)}>
      <div role="group" aria-label={label} className="marquee-viewport">
        <div
          className={cn("marquee-track", reverse && "marquee-reverse")}
          style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
        >
          <div className="marquee-set">{children}</div>
          <div className="marquee-set" aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
    </OnScreen>
  );
}
