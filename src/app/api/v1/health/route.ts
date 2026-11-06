import { env } from "@/config/env";
import { fail, ok, withHandler } from "@/lib/http";
import { pingDatabase } from "@/server/db/ping";
import { rateLimit } from "@/server/rate-limit";
import { requestContext } from "@/server/request";

/** GET /api/v1/health: liveness plus a `select 1` against the database. */
export const GET = withHandler(async (request, { requestId }) => {
  const database = await pingDatabase();
  // The limiter lives in the database, so it applies only while the database answers.
  if (database) {
    const key = `health:ip:${requestContext(request).ipHash}`;
    const limited = await rateLimit({ key, limit: 60, windowSeconds: 60 });
    if (!limited.ok && limited.error.code === "RATE_LIMITED") return fail(limited.error, requestId);
  }
  return ok(
    {
      status: database ? "ok" : "degraded",
      version: env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "development",
      db: database,
    },
    { status: database ? 200 : 503, headers: { "cache-control": "no-store" } },
  );
});
