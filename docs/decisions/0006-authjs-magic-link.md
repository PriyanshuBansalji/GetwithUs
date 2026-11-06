# 0006. Auth.js magic links with an allowlist

Date: 2026-10-31

## Context

Only a few team members use the admin. There is no public sign-up. Passwords would need storage, reset flows, and rate limiting of their own.

## Decision

Auth.js (next-auth 5) with the Resend email provider and the Drizzle adapter:

- The sign-in link is sent through the app's own email client, so it uses the same templates and the console transport in development.
- The `signIn` callback rejects any address not in `ADMIN_EMAILS` (trimmed, lowercased), so no user row is created for it. The login form shows the same message either way, so it cannot be used to discover who is on the list. Requests are rate limited per IP and per email.
- Sessions are database sessions for 7 days (revocable by deleting the row); the cookie is `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- `src/proxy.ts` redirects requests without a session cookie; `requireAdmin()` verifies the session against the database in the layout, every page, and every action.

## Consequences

- No passwords to store or reset. Access is as safe as the team's email accounts, so those should use two-factor authentication.
- Removing someone means removing them from `ADMIN_EMAILS` (checked on every request) and redeploying; deleting their session rows signs them out at once.
- next-auth 5 is still published as a beta; the version is pinned and recorded in [0001-versions.md](0001-versions.md).
