# 0007. Resend for email, react-email for templates

Date: 2026-10-31

## Context

The app sends verification codes, client confirmations, team notifications, and admin sign-in links. Codes must arrive fast and land in the inbox, and the team needs to preview templates without sending.

## Decision

- Resend through its SDK, called with a 5 second timeout, behind `src/server/email/client.ts`. Failures become `EMAIL_ERROR` results; nothing throws past the client.
- Templates are React components in `src/server/email/templates`, rendered to HTML and plain text with react-email. Ink text on white, one signal-coloured (cyan) button, no images.
- `EMAIL_TRANSPORT=console` prints every rendered email to the server log instead of sending; it is the development default.
- The sending domain is verified in Resend with SPF, DKIM, and DMARC records.

## Consequences

- One small provider dependency with a simple API; switching providers means rewriting one file.
- Development and tests need no email account; codes are read from the log.
- In production the console transport never prints codes unless the build was made with `NEXT_PUBLIC_TEST_HOOKS=1`, which is only for test builds.
