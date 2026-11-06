import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageLayout from "@/components/sections/ServicePageLayout";
import { serviceLinePages } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export function generateStaticParams() {
  return serviceLinePages.map((page) => ({ slug: page.slug }));
}

function findLine(slug: string) {
  return serviceLinePages.find((page) => page.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const page = findLine((await params).slug);
  if (!page) return {};
  return pageMetadata({
    title: page.name,
    description: page.seoDescription,
    path: page.href,
    ownImage: true,
  });
}

export default async function ServiceLinePage({ params }: PageProps<"/services/[slug]">) {
  const page = findLine((await params).slug);
  if (!page) notFound();
  return <ServicePageLayout page={page} />;
}
