import { Button, Heading, Text } from "@react-email/components";
import { site } from "@/config/site";
import EmailLayout from "@/server/email/components/EmailLayout";
import { emailColors } from "@/server/email/components/theme";

type MagicLinkProps = { url: string };

/** The one-time sign-in link for the admin area. */
export default function MagicLink({ url }: MagicLinkProps) {
  return (
    <EmailLayout preview={`Sign in to the ${site.name} admin`}>
      <Heading
        as="h1"
        style={{ fontSize: 22, lineHeight: "28px", fontWeight: 600, margin: "0 0 12px" }}
      >
        Sign in to the {site.name} admin
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: "24px", margin: "0 0 20px" }}>
        Use the button below to sign in. The link works once and expires in 15 minutes.
      </Text>
      <Button
        href={url}
        style={{
          display: "inline-block",
          padding: "12px 18px",
          borderRadius: 999,
          backgroundColor: emailColors.accent,
          color: emailColors.accentInk,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Sign in
      </Button>
      <Text
        style={{ fontSize: 14, lineHeight: "22px", color: emailColors.muted, margin: "20px 0 0" }}
      >
        If you did not ask to sign in, ignore this email.
      </Text>
    </EmailLayout>
  );
}

MagicLink.PreviewProps = {
  url: "http://localhost:3000/api/auth/callback/resend?token=example",
} satisfies MagicLinkProps;
