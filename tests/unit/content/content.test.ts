import { describe, expect, it } from "vitest";
import { privacyPolicy } from "@/content/legal/privacy";
import { termsOfService } from "@/content/legal/terms";
import {
  aboutPage,
  contactPage,
  processPage,
  servicesPage,
  startPage,
  workPage,
} from "@/content/pages";
import { allServicePages } from "@/content/services";
import { allServices, serviceName, serviceSlugs } from "@/content/services/catalog";
import {
  caseStudyParams,
  getPublishedCaseStudies,
} from "@/features/case-studies/getPublishedCaseStudies";

const pageMeta = [
  ...[aboutPage, contactPage, processPage, servicesPage, startPage, workPage].map((page) => ({
    title: page.title,
    description: page.description,
  })),
  ...allServicePages.map((page) => ({ title: page.name, description: page.seoDescription })),
  { title: privacyPolicy.title, description: privacyPolicy.description },
  { title: termsOfService.title, description: termsOfService.description },
];

describe("page metadata", () => {
  it("keeps every description under 160 characters", () => {
    for (const meta of pageMeta) expect(meta.description.length, meta.title).toBeLessThan(160);
  });

  it("keeps every title unique and short enough for the site-name suffix", () => {
    const titles = pageMeta.map((meta) => meta.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const title of titles) expect(`${title} | GetwithUs`.length, title).toBeLessThan(60);
  });
});

describe("service content", () => {
  it("has a page for every catalog entry", () => {
    expect(allServicePages.map((page) => page.slug).sort()).toEqual([...serviceSlugs].sort());
    expect(allServices).toHaveLength(7);
  });

  it("gives every page the sections the layout renders", () => {
    for (const page of allServicePages) {
      expect(page.whatYouGet.length, page.slug).toBeGreaterThan(0);
      expect(page.howWeWork.length, page.slug).toBeGreaterThan(0);
      expect(page.tools.length, page.slug).toBeGreaterThan(0);
      expect(page.faqs.length, page.slug).toBeGreaterThan(0);
    }
  });

  it("nests the agentic products under their line", () => {
    const products = allServicePages.filter((page) => page.parent);
    expect(products.map((page) => page.href)).toEqual([
      "/services/agentic-automation/whatsapp-bot",
      "/services/agentic-automation/calling-agent",
    ]);
  });

  it("maps stored slugs to display names", () => {
    expect(serviceName("custom-software")).toBe("Custom software and cloud");
    expect(serviceName("unknown")).toBe("unknown");
  });
});

describe("legal documents", () => {
  it.each([privacyPolicy, termsOfService])("$title has unique section anchors", (document) => {
    const ids = document.sections.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("case studies", () => {
  it("publishes nothing invented and keeps one placeholder param for the build", () => {
    expect(getPublishedCaseStudies()).toEqual([]);
    expect(caseStudyParams()).toEqual([{ slug: "none" }]);
  });
});
