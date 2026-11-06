import { Column, Row, Section, Text } from "@react-email/components";
import { emailColors } from "@/server/email/components/theme";

export type Detail = { label: string; value: string };

/** Label and value rows: the email-safe version of a definition list. */
export default function DetailList({ details }: { details: readonly Detail[] }) {
  return (
    <Section style={{ borderTop: `1px solid ${emailColors.line}` }}>
      {details.map((detail) => (
        <Row key={detail.label} style={{ borderBottom: `1px solid ${emailColors.line}` }}>
          <Column style={{ width: 160, verticalAlign: "top", padding: "10px 12px 10px 0" }}>
            <Text style={{ fontSize: 14, lineHeight: "20px", color: emailColors.muted, margin: 0 }}>
              {detail.label}
            </Text>
          </Column>
          <Column style={{ verticalAlign: "top", padding: "10px 0" }}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: "20px",
                color: emailColors.ink,
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {detail.value}
            </Text>
          </Column>
        </Row>
      ))}
    </Section>
  );
}
