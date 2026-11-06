import { site } from "@/config/site";
import { serviceLinePages } from "@/content/services";
import { ogImageSize, renderOgImage } from "@/lib/og-image";

export function generateStaticParams() {
  return serviceLinePages.map((page) => ({ slug: page.slug }));
}

/** One card per service page, with alt text that names the service. */
export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const page = serviceLinePages.find((item) => item.slug === params.slug);
  return [
    {
      id: "card",
      alt: `${page?.name ?? "Services"} at ${site.name}`,
      size: ogImageSize,
      contentType: "image/png",
    },
  ];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = serviceLinePages.find((item) => item.slug === slug);
  return renderOgImage({ title: page?.name ?? "Services", kicker: "Services" });
}
