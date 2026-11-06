import { env } from "@/config/env";
import { runCleanup } from "@/features/maintenance/cleanup";
import { unauthorized } from "@/lib/errors";
import { fail, toResponse, withHandler, type HandlerContext } from "@/lib/http";
import { logger } from "@/lib/logger";
import { secretsMatch } from "@/server/request";

/**
 * The daily cleanup. Vercel Cron calls it with GET; POST is accepted for manual
 * runs. Both require `Authorization: Bearer CRON_SECRET`.
 */
async function cleanup(request: Request, { requestId }: HandlerContext<Record<string, never>>) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
  if (!secretsMatch(token, env.CRON_SECRET))
    return fail(unauthorized("Send the cron secret."), requestId);

  const result = await runCleanup();
  if (result.ok) logger.info("Cleanup finished", { requestId, ...result.data });
  return toResponse(result, requestId);
}

export const GET = withHandler(cleanup);
export const POST = withHandler(cleanup);
