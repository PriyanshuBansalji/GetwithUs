import { sql } from "drizzle-orm";
import { check, index, jsonb, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import {
  LEAD_STATUSES,
  type LeadEventType,
  type LeadMeta,
  type LeadSource,
} from "@/features/leads/types";
import { createdAt, id, timestamptz } from "@/server/db/schema/columns";

export const leadStatus = pgEnum("lead_status", LEAD_STATUSES);

export const leads = pgTable(
  "leads",
  {
    id: id(),
    source: text("source").$type<LeadSource>().notNull(),
    status: leadStatus("status").notNull().default("pending_verification"),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerifiedAt: timestamptz("email_verified_at"),
    company: text("company"),
    phone: text("phone"),
    services: jsonb("services").$type<string[]>().notNull().default([]),
    message: text("message"),
    budgetRange: text("budget_range"),
    timeline: text("timeline"),
    existingUrl: text("existing_url"),
    referral: text("referral"),
    meta: jsonb("meta").$type<LeadMeta>().notNull().default({}),
    createdAt: createdAt(),
    updatedAt: timestamptz("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("leads_email_idx").on(table.email),
    index("leads_status_idx").on(table.status),
    index("leads_created_at_idx").on(table.createdAt.desc()),
    check("leads_source_check", sql`${table.source} in ('contact', 'brief', 'api')`),
  ],
);

export const leadEvents = pgTable(
  "lead_events",
  {
    id: id(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    type: text("type").$type<LeadEventType>().notNull(),
    /** "client", "system", or the email of the admin who acted. */
    actor: text("actor").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: createdAt(),
  },
  (table) => [index("lead_events_lead_created_idx").on(table.leadId, table.createdAt)],
);
