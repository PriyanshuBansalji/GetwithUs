import type { MetadataRoute } from "next";
import { privacyPolicy } from "@/content/legal/privacy";
import { termsOfService } from "@/content/legal/terms";
import {
  aboutPage,
  contactPage,
  homePage,
  processPage,
  servicesPage,
  startPage,
  workPage,
} from "@/content/pages";
import { allServicePages } from "@/content/services";
import { getPublishedCaseStudies } from "@/features/case-studies/getPublishedCaseStudies";
import { absoluteUrl } from "@/lib/seo";

/** Every public page with the date its content last changed. /work appears once a study is published. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, updated: string) => ({
    url: absoluteUrl(path),
    lastModified: updated,
  });
  const studies = getPublishedCaseStudies();

  return [
    entry(homePage.path, homePage.updated),
    entry(servicesPage.path, servicesPage.updated),
    ...allServicePages.map((page) => entry(page.href, page.updated)),
    entry(processPage.path, processPage.updated),
    ...(studies.length
      ? [
          entry(workPage.path, workPage.updated),
          ...studies.map((study) => entry(`/work/${study.slug}`, study.date)),
        ]
      : []),
    entry(aboutPage.path, aboutPage.updated),
    entry(contactPage.path, contactPage.updated),
    entry(startPage.path, startPage.updated),
    entry("/privacy", privacyPolicy.updated),
    entry("/terms", termsOfService.updated),
  ];
}
