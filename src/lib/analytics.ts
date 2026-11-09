/**
 * Thin wrapper around the GA4 gtag function.
 *
 * - Safe to call server-side (window check) and when GA is not loaded.
 * - Never sends personal data: no emails, phone numbers, or message content.
 * - All event names follow the GA4 recommended event naming convention.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire a GA4 event. No-ops when gtag is not available (SSR, ad blockers). */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params ?? {});
}

// ---------------------------------------------------------------------------
// Typed helpers for every tracked event in the app.
// No personal data is ever passed to these functions.
// ---------------------------------------------------------------------------

/** A genuine lead: fired only after email verification succeeds. */
export function trackGenerateLead(source: "contact" | "brief"): void {
  trackEvent("generate_lead", { form_source: source });
}

/** User starts filling in a form (first field interaction). */
export function trackFormStart(source: "contact" | "brief"): void {
  trackEvent("form_start", { form_source: source });
}

/** User clicks an email mailto link. */
export function trackClickEmail(): void {
  trackEvent("click_email");
}

/** User clicks a WhatsApp link or button. */
export function trackClickWhatsApp(): void {
  trackEvent("click_whatsapp");
}

/** User clicks a primary CTA button (Start a project, etc.). */
export function trackClickCta(label: string): void {
  trackEvent("click_cta", { cta_label: label });
}
