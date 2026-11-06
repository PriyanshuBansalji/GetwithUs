import { caseStudies } from "@/content/case-studies";
import type { CaseStudy } from "@/content/types";

/**
 * Case studies that may be shown publicly: published and with client permission,
 * newest first. Drives the Work nav link, the home section, and /work.
 */
export function getPublishedCaseStudies(): CaseStudy[] {
  return caseStudies
    .filter((study) => study.published && study.permission)
    .toSorted((a, b) => b.date.localeCompare(a.date));
}

/** A published case study by slug, or undefined. */
export function findPublishedCaseStudy(slug: string): CaseStudy | undefined {
  return getPublishedCaseStudies().find((study) => study.slug === slug);
}

// Next.js requires at least one static param for /work/[slug]. While nothing is
// published, this placeholder slug renders the 404 page and is left out of the sitemap.
const PLACEHOLDER_SLUG = "none";

/** Static params for /work/[slug]: every published slug, or one placeholder while there are none. */
export function caseStudyParams(): { slug: string }[] {
  const slugs = getPublishedCaseStudies().map((study) => study.slug);
  return (slugs.length ? slugs : [PLACEHOLDER_SLUG]).map((slug) => ({ slug }));
}
