import { count, desc, eq, isNull } from "drizzle-orm";
import { recordLeadEvent } from "@/features/leads/repository";
import type {
  DeliveryChannel,
  NewNotification,
  Notification,
  NotificationDelivery,
} from "@/features/notifications/types";
import { dbError } from "@/lib/errors";
import { err, ok, type Result } from "@/lib/result";
import { db } from "@/server/db/client";
import { notificationDeliveries, notifications } from "@/server/db/schema";

function toNotification(row: typeof notifications.$inferSelect): Notification {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    body: row.body,
    href: row.href,
    leadId: row.leadId,
    readAt: row.readAt,
    createdAt: row.createdAt,
  };
}

/** Inserts an in-app notification. */
export async function insertNotification(
  notification: NewNotification,
): Promise<Result<Notification>> {
  try {
    const [row] = await db.insert(notifications).values(notification).returning();
    return ok(toNotification(row));
  } catch (error) {
    return err(dbError(error));
  }
}

/**
 * Records one channel's delivery and the matching lead event
 * (`notification_sent` or `notification_failed`).
 */
export async function recordDelivery(delivery: {
  notificationId: string;
  leadId: string | null;
  channel: DeliveryChannel;
  status: "sent" | "failed";
  error?: string;
}): Promise<Result<null>> {
  try {
    await db.insert(notificationDeliveries).values({
      notificationId: delivery.notificationId,
      channel: delivery.channel,
      status: delivery.status,
      error: delivery.error ?? null,
    });
  } catch (error) {
    return err(dbError(error));
  }
  if (!delivery.leadId) return ok(null);
  return recordLeadEvent(
    delivery.leadId,
    delivery.status === "sent" ? "notification_sent" : "notification_failed",
    "system",
    { channel: delivery.channel, ...(delivery.error ? { error: delivery.error } : {}) },
  );
}

/** The newest notifications, optionally unread only. */
export async function listNotifications(options: {
  unreadOnly?: boolean;
  limit?: number;
}): Promise<Result<Notification[]>> {
  try {
    const rows = await db
      .select()
      .from(notifications)
      .where(options.unreadOnly ? isNull(notifications.readAt) : undefined)
      .orderBy(desc(notifications.createdAt))
      .limit(options.limit ?? 100);
    return ok(rows.map(toNotification));
  } catch (error) {
    return err(dbError(error));
  }
}

/** How many notifications are unread, for the header badge. */
export async function countUnread(): Promise<Result<number>> {
  try {
    const [row] = await db
      .select({ value: count() })
      .from(notifications)
      .where(isNull(notifications.readAt));
    return ok(row?.value ?? 0);
  } catch (error) {
    return err(dbError(error));
  }
}

/** Marks one notification, or all of them when `id` is omitted, as read. */
export async function markRead(now: Date, id?: string): Promise<Result<null>> {
  try {
    await db
      .update(notifications)
      .set({ readAt: now })
      .where(id ? eq(notifications.id, id) : isNull(notifications.readAt));
    return ok(null);
  } catch (error) {
    return err(dbError(error));
  }
}

/** Every delivery for a lead's notifications, for its timeline. */
export async function listDeliveriesForLead(
  leadId: string,
): Promise<Result<NotificationDelivery[]>> {
  try {
    const rows = await db
      .select({ delivery: notificationDeliveries })
      .from(notificationDeliveries)
      .innerJoin(notifications, eq(notificationDeliveries.notificationId, notifications.id))
      .where(eq(notifications.leadId, leadId))
      .orderBy(desc(notificationDeliveries.createdAt));
    return ok(
      rows.map(({ delivery }) => ({
        id: delivery.id,
        notificationId: delivery.notificationId,
        channel: delivery.channel,
        status: delivery.status,
        error: delivery.error,
        createdAt: delivery.createdAt,
      })),
    );
  } catch (error) {
    return err(dbError(error));
  }
}
