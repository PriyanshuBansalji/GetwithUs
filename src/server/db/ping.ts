import { sql } from "drizzle-orm";
import { logger } from "@/lib/logger";
import { db } from "@/server/db/client";

/** True when the database answers `select 1`. Used by the health endpoint. */
export async function pingDatabase(): Promise<boolean> {
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch (error) {
    logger.error("Database health check failed", { error });
    return false;
  }
}
