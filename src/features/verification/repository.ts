import { and, desc, eq, isNotNull, isNull, lt, or } from "drizzle-orm";
import { toActiveVerification } from "@/features/leads/mappers";
import type { ActiveVerification } from "@/features/leads/types";
import { dbError } from "@/lib/errors";
import { err, ok, type Result } from "@/lib/result";
import { db } from "@/server/db/client";
import { emailVerifications } from "@/server/db/schema";

/** The newest unconsumed code for a lead, or null when every code is used up. */
export async function findActiveVerification(
  leadId: string,
): Promise<Result<ActiveVerification | null>> {
  try {
    const [row] = await db
      .select()
      .from(emailVerifications)
      .where(and(eq(emailVerifications.leadId, leadId), isNull(emailVerifications.consumedAt)))
      .orderBy(desc(emailVerifications.createdAt))
      .limit(1);
    return ok(row ? toActiveVerification(row) : null);
  } catch (error) {
    return err(dbError(error));
  }
}

/** The time the most recent code for a lead was created, consumed or not. */
export async function latestCodeSentAt(leadId: string): Promise<Result<Date | null>> {
  try {
    const [row] = await db
      .select({ createdAt: emailVerifications.createdAt })
      .from(emailVerifications)
      .where(eq(emailVerifications.leadId, leadId))
      .orderBy(desc(emailVerifications.createdAt))
      .limit(1);
    return ok(row?.createdAt ?? null);
  } catch (error) {
    return err(dbError(error));
  }
}

/** Stores a wrong attempt; when `lock` is true the code is consumed and cannot be used again. */
export async function recordFailedAttempt(
  id: string,
  attempts: number,
  lock: boolean,
  now: Date,
): Promise<Result<null>> {
  try {
    await db
      .update(emailVerifications)
      .set({ attempts, ...(lock ? { consumedAt: now } : {}) })
      .where(eq(emailVerifications.id, id));
    return ok(null);
  } catch (error) {
    return err(dbError(error));
  }
}

/** Consumes a code without verifying (expired or locked), so the next attempt asks for a new one. */
export async function consumeVerification(id: string, now: Date): Promise<Result<null>> {
  try {
    await db
      .update(emailVerifications)
      .set({ consumedAt: now })
      .where(eq(emailVerifications.id, id));
    return ok(null);
  } catch (error) {
    return err(dbError(error));
  }
}

/** Issues a new code: every earlier code for the lead is consumed first, in one transaction. */
export async function replaceVerification(
  leadId: string,
  codeHash: string,
  expiresAt: Date,
  now: Date,
): Promise<Result<null>> {
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(emailVerifications)
        .set({ consumedAt: now })
        .where(and(eq(emailVerifications.leadId, leadId), isNull(emailVerifications.consumedAt)));
      await tx.insert(emailVerifications).values({ leadId, codeHash, expiresAt });
    });
    return ok(null);
  } catch (error) {
    return err(dbError(error));
  }
}

/** Deletes codes consumed or expired before `cutoff`. Returns the count. */
export async function deleteSpentVerificationsBefore(cutoff: Date): Promise<Result<number>> {
  try {
    const deleted = await db
      .delete(emailVerifications)
      .where(
        or(
          and(isNotNull(emailVerifications.consumedAt), lt(emailVerifications.consumedAt, cutoff)),
          lt(emailVerifications.expiresAt, cutoff),
        ),
      )
      .returning({ id: emailVerifications.id });
    return ok(deleted.length);
  } catch (error) {
    return err(dbError(error));
  }
}
