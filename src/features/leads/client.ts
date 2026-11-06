import type { SubmitLeadResult } from "@/features/leads/service";
import { apiRequest, type ClientError } from "@/lib/api-client";
import type { Result } from "@/lib/result";

/*
 * Browser calls to the lead API. Types only from the server modules, so no
 * server code reaches the client bundle.
 */

/** A fresh form token; the form fetches one on mount and again after a bot-check failure. */
export function fetchFormToken(): Promise<Result<{ token: string }, ClientError>> {
  return apiRequest<{ token: string }>("/api/v1/forms/token");
}

/** Submits a contact message or project brief. */
export function submitLeadRequest(
  body: Record<string, unknown>,
): Promise<Result<SubmitLeadResult, ClientError>> {
  return apiRequest<SubmitLeadResult>("/api/v1/leads", { body });
}

/** Checks a 6-digit code. */
export function verifyLeadCode(
  leadId: string,
  code: string,
): Promise<Result<{ verified: true }, ClientError>> {
  return apiRequest<{ verified: true }>("/api/v1/leads/verify", { body: { leadId, code } });
}

/** Asks for a new code. */
export function resendLeadCode(
  leadId: string,
): Promise<Result<{ resendAvailableAt: string }, ClientError>> {
  return apiRequest<{ resendAvailableAt: string }>("/api/v1/leads/resend", { body: { leadId } });
}

/** UTM parameters captured on the landing page, kept for the visit. */
export function readUtm(): Record<string, string> | undefined {
  try {
    const stored = window.sessionStorage.getItem(UTM_KEY);
    return stored ? (JSON.parse(stored) as Record<string, string>) : undefined;
  } catch {
    // Storage blocked or corrupted: campaign attribution is optional.
    return undefined;
  }
}

const UTM_KEY = "gw-utm";
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

/** Saves UTM parameters from the current URL, if any, for the rest of the visit. */
export function captureUtm(): void {
  const params = new URLSearchParams(window.location.search);
  const utm = Object.fromEntries(
    UTM_PARAMS.flatMap((key) => {
      const value = params.get(key);
      return value ? [[key.slice(4), value.slice(0, 200)]] : [];
    }),
  );
  if (Object.keys(utm).length === 0) return;
  try {
    window.sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
  } catch {
    // Storage blocked: the lead is still accepted without campaign attribution.
  }
}
