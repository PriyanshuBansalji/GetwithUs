import { after } from "next/server";
import { env } from "@/config/env";
import { integrationLeadSchema } from "@/features/leads/schema";
import { createIntegrationLead, handleLeadVerified } from "@/features/leads/service";
import { unauthorized } from "@/lib/errors";
import { fail, ok, parseJson, toResponse, withHandler } from "@/lib/http";
import { rateLimit } from "@/server/rate-limit";
import { hashKey, secretsMatch } from "@/server/request";

/**
 * POST /api/v1/integrations/leads: an already-verified lead from the agency's own
 * systems (for example its WhatsApp bot). Authenticated with `x-api-key`.
 */
export const POST = withHandler(async (request, { requestId }) => {
  const apiKey = request.headers.get("x-api-key");
  if (!secretsMatch(apiKey, env.LEADS_API_KEY)) {
    return fail(unauthorized("Send a valid x-api-key header."), requestId);
  }

  const limited = await rateLimit({
    key: `integration:key:${hashKey(apiKey ?? "")}`,
    limit: 60,
    windowSeconds: 60,
  });
  if (!limited.ok) return fail(limited.error, requestId);

  const body = await parseJson(request, integrationLeadSchema);
  if (!body.ok) return fail(body.error, requestId);

  const created = await createIntegrationLead(body.data);
  if (!created.ok) return toResponse(created, requestId);

  const lead = created.data;
  after(() => handleLeadVerified(lead, requestId));
  return ok({ leadId: lead.id }, { status: 201 });
});
