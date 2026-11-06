import type { CSSProperties } from "react";
import {
  siApple,
  siAstro,
  siClaude,
  siCss,
  siDart,
  siDocker,
  siExpo,
  siFastapi,
  siFigma,
  siFirebase,
  siFlutter,
  siGithubactions,
  siGoogleads,
  siGoogleanalytics,
  siGooglecloud,
  siGoogleplay,
  siGooglesearchconsole,
  siHotjar,
  siHtml5,
  siKotlin,
  siLanggraph,
  siMeta,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPayloadcms,
  siPlausibleanalytics,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siSanity,
  siSemrush,
  siSentry,
  siSupabase,
  siSwift,
  siTailwindcss,
  siTerraform,
  siTypescript,
  siVercel,
  siVonage,
  siWhatsapp,
  type SimpleIcon,
} from "simple-icons";
import { contrastRatio } from "@/lib/color";
import { cn } from "@/lib/cn";

/** Every mark the site uses, by Simple Icons slug. Named imports keep the rest of the package out. */
const ICONS: Record<string, SimpleIcon> = Object.fromEntries(
  [
    siApple,
    siAstro,
    siClaude,
    siCss,
    siDart,
    siDocker,
    siExpo,
    siFastapi,
    siFigma,
    siFirebase,
    siFlutter,
    siGithubactions,
    siGoogleads,
    siGoogleanalytics,
    siGooglecloud,
    siGoogleplay,
    siGooglesearchconsole,
    siHotjar,
    siHtml5,
    siKotlin,
    siLanggraph,
    siMeta,
    siN8n,
    siNextdotjs,
    siNodedotjs,
    siPayloadcms,
    siPlausibleanalytics,
    siPostgresql,
    siPrisma,
    siPython,
    siReact,
    siRedis,
    siSanity,
    siSemrush,
    siSentry,
    siSupabase,
    siSwift,
    siTailwindcss,
    siTerraform,
    siTypescript,
    siVercel,
    siVonage,
    siWhatsapp,
  ].map((icon) => [icon.slug, icon]),
);

/** The card surfaces a logo sits on, per theme (tokens.css). */
const SURFACES = { light: "#ffffff", dark: "#161b22" } as const;

/** The brand colour where it reads at `min` (3:1 by default) or more on the surface, otherwise the text colour. */
function fillFor(hex: string, surface: string, min = 3): string {
  return contrastRatio(`#${hex}`, surface) >= min ? `#${hex}` : "currentColor";
}

/** True when the slug is one of the marks above. */
export function hasTechLogo(slug: string | null | undefined): slug is string {
  return !!slug && slug in ICONS;
}

type TechLogoProps = {
  slug: string;
  /** The name to announce; left out when the name is shown beside the logo. */
  label?: string;
  size?: number;
  className?: string;
};

/**
 * A tool's official mark from Simple Icons, never redrawn. Drawn in the brand
 * colour, or in the text colour in a theme where the brand colour falls under
 * 3:1 against the card (for example Next.js or Vercel black in the dark theme).
 * Server-rendered: the paths travel as markup, not JavaScript.
 */
export default function TechLogo({ slug, label, size = 24, className }: TechLogoProps) {
  const icon = ICONS[slug];
  if (!icon) return null;
  const style = {
    "--logo-light": fillFor(icon.hex, SURFACES.light),
    // Dark theme asks 4.5:1: thin outline marks such as the Postgres elephant looked faint at 3:1.
    "--logo-dark": fillFor(icon.hex, SURFACES.dark, 4.5),
  } as CSSProperties;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("tech-logo shrink-0", className)}
      style={style}
      focusable="false"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {label ? <title>{label}</title> : null}
      <path d={icon.path} />
    </svg>
  );
}
