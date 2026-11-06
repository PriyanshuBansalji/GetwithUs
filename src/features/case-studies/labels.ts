import type { CaseStudy } from "@/content/types";

/** The client's name, or "Confidential [industry] client" when they asked not to be named. */
export function clientLabel(study: CaseStudy): string {
  return study.client ?? `Confidential ${study.industry.toLowerCase()} client`;
}
