import { and, count, desc, eq, ilike, lt, ne, or, type SQL } from "drizzle-orm";
import { toLead, toLeadEvent } from "@/features/leads/mappers";
import type {
  Lead,
  LeadEvent,
  LeadEventType,
  LeadSource,
  LeadStatus,
  NewLead,
} from "@/features/leads/types";
import { dbError } from "@/lib/errors";
import { err, ok, type Result } from "@/lib/result";
import { db } from "@/server/db/client";
import { emailVerifications, leadEvents, leads } from "@/server/db/schema";

function leadValues(lead: NewLead) {
  return {
    source: lead.source,
    name: lead.name,
    email: lead.email,
    company: lead.company ?? null,
    phone: lead.phone ?? null,
    services: lead.services ?? [],
    message: lead.message ?? null,
    budgetRange: lead.budgetRange ?? null,
    timeline: lead.timeline ?? null,
    existingUrl: lead.existingUrl ?? null,
    referral: lead.referral ?? null,
    meta: lead.meta ?? {},
  };
}

/**
 * Inserts a lead awaiting verification, its first verification code, and the
 * `created` event, in one transaction.
 */
export async function createLeadWithVerification(
  lead: NewLead,
  verification: { codeHash: string; expiresAt: Date },
): Promise<Result<Lead>> {
  try {
    const created = await db.transaction(async (tx) => {
      const [row] = await tx.insert(leads).values(leadValues(lead)).returning();
      await tx.insert(emailVerifications).values({ leadId: row.id, ...verification });
      await tx.insert(leadEvents).values({
        leadId: row.id,
        type: "created",
        actor: "client",
        data: { source: lead.source },
      });
      return row;
    });
    return ok(toLead(created));
  } catch (error) {
    return err(dbError(error));
  }
}

/** Inserts a lead that a trusted system already verified, with `created` and `verified` events. */
export async function createVerifiedLead(lead: NewLead, verifiedAt: Date): Promise<Result<Lead>> {
  try {
    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(leads)
        .values({ ...leadValues(lead), status: "new", emailVerifiedAt: verifiedAt })
        .returning();
      await tx.insert(leadEvents).values([
        {
          leadId: row.id,
          type: "created",
          actor: "system",
          data: { source: lead.source, integration: lead.meta?.integration },
        },
        { leadId: row.id, type: "verified", actor: "system", data: { by: "integration" } },
      ]);
      return row;
    });
    return ok(toLead(created));
  } catch (error) {
    return err(dbError(error));
  }
}

/** A lead by ID, or null. */
export async function findLeadById(id: string): Promise<Result<Lead | null>> {
  try {
    const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
    return ok(row ? toLead(row) : null);
  } catch (error) {
    return err(dbError(error));
  }
}

/**
 * Consumes the code, marks the email verified, moves the lead to `new`, and writes
 * the `verified` event, in one transaction.
 */
export async function completeVerification(
  leadId: string,
  verificationId: string,
  now: Date,
): Promise<Result<Lead>> {
  try {
    const updated = await db.transaction(async (tx) => {
      await tx
        .update(emailVerifications)
        .set({ consumedAt: now })
        .where(eq(emailVerifications.id, verificationId));
      const [row] = await tx
        .update(leads)
        .set({ status: "new", emailVerifiedAt: now })
        .where(and(eq(leads.id, leadId), eq(leads.status, "pending_verification")))
        .returning();
      await tx.insert(leadEvents).values({ leadId, type: "verified", actor: "client", data: {} });
      return row;
    });
    return ok(toLead(updated));
  } catch (error) {
    return err(dbError(error));
  }
}

/** Appends an event to a lead's timeline. */
export async function recordLeadEvent(
  leadId: string,
  type: LeadEventType,
  actor: string,
  data: Record<string, unknown> = {},
): Promise<Result<null>> {
  try {
    await db.insert(leadEvents).values({ leadId, type, actor, data });
    return ok(null);
  } catch (error) {
    return err(dbError(error));
  }
}

