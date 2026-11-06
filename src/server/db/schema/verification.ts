import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id, timestamptz } from "@/server/db/schema/columns";
import { leads } from "@/server/db/schema/leads";

/** One row per code sent. Only the newest unconsumed row for a lead is valid. */
export const emailVerifications = pgTable(
  "email_verifications",
  {
    id: id(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    /** HMAC-SHA256 of the code with VERIFICATION_PEPPER, hex. The code itself is never stored. */
    codeHash: text("code_hash").notNull(),
    expiresAt: timestamptz("expires_at").notNull(),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(5),
    consumedAt: timestamptz("consumed_at"),
    createdAt: createdAt(),
  },
  (table) => [index("email_verifications_lead_idx").on(table.leadId)],
);
