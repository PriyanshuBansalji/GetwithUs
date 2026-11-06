import type { emailVerifications, leadEvents, leads } from "@/server/db/schema";
import type { ActiveVerification, Lead, LeadEvent } from "@/features/leads/types";

/** Database row to domain lead. Keeps Drizzle row types inside the repository layer. */
export function toLead(row: typeof leads.$inferSelect): Lead {
  return {
    id: row.id,
    source: row.source,
    status: row.status,
    name: row.name,
    email: row.email,
    emailVerifiedAt: row.emailVerifiedAt,
    company: row.company,
    phone: row.phone,
    services: row.services,
    message: row.message,
    budgetRange: row.budgetRange,
    timeline: row.timeline,
    existingUrl: row.existingUrl,
    referral: row.referral,
    meta: row.meta,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Database row to domain event. */
export function toLeadEvent(row: typeof leadEvents.$inferSelect): LeadEvent {
  return {
    id: row.id,
    leadId: row.leadId,
    type: row.type,
    actor: row.actor,
    data: row.data,
    createdAt: row.createdAt,
  };
}

/** Database row to the verification fields the service needs. */
export function toActiveVerification(
  row: typeof emailVerifications.$inferSelect,
): ActiveVerification {
  return {
    id: row.id,
    leadId: row.leadId,
    codeHash: row.codeHash,
    expiresAt: row.expiresAt,
    attempts: row.attempts,
    maxAttempts: row.maxAttempts,
    createdAt: row.createdAt,
  };
}