/** Deletes leads still awaiting verification that were created before `cutoff`. Returns the count. */
export async function deleteUnverifiedLeadsBefore(cutoff: Date): Promise<Result<number>> {
  try {
    const deleted = await db
      .delete(leads)
      .where(and(eq(leads.status, "pending_verification"), lt(leads.createdAt, cutoff)))
      .returning({ id: leads.id });
    return ok(deleted.length);
  } catch (error) {
    return err(dbError(error));
  }
}

export type LeadQuery = {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  offset: number;
  limit: number;
};

/** Escapes LIKE wildcards so a search for "50%" means the characters, not a pattern. */
function likePattern(term: string): string {
  return `%${term.replace(/[\\%_]/g, (character) => `\\${character}`)}%`;
}

/**
 * One page of leads, newest first, with the total for pagination. Without a
 * status filter, leads still awaiting verification are left out: they are
 * unconfirmed and are deleted after 7 days.
 */
export async function listLeads(
  query: LeadQuery,
): Promise<Result<{ leads: Lead[]; total: number }>> {
  const conditions: SQL[] = [
    query.status ? eq(leads.status, query.status) : ne(leads.status, "pending_verification"),
  ];
  if (query.source) conditions.push(eq(leads.source, query.source));
  if (query.search) {
    const pattern = likePattern(query.search);
    const match = or(
      ilike(leads.name, pattern),
      ilike(leads.email, pattern),
      ilike(leads.company, pattern),
    );
    if (match) conditions.push(match);
  }
  const where = and(...conditions);
  try {
    const [rows, [totals]] = await Promise.all([
      db
        .select()
        .from(leads)
        .where(where)
        .orderBy(desc(leads.createdAt))
        .limit(query.limit)
        .offset(query.offset),
      db.select({ value: count() }).from(leads).where(where),
    ]);
    return ok({ leads: rows.map(toLead), total: totals?.value ?? 0 });
  } catch (error) {
    return err(dbError(error));
  }
}

/** How many leads are in each status. Statuses with no leads are absent. */
export async function countLeadsByStatus(): Promise<Result<Partial<Record<LeadStatus, number>>>> {
  try {
    const rows = await db
      .select({ status: leads.status, value: count() })
      .from(leads)
      .groupBy(leads.status);
    return ok(Object.fromEntries(rows.map((row) => [row.status, row.value])));
  } catch (error) {
    return err(dbError(error));
  }
}

/** The timeline events of one lead, newest first. */
export async function listLeadEvents(leadId: string): Promise<Result<LeadEvent[]>> {
  try {
    const rows = await db
      .select()
      .from(leadEvents)
      .where(eq(leadEvents.leadId, leadId))
      .orderBy(desc(leadEvents.createdAt));
    return ok(rows.map(toLeadEvent));
  } catch (error) {
    return err(dbError(error));
  }
}

/**
 * Moves a lead to a new status and writes the `status_changed` event, in one
 * transaction. Returns the updated lead and the status it had before, or null
 * when the lead does not exist. A change to the current status is a no-op.
 */
export async function updateLeadStatus(
  leadId: string,
  to: LeadStatus,
  actor: string,
): Promise<Result<{ lead: Lead; from: LeadStatus } | null>> {
  try {
    const updated = await db.transaction(async (tx) => {
      const [current] = await tx.select().from(leads).where(eq(leads.id, leadId)).for("update");
      if (!current) return null;
      // Choosing the status the lead already has changes nothing and records nothing.
      if (current.status === to) return { lead: toLead(current), from: current.status };
      const [row] = await tx
        .update(leads)
        .set({ status: to })
        .where(eq(leads.id, leadId))
        .returning();
      await tx
        .insert(leadEvents)
        .values({ leadId, type: "status_changed", actor, data: { from: current.status, to } });
      return { lead: toLead(row), from: current.status };
    });
    return ok(updated);
  } catch (error) {
    return err(dbError(error));
  }
}
