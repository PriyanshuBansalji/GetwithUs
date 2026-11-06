import type { Metadata } from "next";
import { site } from "@/config/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is instead of appending the site name (the home page). */
  absoluteTitle?: boolean;
  /** The segment has its own opengraph-image file, so the default card must not be set here. */
  ownImage?: boolean;
};

// A page-level openGraph object replaces the inherited one, so pages without their own
// opengraph-image file name the default card explicitly.
const defaultImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name}: software your business runs on`,
};

/**
 * Metadata for one page: a unique title and description, the canonical URL, and
 * Open Graph and Twitter fields with the default card unless the segment has its own.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  ownImage = false,
}: PageMetadataInput): Metadata {
  // Omit the key entirely when the segment has its own image; even `images: undefined` hides it.
  const images = ownImage ? {} : { images: [defaultImage] };
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en",
      url: path,
      title: fullTitle,
      description,
      ...images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, ...images },
  };
}

/** An absolute URL on this site, for structured data and emails. */
export function absoluteUrl(path: string): string {
  return path === "/" ? site.url : `${site.url}${path}`;
}
