import { leadSubmissionSchema } from "@/features/leads/schema";
import { submitLead } from "@/features/leads/service";
import { forbidden } from "@/lib/errors";
import { fail, parseJson, toResponse, withHandler } from "@/lib/http";
import { requestContext, verifyOrigin } from "@/server/request";

/**
 * POST /api/v1/leads: a contact message or project brief. Creates the lead
 * awaiting verification and emails a 6-digit code.
 */
export const POST = withHandler(async (request, { requestId }) => {
  if (!verifyOrigin(request)) return fail(forbidden("Send the form from the website."), requestId);
  const body = await parseJson(request, leadSubmissionSchema);
  if (!body.ok) return fail(body.error, requestId);
  const result = await submitLead(body.data, { ...requestContext(request), requestId });
  return toResponse(result, requestId, { status: 201 });
});
