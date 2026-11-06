import {
  caseStudyParams,
  findPublishedCaseStudy,
} from "@/features/case-studies/getPublishedCaseStudies";
import { site } from "@/config/site";
import { ogImageSize, renderOgImage } from "@/lib/og-image";

export function generateStaticParams() {
  return caseStudyParams();
}

/** One card per case study, with alt text that names it. */
export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const study = findPublishedCaseStudy(params.slug);
  return [
    {
      id: "card",
      alt: `${study?.title ?? "Selected work"}: a ${site.name} case study`,
      size: ogImageSize,
      contentType: "image/png",
    },
  ];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const study = findPublishedCaseStudy((await params).slug);
  return renderOgImage({ title: study?.title ?? "Selected work", kicker: "Selected work" });
}
