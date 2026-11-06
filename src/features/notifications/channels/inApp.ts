import { insertNotification } from "@/features/notifications/repository";
import type { NewNotification, Notification } from "@/features/notifications/types";
import type { Result } from "@/lib/result";

/**
 * The always-on channel: a row in `notifications`, shown in the admin feed and
 * counted in the header badge. Created first, so every other channel's delivery
 * can be recorded against it.
 */
export function createInAppNotification(
  notification: NewNotification,
): Promise<Result<Notification>> {
  return insertNotification(notification);
}
