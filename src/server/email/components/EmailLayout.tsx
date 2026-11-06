import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { known, site } from "@/config/site";
import { emailColors, emailFont } from "@/server/email/components/theme";

/** Shared frame for every email: preview text, a plain wordmark, the body, and a short footer. */
export default function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: ReactNode;
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: "#FFFFFF",
          color: emailColors.ink,
          fontFamily: emailFont,
          margin: 0,
        }}
      >
        <Container style={{ maxWidth: 560, padding: "32px 24px" }}>
          <Text
            style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 24px" }}
          >
            {site.wordmark}
          </Text>
          <Section>{children}</Section>
          <Hr style={{ borderColor: emailColors.line, margin: "32px 0 16px" }} />
          <Text style={{ fontSize: 13, lineHeight: "20px", color: emailColors.muted, margin: 0 }}>
            {[known(site.legalEntity) ?? site.name, known(site.contact.email)]
              .filter(Boolean)
              .join(", ")}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
