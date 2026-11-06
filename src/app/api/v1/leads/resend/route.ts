import { resendBodySchema } from "@/features/verification/schema";
import { resendCode } from "@/features/verification/service";
import { forbidden } from "@/lib/errors";
import { fail, parseJson, toResponse, withHandler } from "@/lib/http";
import { verifyOrigin } from "@/server/request";

/** POST /api/v1/leads/resend: a new code, 60 seconds after the last, at most 3 an hour per lead. */
export const POST = withHandler(async (request, { requestId }) => {
  if (!verifyOrigin(request))
    return fail(forbidden("Request the code from the website."), requestId);
  const body = await parseJson(request, resendBodySchema);
  if (!body.ok) return fail(body.error, requestId);
  return toResponse(await resendCode(body.data.leadId), requestId);
});
