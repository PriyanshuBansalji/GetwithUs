/**
 * The tools we build with, for the marquee, the stack sphere, the editor, and
 * the service pages' tool lists. Built from every service file's `tools`, the
 * editor languages, and the prototype's marquee and sphere.
 *
 * Logos are official artwork only (docs/design.md): `logo` is a Simple Icons
 * slug from the pinned `simple-icons` package, or null when the brand has no
 * mark there (several brands ask Simple Icons not to carry theirs). A tool with
 * a null logo is shown by name. A file in public/logos/ would need its own entry
 * with the brand's media-kit URL as `source`; the guard checks that.
 */
export type ToolCategory = "web" | "mob" | "data" | "ai" | "mkt";

export type Tool = {
  name: string;
  category: ToolCategory;
  /** Simple Icons slug, or null to show the name only. */
  logo: string | null;
  /** Where the artwork comes from, or why there is none. */
  source: string;
};

const SIMPLE_ICONS = "simple-icons 16.36.0 (pinned)";
const NO_MARK = "No official mark in simple-icons 16.36.0; shown by name";

const icon = (name: string, category: ToolCategory, logo: string): Tool => ({
  name,
  category,
  logo,
  source: SIMPLE_ICONS,
});
const nameOnly = (name: string, category: ToolCategory): Tool => ({
  name,
  category,
  logo: null,
  source: NO_MARK,
});

export const tools: readonly Tool[] = [
  icon("Next.js", "web", "nextdotjs"),
  icon("React", "web", "react"),
  icon("TypeScript", "web", "typescript"),
  icon("Tailwind CSS", "web", "tailwindcss"),
  icon("HTML5", "web", "html5"),
  icon("CSS", "web", "css"),
  icon("Figma", "web", "figma"),
  icon("Astro", "web", "astro"),
  icon("Sanity", "web", "sanity"),
  icon("Payload", "web", "payloadcms"),
  // React Native's official mark is the React logo.
  icon("React Native", "mob", "react"),
  icon("Expo", "mob", "expo"),
  icon("Flutter", "mob", "flutter"),
  icon("Dart", "mob", "dart"),
  icon("Kotlin", "mob", "kotlin"),
  icon("Swift", "mob", "swift"),
  icon("Firebase", "mob", "firebase"),
  icon("App Store", "mob", "apple"),
  icon("Google Play", "mob", "googleplay"),
  icon("Node.js", "data", "nodedotjs"),
  icon("Python", "data", "python"),
  icon("FastAPI", "data", "fastapi"),
  icon("PostgreSQL", "data", "postgresql"),
  icon("Supabase", "data", "supabase"),
  icon("Prisma", "data", "prisma"),
  icon("Redis", "data", "redis"),
  icon("Docker", "data", "docker"),
  icon("GitHub Actions", "data", "githubactions"),
  icon("Terraform", "data", "terraform"),
  icon("Sentry", "data", "sentry"),
  icon("Vercel", "data", "vercel"),
  icon("Google Cloud", "data", "googlecloud"),
  nameOnly("AWS", "data"),
  nameOnly("Azure", "data"),
  icon("WhatsApp Business Platform", "ai", "whatsapp"),
  icon("Claude", "ai", "claude"),
  nameOnly("OpenAI", "ai"),
  icon("LangGraph", "ai", "langgraph"),
  icon("n8n", "ai", "n8n"),
  nameOnly("Twilio", "ai"),
  icon("Vonage", "ai", "vonage"),
  nameOnly("Plivo", "ai"),
  icon("Google Analytics", "mkt", "googleanalytics"),
  icon("Google Search Console", "mkt", "googlesearchconsole"),
  icon("Google Ads", "mkt", "googleads"),
  icon("Meta Ads", "mkt", "meta"),
  icon("Plausible", "mkt", "plausibleanalytics"),
  icon("Hotjar", "mkt", "hotjar"),
  icon("Semrush", "mkt", "semrush"),
  nameOnly("Ahrefs", "mkt"),
  nameOnly("Looker Studio", "mkt"),
];

/** The five groups, in display order, as the sphere's category buttons label them. */
export const toolCategories: readonly { key: ToolCategory; label: string; note: string }[] = [
  { key: "web", label: "Web", note: "Sites, web apps, and design" },
  { key: "mob", label: "Mobile", note: "iOS and Android apps" },
  { key: "data", label: "Backend and cloud", note: "APIs, databases, hosting" },
  { key: "ai", label: "AI and automation", note: "Agents, bots, workflows" },
  { key: "mkt", label: "Growth and analytics", note: "Ads, search, tracking" },
];

/** The tool with this name, if listed. */
export function findTool(name: string): Tool | undefined {
  return tools.find((tool) => tool.name === name);
}

/** Other names the service files use for a tool. */
const ALIASES: Record<string, readonly string[]> = {
  PostgreSQL: ["Postgres"],
  "Google Analytics": ["GA4"],
  "WhatsApp Business Platform": ["WhatsApp Business Cloud API"],
};

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The listed tools a line of text mentions, in the order they appear, for the
 * logo chips on service pages ("Expo and React Native" gives Expo and React
 * Native). Longer names win, so "React Native" is not also read as "React".
 */
export function toolsIn(text: string): Tool[] {
  const names = tools
    .flatMap((tool) => [tool.name, ...(ALIASES[tool.name] ?? [])].map((name) => ({ name, tool })))
    .sort((a, b) => b.name.length - a.name.length);
  const found: { at: number; tool: Tool }[] = [];
  let rest = text;
  for (const { name, tool } of names) {
    const pattern = new RegExp(`(^|[^\\w])${escape(name)}(?![\\w])`);
    const match = pattern.exec(rest);
    if (!match) continue;
    const at = match.index + match[1].length;
    found.push({ at, tool });
    rest = rest.slice(0, at) + " ".repeat(name.length) + rest.slice(at + name.length);
  }
  return found
    .sort((a, b) => a.at - b.at)
    .map((entry) => entry.tool)
    .filter((tool, index, list) => list.indexOf(tool) === index);
}
