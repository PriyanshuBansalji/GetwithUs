import { agenticAutomation } from "@/content/services/agentic-automation";
import { appDevelopment } from "@/content/services/app-development";
import { callingAgent } from "@/content/services/calling-agent";
import { serviceLines } from "@/content/services/catalog";
import { customSoftware } from "@/content/services/custom-software";
import { digitalMarketing } from "@/content/services/digital-marketing";
import { webDevelopment } from "@/content/services/web-development";
import { whatsappBot } from "@/content/services/whatsapp-bot";
import type { ServiceContent, ServicePage, ServiceSlug, ServiceSummary } from "@/content/types";

const content: Record<ServiceSlug, ServiceContent> = {
  "web-development": webDevelopment,
  "app-development": appDevelopment,
  "agentic-automation": agenticAutomation,
  "whatsapp-bot": whatsappBot,
  "calling-agent": callingAgent,
  "digital-marketing": digitalMarketing,
  "custom-software": customSoftware,
};

function toPage(summary: ServiceSummary, parent?: ServiceSummary): ServicePage {
  return { ...summary, ...content[summary.slug], parent };
}

/** The five service lines with full content, in display order. */
export const serviceLinePages: readonly ServicePage[] = serviceLines.map((line) => toPage(line));

/** The two agentic automation products with full content. */
export const productPages: readonly ServicePage[] = serviceLines.flatMap((line) =>
  (line.children ?? []).map((child) => toPage(child, line)),
);

/** All seven service pages. */
export const allServicePages: readonly ServicePage[] = [...serviceLinePages, ...productPages];

/** Looks up a service page by slug. */
export function findServicePage(slug: string): ServicePage | undefined {
  return allServicePages.find((page) => page.slug === slug);
}
