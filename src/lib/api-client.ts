import type { PublicError } from "@/lib/errors";
import type { ApiEnvelope } from "@/lib/http";
import { err, ok, type Result } from "@/lib/result";

/** A failed API call as the browser sees it: the public error plus the request ID to quote. */
export type ClientError = PublicError & { requestId?: string };

function networkError(): ClientError {
  return { code: "INTERNAL", message: "The request could not reach the server." };
}

/**
 * Browser-side fetch for /api/v1: sends JSON, parses the envelope, and returns a
 * Result so components switch on `error.code` to pick their copy. Never throws.
 */
export async function apiRequest<T>(
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown; signal?: AbortSignal } = {},
): Promise<Result<T, ClientError>> {
  try {
    const response = await fetch(path, {
      method: options.method ?? (options.body === undefined ? "GET" : "POST"),
      headers: options.body === undefined ? undefined : { "content-type": "application/json" },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: "same-origin",
      signal: options.signal,
    });
    const envelope = (await response.json()) as ApiEnvelope<T>;
    return envelope.ok ? ok(envelope.data) : err(envelope.error);
  } catch {
    // Offline, aborted, or a non-JSON response: one generic, actionable failure.
    return err(networkError());
  }
}
