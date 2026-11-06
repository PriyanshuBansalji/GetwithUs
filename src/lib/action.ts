import { unstable_rethrow } from "next/navigation";
import { internal, type PublicError } from "@/lib/errors";
import { newRequestId } from "@/lib/ids";
import { logger } from "@/lib/logger";
import type { Result } from "@/lib/result";

/** What a server action returns to the browser: plain data, never an Error instance. */
export type ActionResult<T> =
  { ok: true; data: T } | { ok: false; error: PublicError & { requestId: string } };

/**
 * Runs a server action body once, at the edge: expected failures come back as a
 * serializable error, unexpected ones are logged with a request ID and become
 * INTERNAL. Next.js redirect and not-found signals pass through untouched.
 */
export async function withAction<T>(
  name: string,
  body: () => Promise<Result<T>>,
): Promise<ActionResult<T>> {
  const requestId = newRequestId();
  try {
    const result = await body();
    if (result.ok) return result;
    if (result.error.isServerError) {
      logger.error("Action failed", {
        requestId,
        action: name,
        error: result.error.cause ?? result.error,
      });
    }
    return { ok: false, error: { ...result.error.toPublic(), requestId } };
  } catch (error) {
    unstable_rethrow(error);
    logger.error("Action threw", { requestId, action: name, error });
    return { ok: false, error: { ...internal(error).toPublic(), requestId } };
  }
}
