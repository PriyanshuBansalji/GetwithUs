import { serviceLines } from "@/content/services/catalog";

/** The five service lines as chip options, with the agentic products nested. */
export const serviceOptions = serviceLines.map((line) => ({
  value: line.slug,
  label: line.name,
  children: line.children?.map((child) => ({ value: child.slug, label: child.name })),
}));
