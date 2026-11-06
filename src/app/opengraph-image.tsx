import { homePage } from "@/content/pages";
import { ogImageSize, renderOgImage } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = "image/png";
export const alt = "GetwithUs: software your business runs on";

export default function Image() {
  return renderOgImage({ title: homePage.hero.title });
}
