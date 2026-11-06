import { lt, sql } from "drizzle-orm";
import { dbError } from "@/lib/errors";
import { err, ok, type Result } from "@/lib/result";
import { db } from "@/server/db/client";
import { rateLimits } from "@/server/db/schema";
import type { RateLimitStore } from "@/server/rate-limit";

/** Rate-limit counters in Postgres: one upsert per hit, resetting the window when it has passed. */
export const dbRateLimitStore: RateLimitStore = {
  async increment(key, windowSeconds, now) {
    // ISO strings with an explicit cast: Date objects inside a raw sql template are not serialized for Postgres.
    const cutoff = sql`${new Date(now.getTime() - windowSeconds * 1000).toISOString()}::timestamptz`;
    const start = sql`${now.toISOString()}::timestamptz`;
    try {
      const [row] = await db
        .insert(rateLimits)
        .values({ key, windowStart: now, count: 1 })
        .onConflictDoUpdate({
          target: rateLimits.key,
          set: {
            count: sql`case when ${rateLimits.windowStart} <= ${cutoff} then 1 else ${rateLimits.count} + 1 end`,
            windowStart: sql`case when ${rateLimits.windowStart} <= ${cutoff} then ${start} else ${rateLimits.windowStart} end`,
          },
        })
        .returning({ count: rateLimits.count, windowStart: rateLimits.windowStart });
      return ok(row);
    } catch (error) {
      return err(dbError(error));
    }
  },
};

/** Deletes counters whose window started before `before`. Used by the daily cleanup. */
export async function deleteRateLimitsBefore(before: Date): Promise<Result<number>> {
  try {
    const deleted = await db
      .delete(rateLimits)
      .where(lt(rateLimits.windowStart, before))
      .returning({ key: rateLimits.key });
    return ok(deleted.length);
  } catch (error) {
    return err(dbError(error));
  }
}
