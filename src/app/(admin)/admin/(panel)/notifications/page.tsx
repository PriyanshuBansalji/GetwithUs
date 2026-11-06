import type { Metadata } from "next";
import NotificationActions from "@/components/admin/NotificationActions";
import NotificationFeed from "@/components/admin/NotificationFeed";
import { notificationFeed, unreadCount } from "@/features/notifications/service";
import { requireAdmin } from "@/features/admin/auth";

export const instant = false;

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage({
  searchParams,
}: PageProps<"/admin/notifications">) {
  await requireAdmin("/admin/notifications");
  const unreadOnly = (await searchParams).unread === "1";
  const [feed, unread] = await Promise.all([notificationFeed(unreadOnly), unreadCount()]);
  if (!feed.ok) throw feed.error;
  if (!unread.ok) throw unread.error;

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="type-h2">Notifications</h1>
        <div className="flex flex-wrap items-center gap-6">
          <NotificationActions kind="filter" unreadOnly={unreadOnly} />
          <NotificationActions kind="all" hasUnread={unread.data > 0} />
        </div>
      </div>
      <NotificationFeed notifications={feed.data} now={new Date()} />
    </div>
  );
}
