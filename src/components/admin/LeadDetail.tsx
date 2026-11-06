import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import MarkSpamButton from "@/components/admin/MarkSpamButton";
import NotesList from "@/components/admin/NotesList";
import StatusSelect from "@/components/admin/StatusSelect";
import Timestamp from "@/components/admin/Timestamp";
import Badge from "@/components/ui/Badge";
import Icon from "@/components/ui/Icon";
import Table from "@/components/ui/Table";
import Tabs from "@/components/ui/Tabs";
import { statusLabels, statusTones } from "@/features/leads/status";
import { leadDetails } from "@/features/leads/summary";
import type { Lead, LeadEvent, LeadStatus } from "@/features/leads/types";
import type { NotificationDelivery } from "@/features/notifications/types";
import { formatDateTime } from "@/lib/dates";

type LeadDetailProps = {
  lead: Lead;
  events: readonly LeadEvent[];
  deliveries: readonly NotificationDelivery[];
  now: Date;
};

const channelLabels: Record<string, string> = {
  email: "email",
  slack: "Slack",
  whatsapp: "WhatsApp",
};

function describe(event: LeadEvent): string {
  const data = event.data;
  const label = (status: unknown) => statusLabels[status as LeadStatus] ?? String(status);
  switch (event.type) {
    case "created":
      return `Lead created from the ${data.source === "brief" ? "project brief" : data.source === "api" ? "integration" : "contact form"}`;
    case "verification_sent":
      return data.resend ? "New verification code sent" : "Verification code sent";
    case "verified":
      return data.by === "integration"
        ? "Confirmed by the integration"
        : "Email confirmed with the code";
    case "status_changed":
      return `Status changed from ${label(data.from)} to ${label(data.to)} by ${event.actor}`;
    case "note_added":
      return `Note added by ${event.actor}`;
    case "notification_sent":
      return `Team notified by ${channelLabels[String(data.channel)] ?? data.channel}`;
    case "notification_failed":
      return `Notification by ${channelLabels[String(data.channel)] ?? data.channel} failed`;
  }
}

/** Everything about one lead: fields, the full message, status, notes, and the timeline. */
export default function LeadDetail({ lead, events, deliveries, now }: LeadDetailProps) {
  const details = leadDetails(lead, "team").filter(
    (detail) => !["Message", "Project description"].includes(detail.label),
  );
  const notes = events
    .filter((event) => event.type === "note_added")
    .map((event) => ({
      id: event.id,
      body: String(event.data.body ?? ""),
      actor: event.actor,
      createdAt: event.createdAt.toISOString(),
      createdLabel: formatDateTime(event.createdAt),
    }));

  const detailsTab = (
    <div className="grid gap-8">
      <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-[200px_minmax(0,1fr)]">
        {details.map((detail) => (
          <div key={detail.label} className="contents">
            <dt className="type-small text-body">{detail.label}</dt>
            <dd className="break-words text-ink">{detail.value}</dd>
          </div>
        ))}
        <dt className="type-small text-body">Lead ID</dt>
        <dd className="font-mono type-small text-ink">{lead.id}</dd>
      </dl>
      {lead.message ? (
        <section aria-labelledby="message-title">
          <h2 id="message-title" className="type-h4">
            {lead.source === "brief" ? "Project description" : "Message"}
          </h2>
          <p className="mt-3 max-w-[68ch] whitespace-pre-wrap text-ink">{lead.message}</p>
        </section>
      ) : null}
    </div>
  );

  const timelineTab = (
    <div className="grid gap-8">
      <ol className="grid gap-4">
        {events.map((event) => (
          <li key={event.id} className="grid gap-1 border-l-2 border-line pl-4">
            <p className="text-ink">{describe(event)}</p>
            {event.type === "notification_failed" && event.data.error ? (
              <p className="font-mono type-small text-err">{String(event.data.error)}</p>
            ) : null}
            <p className="type-small text-body">
              <Timestamp value={event.createdAt} now={now} />
            </p>
          </li>
        ))}
      </ol>
      {deliveries.length ? (
        <section aria-labelledby="deliveries-title" className="grid gap-3">
          <h2 id="deliveries-title" className="type-h4">
            Deliveries
          </h2>
          <Table
            caption="Notification deliveries for this lead"
            rows={deliveries}
            rowKey={(delivery) => delivery.id}
            columns={[
              {
                key: "channel",
                header: "Channel",
                cell: (delivery) => channelLabels[delivery.channel],
              },
              {
                key: "status",
                header: "Status",
                cell: (delivery) => (
                  <Badge tone={delivery.status === "sent" ? "ok" : "err"}>
                    {delivery.status === "sent" ? "Sent" : "Failed"}
                  </Badge>
                ),
              },
              {
                key: "when",
                header: "When",
                cell: (delivery) => <Timestamp value={delivery.createdAt} now={now} />,
              },
              {
                key: "error",
                header: "Error",
                cell: (delivery) => <span className="font-mono">{delivery.error ?? ""}</span>,
              },
            ]}
          />
        </section>
      ) : null}
    </div>
  );

  return (
    <div className="grid gap-8">
      <div>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 type-small text-body transition-colors duration-150 ease-out hover:text-ink"
        >
          <Icon icon={ArrowLeft} size={16} />
          All leads
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="type-h2">{lead.name}</h1>
          <Badge tone={statusTones[lead.status]}>{statusLabels[lead.status]}</Badge>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 type-small text-body">
          <a
            href={`mailto:${lead.email}`}
            className="inline-flex items-center gap-1.5 text-accent hover:text-accent"
          >
            <Icon icon={Mail} size={16} />
            Reply by email
          </a>
          <span>
            Received <Timestamp value={lead.createdAt} now={now} />
          </span>
        </p>
      </div>
      <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Tabs
          label="Lead sections"
          tabs={[
            { value: "details", label: "Details", content: detailsTab },
            { value: "timeline", label: `Timeline (${events.length})`, content: timelineTab },
          ]}
        />
        <aside
          aria-label="Lead status and notes"
          className="grid gap-8 rounded-card border border-line bg-card p-5"
        >
          <div className="grid gap-3">
            <StatusSelect leadId={lead.id} status={lead.status} />
            {lead.status !== "spam" ? (
              <div>
                <MarkSpamButton leadId={lead.id} />
              </div>
            ) : null}
          </div>
          <NotesList leadId={lead.id} notes={notes} />
        </aside>
      </div>
    </div>
  );
}
