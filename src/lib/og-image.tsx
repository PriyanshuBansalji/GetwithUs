import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND_COLORS, MARK_G_PATH, MARK_SQUARE, MARK_TILE_RADIUS, WORDMARK } from "@/lib/brand";

// Read once at module scope; the font does not depend on the request.
const bricolageExtraBold = readFileSync(
  join(process.cwd(), "src/assets/fonts/BricolageGrotesque-ExtraBold.ttf"),
);

// The light theme's tokens (tokens.css), as solid colours.
const BG = "#FFFFFF";
const SOFT = "#F4F7F9";
const INK = "#0F1B2D";
const BODY = "#46515F";
const ACCENT = "#0E7C86";
const LOGO = BRAND_COLORS.light;
const LOGO_HEIGHT = 60;

export const ogImageSize = { width: 1200, height: 630 };

/**
 * The Open Graph card in the light design: the logo, an optional kicker, and
 * the page title in Bricolage Grotesque on white, with one accent bar. Solid
 * colours only, no photos.
 */
export function renderOgImage({
  title,
  kicker,
}: {
  title: string;
  kicker?: string;
}): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BG,
        borderBottom: `16px solid ${SOFT}`,
        padding: 80,
        fontFamily: "Bricolage Grotesque",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 17 }}>
        <svg width={LOGO_HEIGHT} height={LOGO_HEIGHT} viewBox="0 0 64 64">
          <rect width="64" height="64" rx={MARK_TILE_RADIUS} fill={LOGO.tile} />
          <path d={MARK_G_PATH} fill={LOGO.mark} />
          <rect
            x={MARK_SQUARE.x}
            y={MARK_SQUARE.y}
            width={MARK_SQUARE.size}
            height={MARK_SQUARE.size}
            rx={MARK_SQUARE.radius}
            fill={LOGO.accent}
          />
        </svg>
        <svg
          width={Math.round((LOGO_HEIGHT * WORDMARK.width) / WORDMARK.height)}
          height={LOGO_HEIGHT}
          viewBox={`0 0 ${WORDMARK.width} ${WORDMARK.height}`}
        >
          <path d={WORDMARK.ink} fill={LOGO.ink} />
          <path d={WORDMARK.accent} fill={LOGO.accent} />
          <rect
            x={WORDMARK.dot.x}
            y={WORDMARK.dot.y}
            width={WORDMARK.dot.size}
            height={WORDMARK.dot.size}
            rx={WORDMARK.dot.radius}
            fill={LOGO.accent}
          />
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {kicker ? <span style={{ fontSize: 30, color: BODY }}>{kicker}</span> : null}
        <span
          style={{
            fontSize: 76,
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
            color: INK,
            maxWidth: 1000,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{ display: "flex", width: 120, height: 8, borderRadius: 4, background: ACCENT }}
      />
    </div>,
    {
      ...ogImageSize,
      fonts: [
        { name: "Bricolage Grotesque", data: bricolageExtraBold, weight: 800, style: "normal" },
      ],
    },
  );
}
