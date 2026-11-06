import { createElement } from "react";
import { env } from "@/config/env";
import { site } from "@/config/site";
import { completeVerification, findLeadById, recordLeadEvent } from "@/features/leads/repository";
import type { Lead } from "@/features/leads/types";
import {
  CODE_TTL_MS,
  RESEND_COOLDOWN_MS,
  RESENDS_PER_HOUR,
  codeMatches,
  evaluateAttempt,
  generateCode,
  hashCode,
} from "@/features/verification/code";
import {
  consumeVerification,
  findActiveVerification,
  latestCodeSentAt,
  recordFailedAttempt,
  replaceVerification,
} from "@/features/verification/repository";
import {
  conflict,
  notFound,
  rateLimited,
  verificationExpired,
  verificationInvalid,
  verificationLocked,
} from "@/lib/errors";
import { err, ok, type Result } from "@/lib/result";
import { sendEmail } from "@/server/email/client";
import { renderEmail } from "@/server/email/render";
import VerificationCode from "@/server/email/templates/VerificationCode";
import { rateLimit } from "@/server/rate-limit";

const leadGone = () => notFound("That request has expired. Send the form again.");

/** A fresh code and its stored hash. The plain code exists only long enough to email it. */
export function newCode(): { code: string; codeHash: string } {
  const code = generateCode();
  return { code, codeHash: hashCode(code, env.VERIFICATION_PEPPER) };
}

/** When the next code may be requested, as an ISO string for the client's countdown. */
export function resendAvailableAt(sentAt: Date): string {
  return new Date(sentAt.getTime() + RESEND_COOLDOWN_MS).toISOString();
}

/** Emails a verification code. Subject carries the code so it shows in notification previews. */
export async function sendCodeEmail(
  to: string,
  code: string,
): Promise<Result<{ id: string | null }>> {
  const { html, text } = await renderEmail(createElement(VerificationCode, { code }));
  return sendEmail({ to, subject: `Your ${site.name} verification code: ${code}`, html, text });
}

/**
 * Checks a code against the lead's newest unconsumed code. A wrong code uses one
 * of five attempts; the fifth wrong attempt locks the code. Success confirms the
 * email and moves the lead to `new`. Repeating a successful verification is
 * harmless and reports `alreadyVerified`.
 */
export async function verifyCode(
  leadId: string,
  code: string,
  now = new Date(),
): Promise<Result<{ lead: Lead; alreadyVerified: boolean }>> {
  const found = await findLeadById(leadId);
  if (!found.ok) return found;
  const lead = found.data;
  if (!lead) return err(leadGone());
  if (lead.emailVerifiedAt) return ok({ lead, alreadyVerified: true });

  const active = await findActiveVerification(leadId);
  if (!active.ok) return active;
  if (!active.data) return err(verificationExpired());
  const verification = active.data;

  const attempt = evaluateAttempt(
    verification,
    codeMatches(code, verification.codeHash, env.VERIFICATION_PEPPER),
    now,
  );
  switch (attempt.outcome) {
    case "verified": {
      const completed = await completeVerification(leadId, verification.id, now);
      return completed.ok ? ok({ lead: completed.data, alreadyVerified: false }) : completed;
    }
    case "expired": {
      const consumed = await consumeVerification(verification.id, now);
      return consumed.ok ? err(verificationExpired()) : consumed;
    }
    case "locked": {
      const recorded = await recordFailedAttempt(
        verification.id,
        verification.maxAttempts,
        true,
        now,
      );
      return recorded.ok ? err(verificationLocked()) : recorded;
    }
    case "invalid": {
      const recorded = await recordFailedAttempt(verification.id, attempt.attempts, false, now);
      return recorded.ok ? err(verificationInvalid(attempt.remaining)) : recorded;
    }
  }
}

/**
 * Sends a new code, invalidating earlier ones. Allowed 60 seconds after the last
 * code, at most three times an hour per lead.
 */
export async function resendCode(
  leadId: string,
  now = new Date(),
): Promise<Result<{ resendAvailableAt: string }>> {
  const found = await findLeadById(leadId);
  if (!found.ok) return found;
  const lead = found.data;
  if (!lead) return err(leadGone());
  if (lead.emailVerifiedAt) return err(conflict("This email is already confirmed."));

  const lastSent = await latestCodeSentAt(leadId);
  if (!lastSent.ok) return lastSent;
  if (lastSent.data) {
    const wait = lastSent.data.getTime() + RESEND_COOLDOWN_MS - now.getTime();
    if (wait > 0) return err(rateLimited(Math.ceil(wait / 1000)));
  }

  const limited = await rateLimit({
    key: `lead_resend:${leadId}`,
    limit: RESENDS_PER_HOUR,
    windowSeconds: 3600,
  });
  if (!limited.ok) return limited;

  const { code, codeHash } = newCode();
  const replaced = await replaceVerification(
    leadId,
    codeHash,
    new Date(now.getTime() + CODE_TTL_MS),
    now,
  );
  if (!replaced.ok) return replaced;

  const sent = await sendCodeEmail(lead.email, code);
  if (!sent.ok) return sent;
  await recordLeadEvent(leadId, "verification_sent", "system", { resend: true });

  return ok({ resendAvailableAt: resendAvailableAt(now) });
}
