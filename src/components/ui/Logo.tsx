import Link from "next/link";
import { site } from "@/config/site";
import { MARK_G_PATH, MARK_SIZE, MARK_SQUARE, MARK_TILE_RADIUS, WORDMARK } from "@/lib/brand";
import { cn } from "@/lib/cn";

type LogoProps = {
  /** Where the logo links. Pass `null` to render it without a link. */
  href?: string | null;
  showWordmark?: boolean;
  /** "lg" in the site header and footer, "md" in the admin. */
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
};

/** Mark height in px; the wordmark is drawn at the same height (src/lib/brand.ts). */
const SIZES = {
  md: { mark: 28, gap: "gap-2" },
  lg: { mark: 36, gap: "gap-2.5" },
} as const;

/**
 * The brand mark alone: the G holding a square, on its tile, in the theme tokens.
 * Sized by `size` in px, or by CSS through `className` when `size` is left out
 * (the hero cube, the chat avatar, the seal). Decorative: pair it with a name.
 */
export function LogoMark({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <rect
        width={MARK_SIZE}
        height={MARK_SIZE}
        rx={MARK_TILE_RADIUS}
        className="fill-brand-tile forced-colors:fill-[CanvasText]"
      />
      <path d={MARK_G_PATH} className="fill-brand-mark forced-colors:fill-[Canvas]" />
      <rect
        x={MARK_SQUARE.x}
        y={MARK_SQUARE.y}
        width={MARK_SQUARE.size}
        height={MARK_SQUARE.size}
        rx={MARK_SQUARE.radius}
        className="fill-accent forced-colors:fill-[Canvas]"
      />
    </svg>
  );
}

/**
 * The logo: the G holding a square on its tile, and the outlined wordmark with the
 * square dot on the i. Colours come from the theme tokens (--brand-tile,
 * --brand-mark, --ink, --accent), so it follows the light and dark themes. In
 * forced colours (Windows high contrast) it switches to the system text and
 * page colours: an SVG fill is not recoloured the way text is.
 */
export default function Logo({
  href = "/",
  showWordmark = true,
  size = "lg",
  className,
  onClick,
}: LogoProps) {
  const { mark, gap } = SIZES[size];
  const content = (
    <>
      <LogoMark size={mark} />
      {showWordmark ? (
        <svg
          viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`}
          width={Math.round((mark * WORDMARK.width) / WORDMARK.height)}
          height={mark}
          aria-hidden="true"
          focusable="false"
          className="shrink-0"
        >
          <path d={WORDMARK.ink} className="fill-ink forced-colors:fill-[CanvasText]" />
          <path d={WORDMARK.accent} className="fill-accent forced-colors:fill-[CanvasText]" />
          <rect
            x={WORDMARK.dot.x}
            y={WORDMARK.dot.y}
            width={WORDMARK.dot.size}
            height={WORDMARK.dot.size}
            rx={WORDMARK.dot.radius}
            className="fill-accent forced-colors:fill-[CanvasText]"
          />
        </svg>
      ) : null}
    </>
  );

  const classes = cn("inline-flex items-center rounded-tag", gap, className);

  if (href === null) {
    return (
      <span className={classes} role="img" aria-label={site.name}>
        {content}
      </span>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={`${site.name} home`} onClick={onClick}>
      {content}
    </Link>
  );
}
