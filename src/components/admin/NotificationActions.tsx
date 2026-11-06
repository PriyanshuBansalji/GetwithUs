"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/features/admin/actions";

type NotificationActionsProps =
  | { kind: "item"; id: string }
  | { kind: "all"; hasUnread: boolean }
  | { kind: "filter"; unreadOnly: boolean };

/**
 * The feed's controls: "Mark as read" on an item, "Mark all as read" for the
 * feed, and the "Unread only" filter, which lives in the URL.
 */
export default function NotificationActions(props: NotificationActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (props.kind === "filter") {
    return (
      <Checkbox
        label="Unread only"
        checked={props.unreadOnly}
        onCheckedChange={(checked) =>
          router.push(checked === true ? "/admin/notifications?unread=1" : "/admin/notifications")
        }
      />
    );
  }

  const run = (action: () => ReturnType<typeof markAllNotificationsReadAction>, done: string) =>
    startTransition(async () => {
      const result = await action();
      if (result.ok) toast.success(done);
      else toast.error(`${result.error.message} Reference ${result.error.requestId}.`);
    });

  if (props.kind === "all") {
    return (
      <Button
        variant="secondary"
        size="sm"
        disabled={!props.hasUnread}
        loading={pending}
        onClick={() => run(markAllNotificationsReadAction, "Marked all as read")}
      >
        Mark all as read
      </Button>
    );
  }

  const { id } = props;
  return (
    <Button
      variant="ghost"
      size="sm"
      loading={pending}
      onClick={() => run(() => markNotificationReadAction(id), "Marked as read")}
    >
      Mark as read
    </Button>
  );
}
