import { after } from "next/server";
import { handleLeadVerified } from "@/features/leads/service";
import { verifyBodySchema } from "@/features/verification/schema";
import { verifyCode } from "@/features/verification/service";
import { forbidden } from "@/lib/errors";
import { fail, ok, parseJson, toResponse, withHandler } from "@/lib/http";
import { rateLimit } from "@/server/rate-limit";
import { requestContext, verifyOrigin } from "@/server/request";

/**
 * POST /api/v1/leads/verify: checks the code. On success the lead becomes `new`,
 * and confirmation and notifications run after the response is sent.
 */
export const POST = withHandler(async (request, { requestId }) => {
  if (!verifyOrigin(request)) return fail(forbidden("Send the code from the website."), requestId);

  const limited = await rateLimit({
    key: `lead_verify:ip:${requestContext(request).ipHash}`,
    limit: 10,
    windowSeconds: 600,
  });
  if (!limited.ok) return fail(limited.error, requestId);

  const body = await parseJson(request, verifyBodySchema);
  if (!body.ok) return fail(body.error, requestId);

  const result = await verifyCode(body.data.leadId, body.data.code);
  if (!result.ok) return toResponse(result, requestId);

  const { lead, alreadyVerified } = result.data;
  if (!alreadyVerified) after(() => handleLeadVerified(lead, requestId));
  return ok({ verified: true });
});
