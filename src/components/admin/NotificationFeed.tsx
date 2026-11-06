import { Bell } from "lucide-react";
import Link from "next/link";
import NotificationActions from "@/components/admin/NotificationActions";
import Timestamp from "@/components/admin/Timestamp";
import EmptyState from "@/components/ui/EmptyState";
import type { Notification } from "@/features/notifications/types";
import { cn } from "@/lib/cn";

type NotificationFeedProps = {
  notifications: readonly Notification[];
  now: Date;
  compact?: boolean;
};

/** Team notifications, newest first. Unread ones carry a signal rule and a "Mark as read" control. */
export default function NotificationFeed({
  notifications,
  now,
  compact = false,
}: NotificationFeedProps) {
  if (!notifications.length) {
    return (
      <EmptyState icon={Bell} title="No notifications">
        New verified leads and status changes appear here.
      </EmptyState>
    );
  }
  return (
    <ul className="grid gap-3">
      {notifications.map((notification) => (
        <li
          key={notification.id}
          className={cn(
            "grid gap-1 rounded-card border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4",
            notification.readAt ? "border-line" : "border-accent/50",
          )}
        >
          <div className="min-w-0">
            <p className="text-ink">
              <Link href={notification.href} className="font-medium hover:text-accent">
                {notification.title}
              </Link>
              {notification.readAt ? null : (
                <span className="ml-2 type-small text-accent">Unread</span>
              )}
            </p>
            {!compact && notification.body ? (
              <p className="mt-1 line-clamp-2 type-small text-body">{notification.body}</p>
            ) : null}
            <p className="mt-1 type-small text-body">
              <Timestamp value={notification.createdAt} now={now} />
            </p>
          </div>
          {notification.readAt || compact ? null : (
            <NotificationActions kind="item" id={notification.id} />
          )}
        </li>
      ))}
    </ul>
  );
}
