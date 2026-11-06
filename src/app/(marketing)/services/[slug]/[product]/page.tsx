import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePageLayout from "@/components/sections/ServicePageLayout";
import { productPages } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export function generateStaticParams() {
  return productPages.map((page) => ({ slug: page.parent?.slug ?? "", product: page.slug }));
}

function findProduct(slug: string, product: string) {
  return productPages.find((page) => page.slug === product && page.parent?.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]/[product]">): Promise<Metadata> {
  const { slug, product } = await params;
  const page = findProduct(slug, product);
  if (!page) return {};
  return pageMetadata({
    title: page.name,
    description: page.seoDescription,
    path: page.href,
    ownImage: true,
  });
}

export default async function ServiceProductPage({
  params,
}: PageProps<"/services/[slug]/[product]">) {
  const { slug, product } = await params;
  const page = findProduct(slug, product);
  if (!page) notFound();
  return <ServicePageLayout page={page} />;
}
