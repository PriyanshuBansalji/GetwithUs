import type { Lead } from "@/features/leads/types";
import type { LeadDetail } from "@/features/leads/summary";
import type { Result } from "@/lib/result";

export type NotificationKind = "lead_verified" | "lead_status_changed" | "system";
export type DeliveryChannel = "email" | "slack" | "whatsapp";

/** An in-app notification as the admin feed shows it. */
export type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href: string;
  leadId: string | null;
  readAt: Date | null;
  createdAt: Date;
};

export type NewNotification = Pick<Notification, "kind" | "title" | "body" | "href" | "leadId">;

/** Where a notification was delivered, shown on the lead's timeline. */
export type NotificationDelivery = {
  id: string;
  notificationId: string;
  channel: DeliveryChannel;
  status: "sent" | "failed";
  error: string | null;
  createdAt: Date;
};

/** What every channel receives for one notification. */
export type NotificationPayload = {
  kind: NotificationKind;
  title: string;
  body: string;
  /** Absolute URL of the lead in the admin area. */
  adminUrl: string;
  lead: Lead;
  details: LeadDetail[];
};

/** An external channel. `send` never throws; failures come back as a Result. */
export type Channel = {
  name: DeliveryChannel;
  send: (payload: NotificationPayload) => Promise<Result<null>>;
};
