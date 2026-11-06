"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

type GlobalErrorProps = { error: unknown; retry: () => void };

// The root layout may have failed, so global styles and fonts are not guaranteed: inline styles only.
// The light theme's tokens (tokens.css), copied as solid colours.
const colors = {
  bg: "#FFFFFF",
  ink: "#0F1B2D",
  body: "#46515F",
  accent: "#0E7C86",
  accentInk: "#FFFFFF",
};

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : undefined;

  useEffect(() => {
    logger.error("Root layout error shown to user", { reference: digest, error });
  }, [digest, error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: colors.bg,
          color: colors.ink,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          colorScheme: "light",
        }}
      >
        <title>Something went wrong</title>
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 24px" }}>
          <h1
            style={{
              fontSize: 40,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              marginTop: 16,
              maxWidth: "52ch",
              fontSize: 17,
              lineHeight: 1.55,
              color: colors.body,
            }}
          >
            The site could not load. Try again, and if it keeps happening,{" "}
            <a href="/contact" style={{ color: colors.accent, fontWeight: 600 }}>
              contact us
            </a>
            {digest ? " with the reference below." : "."}
          </p>
          <button
            type="button"
            onClick={retry}
            style={{
              marginTop: 32,
              height: 48,
              padding: "0 24px",
              border: 0,
              borderRadius: 999,
              background: colors.accent,
              color: colors.accentInk,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {digest ? (
            <p style={{ marginTop: 24, fontSize: 14, color: colors.body }}>
              Reference: <span style={{ color: colors.ink }}>{digest}</span>
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
