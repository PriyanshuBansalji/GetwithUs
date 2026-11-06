import { Heading, Text } from "@react-email/components";
import { known, site } from "@/config/site";
import { confirmedHeadline } from "@/content/forms";
import DetailList, { type Detail } from "@/server/email/components/DetailList";
import EmailLayout from "@/server/email/components/EmailLayout";
import { emailColors } from "@/server/email/components/theme";

type LeadConfirmedProps = { name: string; details: readonly Detail[] };

/** How to add anything: always a reply; the email address and phone only once they are known. */
function reachUs(): string {
  const email = known(site.contact.email);
  const phone = known(site.contact.phone);
  return [
    email
      ? `To add anything, reply to this email or write to ${email}.`
      : "To add anything, reply to this email.",
    phone ? `Phone or WhatsApp: ${phone}.` : undefined,
  ]
    .filter(Boolean)
    .join(" ");
}

/** Sent to the person who wrote, once their email is confirmed: what they sent and how to reach us. */
export default function LeadConfirmed({ name, details }: LeadConfirmedProps) {
  return (
    <EmailLayout preview={confirmedHeadline}>
      <Heading
        as="h1"
        style={{ fontSize: 22, lineHeight: "28px", fontWeight: 600, margin: "0 0 12px" }}
      >
        {confirmedHeadline}
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: "24px", margin: "0 0 20px" }}>
        Thanks, {name}. This is a copy of what you sent us.
      </Text>
      <DetailList details={details} />
      <Text
        style={{ fontSize: 14, lineHeight: "22px", color: emailColors.muted, margin: "20px 0 0" }}
      >
        {reachUs()}
      </Text>
    </EmailLayout>
  );
}

LeadConfirmed.PreviewProps = {
  name: "Test Lead",
  details: [
    { label: "Services", value: "Web development, WhatsApp bot" },
    {
      label: "Message",
      value: "We need a new marketing site and a WhatsApp bot that books appointments.",
    },
  ],
} satisfies LeadConfirmedProps;
