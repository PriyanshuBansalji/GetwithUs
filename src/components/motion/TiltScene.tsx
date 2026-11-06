import type { CSSProperties, ReactNode } from "react";
import TiltCard from "@/components/motion/TiltCard";
import { cn } from "@/lib/cn";

/**
 * A card that tilts toward the pointer (up to 9 degrees) with a small 3D scene
 * inside: its `Layer` children sit at different depths and lift 1.9 times
 * higher while the card is hovered. Fine pointers only, still under reduced
 * motion (TiltCard and globals.css).
 */
export function TiltScene({
  children,
  className,
  maxDeg = 9,
  as = "article",
}: {
  children: ReactNode;
  className?: string;
  maxDeg?: number;
  as?: "div" | "li" | "article";
}) {
  return (
    <TiltCard maxDeg={maxDeg} as={as} className={cn("tilt-scene", className)}>
      {children}
    </TiltCard>
  );
}

/** The scene well inside a TiltScene: dotted, rounded, and 3D. Decorative: the card text says the same. */
export function Scene({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("tilt-scene-well", className)}>
      {children}
    </div>
  );
}

/** One object in a scene, `z` pixels in front of the scene's surface. */
export function Layer({
  z,
  children,
  className,
  style,
}: {
  z: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("tilt-layer", className)} style={{ ...style, "--z": z } as CSSProperties}>
      {children}
    </div>
  );
}
