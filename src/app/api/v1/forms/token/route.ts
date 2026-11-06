import { formToken } from "@/features/leads/service";
import { fail, ok, withHandler } from "@/lib/http";
import { rateLimit } from "@/server/rate-limit";
import { requestContext } from "@/server/request";

/** GET /api/v1/forms/token: a signed timestamp the form sends back with its submission. */
export const GET = withHandler(async (request, { requestId }) => {
  const limited = await rateLimit({
    key: `form_token:ip:${requestContext(request).ipHash}`,
    limit: 30,
    windowSeconds: 60,
  });
  if (!limited.ok) return fail(limited.error, requestId);
  return ok(formToken(), { headers: { "cache-control": "no-store" } });
});
