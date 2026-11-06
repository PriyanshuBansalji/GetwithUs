import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge<"type-scale">({
  extend: {
    theme: {
      radius: ["tag", "control", "card", "panel"],
    },
    classGroups: {
      "type-scale": [{ type: ["display", "h2", "h3", "h4", "body", "lead", "small", "button"] }],
    },
  },
});

/**
 * Joins class names and resolves Tailwind conflicts so the last utility wins.
 * Knows about the project's radius tokens and `type-*` scale utilities.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
