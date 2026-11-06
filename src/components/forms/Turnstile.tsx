"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { publicEnv } from "@/config/public-env";

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Cloudflare Turnstile, rendered only when a site key is configured. Reports a
 * token when the check passes and null when it expires or fails.
 */
export default function Turnstile({ onToken }: { onToken: (token: string | null) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const siteKey = publicEnv.turnstileSiteKey;

  useEffect(() => {
    if (!ready || !siteKey || !container.current || !window.turnstile) return;
    const id = window.turnstile.render(container.current, {
      sitekey: siteKey,
      theme: "dark",
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });
    return () => window.turnstile?.remove(id);
  }, [ready, siteKey, onToken]);

  if (!siteKey) return null;
  return (
    <>
      <Script src={SCRIPT_URL} strategy="afterInteractive" onReady={() => setReady(true)} />
      <div ref={container} className="min-h-[65px]" />
    </>
  );
}
