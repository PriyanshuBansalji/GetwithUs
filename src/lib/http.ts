import { connection } from "next/server";
import { z } from "zod";
import type { $ZodType } from "zod/v4/core";
import {
  type AppError,
  GENERIC_SERVER_MESSAGE,
  internal,
  isAppError,
  validationError,
  type PublicError,
} from "@/lib/errors";
import { newRequestId } from "@/lib/ids";
import { logger } from "@/lib/logger";
import { err, ok as success, type Result } from "@/lib/result";

/** The response envelope every /api endpoint returns. */
export type ApiEnvelope<T> =
  { ok: true; data: T } | { ok: false; error: PublicError & { requestId?: string } };

/** A 2xx JSON response in the envelope. */
export function ok<T>(data: T, init?: ResponseInit): Response {
  return Response.json({ ok: true, data } satisfies ApiEnvelope<T>, init);
}

/**
 * An error response in the envelope, with the code's HTTP status. Server errors
 * carry a generic message and the request ID, never internal details, and are
 * logged here, once, with their cause. Every error response passes through this.
 */
export function fail(error: AppError, requestId: string): Response {
  if (error.isServerError) {
    logger.error("Request failed", { requestId, code: error.code, error: error.cause ?? error });
  }
  const body: ApiEnvelope<never> = {
    ok: false,
    error: error.isServerError
      ? { code: error.code, message: GENERIC_SERVER_MESSAGE, requestId }
      : { ...error.toPublic(), requestId },
  };
  const headers = new Headers();
  const retryAfter = error.details?.retryAfterSeconds;
  if (error.code === "RATE_LIMITED" && typeof retryAfter === "number") {
    headers.set("Retry-After", String(Math.max(1, Math.ceil(retryAfter))));
  }
  return Response.json(body, { status: error.status, headers });
}

/** Maps a service Result to a response: `ok` on success, `fail` otherwise. */
export function toResponse<T>(result: Result<T>, requestId: string, init?: ResponseInit): Response {
  return result.ok ? ok(result.data, init) : fail(result.error, requestId);
}

/**
 * Reads a JSON body and validates it against any Zod 4 schema (classic or mini).
 * Malformed JSON and schema failures both become VALIDATION_ERROR, with
 * per-field messages in `details.fieldErrors`.
 */
export async function parseJson<S extends $ZodType>(
  request: Request,
  schema: S,
): Promise<Result<z.output<S>>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    // An unreadable body is the caller's mistake, answered with a validation error rather than logged.
    return err(validationError("Send a JSON body."));
  }
  const parsed = z.safeParse(schema, body);
  if (!parsed.success) {
    return err(
      validationError(undefined, { fieldErrors: z.flattenError(parsed.error).fieldErrors }),
    );
  }
  return success(parsed.data);
}

export type HandlerContext<P> = { params: Promise<P>; requestId: string };

/**
 * Wraps a route handler: marks it as request-time, assigns a request ID (returned
 * in `x-request-id` and passed to the handler for logs), and turns anything
 * thrown into a logged INTERNAL error. The one catch for every route.
 */
export function withHandler<P = Record<string, never>>(
  handler: (request: Request, context: HandlerContext<P>) => Promise<Response>,
) {
  return async (request: Request, context: { params: Promise<P> }): Promise<Response> => {
    // Outside the try: under cacheComponents this bails out of prerendering by throwing.
    await connection();
    const requestId = newRequestId();
    let response: Response;
    try {
      response = await handler(request, { params: context.params, requestId });
    } catch (error) {
      // fail() logs it, with its cause, as a server error.
      response = fail(isAppError(error) ? error : internal(error), requestId);
    }
    response.headers.set("x-request-id", requestId);
    return response;
  };
}
