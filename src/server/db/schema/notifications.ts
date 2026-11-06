import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import type { DeliveryChannel, NotificationKind } from "@/features/notifications/types";
import { createdAt, id, timestamptz } from "@/server/db/schema/columns";
import { leads } from "@/server/db/schema/leads";

/** In-app notifications for the team, shown in the admin feed and header badge. */
export const notifications = pgTable(
  "notifications",
  {
    id: id(),
    kind: text("kind").$type<NotificationKind>().notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    /** Admin path the notification links to. */
    href: text("href").notNull(),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    readAt: timestamptz("read_at"),
    createdAt: createdAt(),
  },
  (table) => [index("notifications_read_created_idx").on(table.readAt, table.createdAt.desc())],
);

/** One row per channel a notification fanned out to, so admins can see what was delivered where. */
export const notificationDeliveries = pgTable(
  "notification_deliveries",
  {
    id: id(),
    notificationId: uuid("notification_id")
      .notNull()
      .references(() => notifications.id, { onDelete: "cascade" }),
    channel: text("channel").$type<DeliveryChannel>().notNull(),
    status: text("status").$type<"sent" | "failed">().notNull(),
    error: text("error"),
    createdAt: createdAt(),
  },
  (table) => [index("notification_deliveries_notification_idx").on(table.notificationId)],
);
