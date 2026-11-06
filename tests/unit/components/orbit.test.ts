import { describe, expect, it } from "vitest";
import {
  UNITS,
  chipTransform,
  orbitFrame,
  packetPhase,
  project,
  ringPath,
} from "@/components/motion/orbit-math";
import { fibonacciSphere } from "@/components/motion/TagSphere";

const view = { tiltX: (64 * Math.PI) / 180, tiltZ: (-10 * Math.PI) / 180, radius: 400 };
const still = { rotation: 0, time: 0, mx: 0, my: 0, radiusFactor: 0.4, still: true };

describe("project", () => {
  it("puts the nearest point of the ring at full depth and the farthest at none", () => {
    expect(project(Math.PI / 2, 400, view).depth).toBeCloseTo(1);
    expect(project(-Math.PI / 2, 400, view).depth).toBeCloseTo(0);
  });

  it("draws nearer points lower on the stage, because the ring tilts toward the viewer", () => {
    const near = project(Math.PI / 2, 400, { ...view, tiltZ: 0 });
    const far = project(-Math.PI / 2, 400, { ...view, tiltZ: 0 });
    expect(near.y).toBeGreaterThan(UNITS / 2);
    expect(far.y).toBeLessThan(UNITS / 2);
  });
});

describe("ringPath", () => {
  it("splits the ring into a back half and a front half", () => {
    expect(ringPath(400, view, true)).toMatch(/^M/);
    expect(ringPath(400, view, false)).toMatch(/^M/);
    expect(ringPath(400, view, true)).not.toBe(ringPath(400, view, false));
  });
});

describe("orbitFrame", () => {
  it("layers chips in front of the core (z 20) or behind it, by depth", () => {
    const frame = orbitFrame(still, 7);
    expect(frame.chips).toHaveLength(7);
    for (const chip of frame.chips) {
      if (chip.front) expect(chip.zIndex).toBeGreaterThan(20);
      else expect(chip.zIndex).toBeLessThan(20);
    }
  });

  it("keeps every chip readable: opacity never below 0.66", () => {
    for (let step = 0; step < 24; step++) {
      const frame = orbitFrame({ ...still, rotation: step / 4 }, 7);
      for (const chip of frame.chips) expect(chip.opacity).toBeGreaterThanOrEqual(0.66);
    }
  });

  it("holds the cube at -24 degrees and the packets mid-wire under reduced motion", () => {
    const frame = orbitFrame({ ...still, time: 12 }, 3);
    expect(frame.cube).toContain("rotateY(-24.00deg)");
    expect(frame).toEqual(orbitFrame(still, 3));
  });

  it("starts the moving cube at the same angle as the still one, so nothing jumps", () => {
    expect(orbitFrame({ ...still, still: false }, 3).cube).toBe(orbitFrame(still, 3).cube);
  });

  it("places chips in container units", () => {
    expect(chipTransform(orbitFrame(still, 1).chips[0])).toMatch(
      /^translate\([\d.]+cqw, [\d.]+cqw\)/,
    );
  });
});

describe("packetPhase", () => {
  it("spreads packets without randomness, so server and client agree", () => {
    expect(packetPhase(3, 7)).toBe(packetPhase(3, 7));
    expect(new Set([0, 1, 2, 3, 4, 5, 6].map((index) => packetPhase(index, 7))).size).toBe(7);
  });
});

describe("fibonacciSphere", () => {
  it("puts every point on the unit sphere, top to bottom", () => {
    const points = fibonacciSphere(40);
    expect(points[0].y).toBe(1);
    expect(points.at(-1)?.y).toBe(-1);
    for (const { x, y, z } of points) expect(Math.hypot(x, y, z)).toBeCloseTo(1);
  });
});
