import { countUnread, listNotifications, markRead } from "@/features/notifications/repository";
import type { Notification } from "@/features/notifications/types";
import type { Result } from "@/lib/result";

/** The admin notification feed, newest first. */
export function notificationFeed(unreadOnly: boolean): Promise<Result<Notification[]>> {
  return listNotifications({ unreadOnly, limit: 100 });
}

/** The number on the header badge. */
export function unreadCount(): Promise<Result<number>> {
  return countUnread();
}

/** Marks one notification as read. */
export function markNotificationRead(id: string, now = new Date()): Promise<Result<null>> {
  return markRead(now, id);
}

/** Marks every unread notification as read. */
export function markAllNotificationsRead(now = new Date()): Promise<Result<null>> {
  return markRead(now);
}
