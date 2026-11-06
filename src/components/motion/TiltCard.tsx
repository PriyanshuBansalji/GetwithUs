"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { onFrame } from "@/components/motion/frame";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type TiltCardProps = {
  /** Largest tilt in degrees at the card's edges. */
  maxDeg?: number;
  as?: "div" | "li" | "article";
  className?: string;
  children: ReactNode;
} & Record<`data-${string}`, string | undefined>;

/**
 * A panel that tilts toward the pointer in perspective (up to `maxDeg`) and
 * springs back when the pointer leaves (the spring is a CSS transition, see
 * `.tilt` in globals.css; writes go through the shared frame loop). Its
 * children can sit forward with translateZ. Fine pointers only, and still under
 * reduced motion. Pair it with <Brackets spread /> for the corner brackets that
 * move out on hover.
 */
export default function TiltCard({
  maxDeg = 4,
  as = "div",
  className,
  children,
  ...rest
}: TiltCardProps) {
  const pending = useRef<{ element: HTMLElement; x: number; y: number } | null>(null);
  const stop = useRef<(() => void) | null>(null);
  const fine = useMediaQuery("(pointer: fine)");
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;

  useEffect(() => () => stop.current?.(), []);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    pending.current = { element: event.currentTarget, x: event.clientX, y: event.clientY };
    stop.current ??= onFrame(() => {
      stop.current?.();
      stop.current = null;
      const point = pending.current;
      if (!point) return;
      const { element } = point;
      const rect = element.getBoundingClientRect();
      const x = (point.x - rect.left) / rect.width - 0.5;
      const y = (point.y - rect.top) / rect.height - 0.5;
      element.dataset.moving = "";
      element.style.transform = `perspective(1000px) rotateX(${(-y * 2 * maxDeg).toFixed(2)}deg) rotateY(${(x * 2 * maxDeg).toFixed(2)}deg)`;
    });
  };
  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    stop.current?.();
    stop.current = null;
    pending.current = null;
    const element = event.currentTarget;
    delete element.dataset.moving;
    element.style.transform = "";
  };

  const Tag = as;
  return (
    <Tag
      {...rest}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("tilt group relative [transform-style:preserve-3d]", className)}
    >
      {children}
    </Tag>
  );
}
