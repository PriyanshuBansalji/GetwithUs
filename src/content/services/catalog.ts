import type { ServiceSlug, ServiceSummary } from "@/content/types";

/** The five service lines in display order, with the two agentic products nested. */
export const serviceLines: readonly ServiceSummary[] = [
  {
    slug: "web-development",
    name: "Web development",
    href: "/services/web-development",
    menuDescription: "Marketing sites, web apps, and stores on Next.js.",
  },
  {
    slug: "app-development",
    name: "App development",
    href: "/services/app-development",
    menuDescription: "iOS and Android from one codebase, releases handled.",
  },
  {
    slug: "agentic-automation",
    name: "Agentic automation",
    href: "/services/agentic-automation",
    menuDescription: "Agents that answer, call, and move work between tools.",
    children: [
      {
        slug: "whatsapp-bot",
        name: "WhatsApp bot",
        href: "/services/agentic-automation/whatsapp-bot",
        menuDescription: "Answers, qualifies, and books on the official Business Platform.",
      },
      {
        slug: "calling-agent",
        name: "Calling agent",
        href: "/services/agentic-automation/calling-agent",
        menuDescription: "Takes and makes calls and writes a summary to your CRM.",
      },
    ],
  },
  {
    slug: "digital-marketing",
    name: "Digital marketing",
    href: "/services/digital-marketing",
    menuDescription: "Search, paid, content, and email, measured in your analytics.",
  },
  {
    slug: "custom-software",
    name: "Custom software and cloud",
    href: "/services/custom-software",
    menuDescription: "Internal tools, integrations, and the cloud underneath.",
  },
];

/** Every service, lines and products, in navigation order. */
export const allServices: readonly ServiceSummary[] = serviceLines.flatMap((line) => [
  line,
  ...(line.children ?? []),
]);

/** Valid values for the `services` field on a lead. */
export const serviceSlugs = allServices.map((service) => service.slug) as [
  ServiceSlug,
  ...ServiceSlug[],
];

/** Display name for a stored service slug; unknown values pass through unchanged. */
export function serviceName(slug: string): string {
  return allServices.find((service) => service.slug === slug)?.name ?? slug;
}
