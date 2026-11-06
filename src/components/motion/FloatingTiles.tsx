import type { CSSProperties, ReactNode } from "react";
import OnScreen from "@/components/motion/OnScreen";

export type FloatingTile = {
  key: string;
  content: ReactNode;
  /** Position around the object, as CSS lengths (for example "-34px" or "30%"). */
  style: CSSProperties;
  /** Depth in front of the object, in pixels. */
  z: number;
  /** Resting tilt in degrees. */
  rotate?: number;
  /** Seconds the bob is offset, so the tiles move out of step. */
  delay?: number;
};

/**
 * Tiles floating at different depths around a 3D object (inside a parent with
 * preserve-3d), bobbing gently while on screen; still under reduced motion.
 * Decorative: the same logos are named beside the object.
 */
export default function FloatingTiles({ tiles }: { tiles: readonly FloatingTile[] }) {
  return (
    <OnScreen
      aria-hidden
      className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
    >
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="floating-tile"
          style={{ ...tile.style, transform: `translateZ(${tile.z}px)` }}
        >
          <div
            className="floating-tile-inner"
            style={
              {
                "--r": `${tile.rotate ?? 0}deg`,
                animationDelay: `${-(tile.delay ?? 0)}s`,
              } as CSSProperties
            }
          >
            {tile.content}
          </div>
        </div>
      ))}
    </OnScreen>
  );
}
