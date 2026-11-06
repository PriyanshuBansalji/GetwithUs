import { Heading, Text } from "@react-email/components";
import EmailLayout from "@/server/email/components/EmailLayout";
import { emailColors } from "@/server/email/components/theme";

type VerificationCodeProps = { code: string };

/** The 6-digit code that confirms a contact message or project brief. */
export default function VerificationCode({ code }: VerificationCodeProps) {
  return (
    <EmailLayout preview={`Your verification code is ${code}`}>
      <Heading
        as="h1"
        style={{ fontSize: 22, lineHeight: "28px", fontWeight: 600, margin: "0 0 12px" }}
      >
        Confirm your email
      </Heading>
      <Text style={{ fontSize: 16, lineHeight: "24px", margin: "0 0 20px" }}>
        Enter this code on the page you came from to confirm your email address.
      </Text>
      <Text
        style={{
          fontSize: 36,
          lineHeight: "44px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          margin: "0 0 20px",
          color: emailColors.ink,
        }}
      >
        {code}
      </Text>
      <Text style={{ fontSize: 14, lineHeight: "22px", color: emailColors.muted, margin: 0 }}>
        Expires in 10 minutes. If you did not request this, ignore this email.
      </Text>
    </EmailLayout>
  );
}

VerificationCode.PreviewProps = { code: "042318" } satisfies VerificationCodeProps;
