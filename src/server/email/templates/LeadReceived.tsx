import { Button, Heading, Text } from "@react-email/components";
import DetailList, { type Detail } from "@/server/email/components/DetailList";
import EmailLayout from "@/server/email/components/EmailLayout";
import { emailColors } from "@/server/email/components/theme";

type LeadReceivedProps = {
  /** "contact message" or "project brief". */
  kind: string;
  name: string;
  details: readonly Detail[];
  adminUrl: string;
};

/** Sent to the team for every verified lead: every field, in full, and a link to the admin page. */
export default function LeadReceived({ kind, name, details, adminUrl }: LeadReceivedProps) {
  return (
    <EmailLayout preview={`New ${kind} from ${name}`}>
      <Heading
        as="h1"
        style={{ fontSize: 22, lineHeight: "28px", fontWeight: 600, margin: "0 0 20px" }}
      >
        New {kind} from {name}
      </Heading>
      <DetailList details={details} />
      <Button
        href={adminUrl}
        style={{
          display: "inline-block",
          marginTop: 24,
          padding: "12px 18px",
          borderRadius: 999,
          backgroundColor: emailColors.accent,
          color: emailColors.accentInk,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Open in admin
      </Button>
      <Text
        style={{ fontSize: 13, lineHeight: "20px", color: emailColors.muted, margin: "16px 0 0" }}
      >
        The email address on this lead was confirmed with a one-time code.
      </Text>
    </EmailLayout>
  );
}

LeadReceived.PreviewProps = {
  kind: "project brief",
  name: "Test Lead",
  adminUrl: "http://localhost:3000/admin/leads/00000000-0000-0000-0000-000000000000",
  details: [
    { label: "Email", value: "test.lead@example.com" },
    { label: "Services", value: "App development" },
    { label: "Description", value: "A booking app for a chain of clinics." },
  ],
} satisfies LeadReceivedProps;
