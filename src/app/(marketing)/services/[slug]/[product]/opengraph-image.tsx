import { site } from "@/config/site";
import { productPages } from "@/content/services";
import { ogImageSize, renderOgImage } from "@/lib/og-image";

export function generateStaticParams() {
  return productPages.map((page) => ({ slug: page.parent?.slug ?? "", product: page.slug }));
}

/** One card per product page, with alt text that names the product. */
export function generateImageMetadata({ params }: { params: { slug: string; product: string } }) {
  const page = productPages.find((item) => item.slug === params.product);
  return [
    {
      id: "card",
      alt: `${page?.name ?? "Services"} at ${site.name}`,
      size: ogImageSize,
      contentType: "image/png",
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; product: string }>;
}) {
  const { product } = await params;
  const page = productPages.find((item) => item.slug === product);
  return renderOgImage({
    title: page?.name ?? "Services",
    kicker: page?.parent?.name ?? "Services",
  });
}
