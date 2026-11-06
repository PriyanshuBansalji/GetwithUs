import { createElement } from "react";
import { leadKind } from "@/features/leads/summary";
import type { Channel } from "@/features/notifications/types";
import { err, ok } from "@/lib/result";
import { sendEmail } from "@/server/email/client";
import { renderEmail } from "@/server/email/render";
import LeadReceived from "@/server/email/templates/LeadReceived";

/** The team email: every lead field and an "Open in admin" button, to each TEAM_NOTIFY_EMAILS address. */
export function emailChannel(recipients: readonly string[]): Channel {
  return {
    name: "email",
    send: async (payload) => {
      const kind = leadKind(payload.lead);
      const { html, text } = await renderEmail(
        createElement(LeadReceived, {
          kind,
          name: payload.lead.name,
          details: payload.details,
          adminUrl: payload.adminUrl,
        }),
      );
      const sent = await sendEmail({
        to: [...recipients],
        subject: `New ${kind} from ${payload.lead.name}`,
        html,
        text,
        replyTo: payload.lead.email,
      });
      return sent.ok ? ok(null) : err(sent.error);
    },
  };
}
