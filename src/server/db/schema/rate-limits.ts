import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamptz } from "@/server/db/schema/columns";

/** Fixed-window counters, one row per key (for example `lead_create:ip:<hash>`). Pruned daily. */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  windowStart: timestamptz("window_start").notNull(),
  count: integer("count").notNull(),
});
