"use client";

/**
 * A plain anchor that fires a GA4 event on click.
 * Used for email, phone, and WhatsApp links in the footer and contact details.
 * The href and visible label are already public; no personal data is sent.
 */

import type { AnchorHTMLAttributes } from "react";
import { trackClickEmail, trackClickWhatsApp } from "@/lib/analytics";

type EventKind = "email" | "whatsapp";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  kind: EventKind;
};

const HANDLERS: Record<EventKind, () => void> = {
  email: trackClickEmail,
  whatsapp: trackClickWhatsApp,
};

export default function TrackedLink({ kind, onClick, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        HANDLERS[kind]();
        onClick?.(e);
      }}
    />
  );
}
