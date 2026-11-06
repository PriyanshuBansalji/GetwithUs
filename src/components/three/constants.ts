/*
 * Settings shared by the page model canvases (ModelCanvas): one tier per
 * device class, chosen once per visit by useQuality.
 */
import type { Quality } from "@/stores/scene.store";

type TierSettings = {
  /** Device pixel ratio range for the canvas. */
  dpr: number | [number, number];
};

export const TIERS: Record<Exclude<Quality, "none">, TierSettings> = {
  high: { dpr: [1, 1.75] },
  medium: { dpr: [1, 1.25] },
  low: { dpr: 1 },
};
