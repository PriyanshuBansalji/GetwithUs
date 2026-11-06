/** sRGB channel (0 to 255) to linear light, per WCAG 2.2. */
function linear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance of a `#RRGGBB` colour, per WCAG 2.2. */
export function luminance(hex: string): number {
  const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (!match) throw new Error(`Expected a #RRGGBB colour, got "${hex}"`);
  const [r, g, b] = match.slice(1).map((part) => linear(parseInt(part, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two `#RRGGBB` colours, from 1 to 21. */
export function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

/** The WCAG 2.2 level a ratio reaches for normal text (large text needs 3 for AA, 4.5 for AAA). */
export function contrastLevel(ratio: number, large = false): "AAA" | "AA" | "Fail" {
  if (ratio >= (large ? 4.5 : 7)) return "AAA";
  if (ratio >= (large ? 3 : 4.5)) return "AA";
  return "Fail";
}
