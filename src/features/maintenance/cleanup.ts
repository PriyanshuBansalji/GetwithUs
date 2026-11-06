import { deleteUnverifiedLeadsBefore } from "@/features/leads/repository";
import { deleteSpentVerificationsBefore } from "@/features/verification/repository";
import { ok, type Result } from "@/lib/result";
import { deleteRateLimitsBefore } from "@/server/rate-limit-store";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The daily cleanup: unverified leads older than 7 days, consumed or expired
 * verification codes older than 1 day, and rate-limit rows older than 24 hours.
 */
export async function runCleanup(
  now = new Date(),
): Promise<Result<{ leads: number; verifications: number; rateLimits: number }>> {
  const leads = await deleteUnverifiedLeadsBefore(new Date(now.getTime() - 7 * DAY_MS));
  if (!leads.ok) return leads;
  const verifications = await deleteSpentVerificationsBefore(new Date(now.getTime() - DAY_MS));
  if (!verifications.ok) return verifications;
  const rateLimits = await deleteRateLimitsBefore(new Date(now.getTime() - DAY_MS));
  if (!rateLimits.ok) return rateLimits;
  return ok({ leads: leads.data, verifications: verifications.data, rateLimits: rateLimits.data });
}
