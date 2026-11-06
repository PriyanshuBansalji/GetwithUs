/**
 * Projection maths for Orbit3D, ported from the prototype. Everything works in
 * a 1000-unit square (the SVG viewBox), so the first frame can be rendered on
 * the server without knowing the stage's size: chips are placed in cqw.
 */
export const UNITS = 1000;
const CENTRE = UNITS / 2;
const PERSPECTIVE = UNITS * 1.8;
const DEG = Math.PI / 180;
/** The cube's resting turn at time 0 is -24 degrees, the still frame's angle. */
const CUBE_PHASE = Math.asin(-24 / 32);

type View = { tiltX: number; tiltZ: number; radius: number };

type Point = { x: number; y: number; z: number; depth: number };

/** A point at `angle` on a ring of `radius`, tilted and seen in perspective. */
export function project(angle: number, radius: number, view: View): Point {
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const y1 = z * Math.sin(view.tiltX);
  const z1 = z * Math.cos(view.tiltX);
  const x2 = x * Math.cos(view.tiltZ) - y1 * Math.sin(view.tiltZ);
  const y2 = x * Math.sin(view.tiltZ) + y1 * Math.cos(view.tiltZ);
  const scale = PERSPECTIVE / (PERSPECTIVE - z1);
  return {
    x: CENTRE + x2 * scale,
    y: CENTRE + y2 * scale,
    z: z1,
    depth: (z1 / (radius * Math.cos(view.tiltX)) + 1) / 2,
  };
}

/** The front or back half of a tilted ring, as an SVG path. */
export function ringPath(radius: number, view: View, front: boolean): string {
  let d = "";
  let pen = false;
  for (let k = 0; k <= 96; k++) {
    const point = project((k / 96) * Math.PI * 2, radius, view);
    if (front ? point.z >= 0 : point.z < 0) {
      d += `${pen ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      pen = true;
    } else {
      pen = false;
    }
  }
  return d;
}

export type OrbitState = {
  /** The ring's turn, in radians. */
  rotation: number;
  /** Seconds of animation so far. */
  time: number;
  /** Eased pointer position over the stage, -1 to 1. */
  mx: number;
  my: number;
  /** Ring radius as a share of the stage width: 0.4, or 0.35 below 500 px. */
  radiusFactor: number;
  /** Reduced motion: no drift, packets and satellites hold still. */
  still: boolean;
};

export type ChipFrame = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
  front: boolean;
  wire: string;
  wireOpacity: number;
  packetX: number;
  packetY: number;
};

type SatelliteFrame = { x: number; y: number; front: boolean; opacity: number };

export type OrbitFrame = {
  cube: string;
  rings: { outerBack: string; outerFront: string; innerBack: string; innerFront: string };
  chips: ChipFrame[];
  satellites: SatelliteFrame[];
};

export const SATELLITES = 3;

/** Where each packet starts along its wire, spread out without randomness so server and client agree. */
export function packetPhase(index: number, count: number): number {
  return index / count + ((index * 37) % 10) / 100;
}

export function orbitFrame(state: OrbitState, count: number): OrbitFrame {
  const { rotation, time, mx, my, still } = state;
  const radius = UNITS * state.radiusFactor;
  const view: View = { tiltX: (64 + my * 9) * DEG, tiltZ: (-10 + mx * 6) * DEG, radius };
  const inner: View = { ...view, radius: radius * 0.62 };
  const turn = still ? -24 : Math.sin(time * 0.45 + CUBE_PHASE) * 32;

  const chips: ChipFrame[] = [];
  for (let index = 0; index < count; index++) {
    const point = project(rotation + (index * Math.PI * 2) / count, radius, view);
    const front = point.z >= 0;
    const midX = (point.x + CENTRE) / 2;
    const midY = (point.y + CENTRE) / 2;
    const dx = CENTRE - point.x;
    const dy = CENTRE - point.y;
    const qx = midX - dy * 0.18;
    const qy = midY + dx * 0.18;
    const u = still ? 0.45 : (time * 0.32 + packetPhase(index, count)) % 1;
    chips.push({
      x: point.x,
      y: point.y,
      scale: 0.72 + 0.36 * point.depth,
      // Never below 0.66, so the chip text keeps a readable contrast at the back.
      opacity: 0.66 + 0.34 * point.depth,
      zIndex: (front ? 30 : 5) + Math.round(point.depth * 10),
      front,
      wire: `M${point.x.toFixed(1)} ${point.y.toFixed(1)}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${CENTRE} ${CENTRE}`,
      wireOpacity: 0.35 + 0.65 * point.depth,
      packetX: (1 - u) * (1 - u) * point.x + 2 * (1 - u) * u * qx + u * u * CENTRE,
      packetY: (1 - u) * (1 - u) * point.y + 2 * (1 - u) * u * qy + u * u * CENTRE,
    });
  }

  const satellites: SatelliteFrame[] = [];
  for (let index = 0; index < SATELLITES; index++) {
    const point = project(index * 2.1 - (still ? 0 : time * 0.5), inner.radius, inner);
    satellites.push({
      x: point.x,
      y: point.y,
      front: point.z >= 0,
      opacity: 0.4 + 0.6 * point.depth,
    });
  }

  return {
    cube: `rotateX(${(-16 - my * 10).toFixed(2)}deg) rotateY(${(turn + mx * 18).toFixed(2)}deg)`,
    rings: {
      outerBack: ringPath(radius, view, false),
      outerFront: ringPath(radius, view, true),
      innerBack: ringPath(inner.radius, inner, false),
      innerFront: ringPath(inner.radius, inner, true),
    },
    chips,
    satellites,
  };
}

/** A chip's transform: its centre on the projected point, in container units. */
export function chipTransform(chip: ChipFrame): string {
  return `translate(${(chip.x / 10).toFixed(2)}cqw, ${(chip.y / 10).toFixed(2)}cqw) translate(-50%, -50%) scale(${chip.scale.toFixed(3)})`;
}
