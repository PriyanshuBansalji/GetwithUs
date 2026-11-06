# API

Public endpoints live under `/api/v1`. Breaking changes go to `/api/v2`; `/api/v1` never changes incompatibly. Admin changes are server actions, not HTTP endpoints, except the unread count.

## Conventions

Every response is JSON in one envelope:

```json
{ "ok": true, "data": {} }
```

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Check the highlighted fields and try again.",
    "details": {
      "fieldErrors": { "email": ["Enter a valid email address, for example name@company.com."] }
    },
    "requestId": "8d0c1c6e-3b8e-4f5e-9a51-7f2a0c1d2e3f"
  }
}
```

- Every response carries an `x-request-id` header, and every error carries the same `requestId`. Quote it when reporting a problem; the server log line has it too.
- 5xx errors never expose internal details: the message is always "Something went wrong on our side. Try again in a moment."
- Mutating public endpoints (`/leads`, `/leads/verify`, `/leads/resend`) require an `Origin` header that matches `NEXT_PUBLIC_SITE_URL` (or the Vercel preview URL); otherwise `403 FORBIDDEN`. In the examples below, replace the origin with your site URL.
- Rate limits are fixed windows keyed by a hash of the client IP (with a daily salt), the email, the lead, or the API key. A limited request gets `429 RATE_LIMITED` with a `Retry-After` header in seconds and `details.retryAfterSeconds`.

## Error codes

| Code                   | HTTP | When                                                                                              | Details                     |
| ---------------------- | ---- | ------------------------------------------------------------------------------------------------- | --------------------------- |
| `VALIDATION_ERROR`     | 400  | The body is not JSON or fails the schema                                                          | `fieldErrors`, `formErrors` |
| `UNAUTHORIZED`         | 401  | Missing or wrong API key, cron secret, or admin session                                           |                             |
| `FORBIDDEN`            | 403  | `Origin` missing or not the site                                                                  |                             |
| `NOT_FOUND`            | 404  | The lead does not exist or has been cleaned up ("That request has expired. Send the form again.") |                             |
| `CONFLICT`             | 409  | Asking for a new code for an email that is already confirmed                                      |                             |
| `RATE_LIMITED`         | 429  | Too many requests in the window, or a resend inside the 60 second cooldown                        | `retryAfterSeconds`         |
| `VERIFICATION_INVALID` | 400  | Wrong code                                                                                        | `remainingAttempts`         |
| `VERIFICATION_EXPIRED` | 410  | The code is older than 10 minutes, or there is no active code                                     |                             |
| `VERIFICATION_LOCKED`  | 423  | Five wrong attempts; request a new code                                                           |                             |
| `BOT_CHECK_FAILED`     | 400  | Form token missing, forged, younger than 3 seconds or older than 2 hours, or Turnstile failed     |                             |
| `DB_ERROR`             | 500  | The database failed                                                                               |                             |
| `EMAIL_ERROR`          | 502  | The email provider failed                                                                         |                             |
| `INTERNAL`             | 500  | Anything unexpected                                                                               |                             |

## Endpoints

| Method and path                                | Auth                                                 | Rate limit                                    |
| ---------------------------------------------- | ---------------------------------------------------- | --------------------------------------------- |
| `GET /api/v1/health`                           | none                                                 | 60 per minute per IP                          |
| `GET /api/v1/forms/token`                      | none                                                 | 30 per minute per IP                          |
| `POST /api/v1/leads`                           | Origin, form token, honeypot, Turnstile when enabled | 5 per hour per IP and 3 per hour per email    |
| `POST /api/v1/leads/verify`                    | Origin                                               | 10 per 10 minutes per IP; 5 attempts per code |
| `POST /api/v1/leads/resend`                    | Origin                                               | 60 seconds between codes, 3 per hour per lead |
| `POST /api/v1/integrations/leads`              | `x-api-key`                                          | 60 per minute per key                         |
| `GET /api/v1/admin/notifications/unread-count` | admin session cookie                                 | 120 per minute                                |
| `GET` or `POST /api/v1/cron/cleanup`           | `Authorization: Bearer CRON_SECRET`                  | none                                          |

### GET /api/v1/health

Liveness plus `select 1` against the database. `503` with `"status": "degraded"` when the database does not answer.

```sh
curl -s https://example.com/api/v1/health
```

```json
{ "ok": true, "data": { "status": "ok", "version": "a1b2c3d", "db": true } }
```

`version` is the first seven characters of the deployed commit, or `development` locally.

### GET /api/v1/forms/token

A signed timestamp. The forms fetch one on mount and send it back with the submission; the server rejects tokens younger than 3 seconds or older than 2 hours.

```sh
curl -s https://example.com/api/v1/forms/token
```

```json
{ "ok": true, "data": { "token": "1793457482676.6f1c0e9b4a..." } }
```

### POST /api/v1/leads

Creates a lead awaiting verification and emails a 6-digit code. `source` selects the shape: `contact` or `brief`.

Contact body:

| Field            | Type                   | Rules                                                                                                                                              |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`         | `"contact"`            |                                                                                                                                                    |
| `name`           | string                 | 1 to 120 characters                                                                                                                                |
| `email`          | string                 | valid email, trimmed and lowercased                                                                                                                |
| `company`        | string, optional       | up to 120                                                                                                                                          |
| `services`       | string array, optional | service slugs: `web-development`, `app-development`, `agentic-automation`, `whatsapp-bot`, `calling-agent`, `digital-marketing`, `custom-software` |
| `message`        | string                 | 20 to 2,000 characters                                                                                                                             |
| `formToken`      | string                 | from `/forms/token`                                                                                                                                |
| `website`        | string, optional       | the honeypot; people never fill it                                                                                                                 |
| `turnstileToken` | string, optional       | required when Turnstile is enabled                                                                                                                 |
| `utm`            | object, optional       | UTM parameters captured on landing                                                                                                                 |

Brief body: `source: "brief"`, `services` (at least one), `description` (40 to 3,000 characters), `existingUrl` (optional; a bare domain gets `https://`), `budgetRange` (`range-1` to `range-4` or `not-sure`), `timeline` (`asap`, `1-3-months`, `3-6-months`, `exploring`), `name`, `email`, `company`, `phone` (optional, digits, spaces, and `+`), `referral` (optional), and the same bot fields.

```sh
TOKEN=$(curl -s https://example.com/api/v1/forms/token | node -pe 'JSON.parse(require("fs").readFileSync(0)).data.token')
sleep 3
curl -s -X POST https://example.com/api/v1/leads \
  -H 'Origin: https://example.com' -H 'Content-Type: application/json' \
  -d "{\"source\":\"contact\",\"name\":\"Jane Doe\",\"email\":\"jane@example.com\",\"message\":\"We need a new marketing site with a CMS.\",\"formToken\":\"$TOKEN\"}"
```

`201`:

```json
{
  "ok": true,
  "data": {
    "leadId": "1a0155ee-2fa3-4e62-9c80-cb197bed85d3",
    "email": "jane@example.com",
    "resendAvailableAt": "2026-10-31T10:01:00.000Z"
  }
}
```

A filled honeypot gets the same `201` shape with a random `leadId`, and nothing is stored or sent.

Errors: `403 FORBIDDEN`, `400 VALIDATION_ERROR`, `400 BOT_CHECK_FAILED`, `429 RATE_LIMITED`, `502 EMAIL_ERROR`, `500 DB_ERROR`.

### POST /api/v1/leads/verify

```sh
curl -s -X POST https://example.com/api/v1/leads/verify \
  -H 'Origin: https://example.com' -H 'Content-Type: application/json' \
  -d '{"leadId":"1a0155ee-2fa3-4e62-9c80-cb197bed85d3","code":"042517"}'
```

```json
{ "ok": true, "data": { "verified": true } }
```

On success the lead becomes `new`; the client confirmation email and the team notifications are sent after the response. Verifying an already-verified lead answers the same success and sends nothing again.

Wrong code, `400`:

```json
{
  "ok": false,
  "error": {
    "code": "VERIFICATION_INVALID",
    "message": "That code is not correct. Check the email and try again.",
    "details": { "remainingAttempts": 4 },
    "requestId": "..."
  }
}
```

Other errors: `410 VERIFICATION_EXPIRED`, `423 VERIFICATION_LOCKED`, `404 NOT_FOUND`, `429 RATE_LIMITED`, `403 FORBIDDEN`.

### POST /api/v1/leads/resend

Issues a new code and invalidates the previous one.

```sh
curl -s -X POST https://example.com/api/v1/leads/resend \
  -H 'Origin: https://example.com' -H 'Content-Type: application/json' \
  -d '{"leadId":"1a0155ee-2fa3-4e62-9c80-cb197bed85d3"}'
```

```json
{ "ok": true, "data": { "resendAvailableAt": "2026-10-31T10:02:00.000Z" } }
```

Errors: `429 RATE_LIMITED` with `Retry-After` inside the 60 second cooldown or past 3 an hour, `409 CONFLICT` when the email is already confirmed, `404 NOT_FOUND`, `403 FORBIDDEN`.

### POST /api/v1/integrations/leads

For the agency's own systems (for example its WhatsApp bot). Creates a lead that is already verified (`source: "api"`) and notifies the team; no client email is sent. Disabled unless `LEADS_API_KEY` is set.

| Field                     | Type                   | Rules                                            |
| ------------------------- | ---------------------- | ------------------------------------------------ |
| `name`                    | string                 | 1 to 120                                         |
| `email`                   | string                 | valid email                                      |
| `company`, `phone`        | string, optional       | as above                                         |
| `services`                | string array, optional | service slugs                                    |
| `message`                 | string, optional       | up to 2,000                                      |
| `budgetRange`, `timeline` | string, optional       | free text up to 120                              |
| `integration`             | string, optional       | which system sent it, for example `whatsapp-bot` |

```sh
curl -s -X POST https://example.com/api/v1/integrations/leads \
  -H "x-api-key: $LEADS_API_KEY" -H 'Content-Type: application/json' \
  -d '{"name":"Jane Doe","email":"jane@example.com","services":["whatsapp-bot"],"message":"Asked for a quote on WhatsApp.","integration":"whatsapp-bot"}'
```

`201`:

```json
{ "ok": true, "data": { "leadId": "5b8f3e1a-6c2d-4a7b-9e0f-1d2c3b4a5e6f" } }
```

Errors: `401 UNAUTHORIZED`, `400 VALIDATION_ERROR`, `429 RATE_LIMITED`, `500 DB_ERROR`.

### GET /api/v1/admin/notifications/unread-count

Used by the admin header badge every 30 seconds. Needs the admin session cookie; answers `401 UNAUTHORIZED` otherwise.

```json
{ "ok": true, "data": { "count": 3 } }
```

### GET or POST /api/v1/cron/cleanup

Vercel Cron calls it daily at 03:00 UTC (`vercel.json`) with `GET` and the bearer token; `POST` is accepted for manual runs. Deletes leads never verified after 7 days, consumed or expired verifications older than a day, and rate-limit rows older than 24 hours.

```sh
curl -s -X POST https://example.com/api/v1/cron/cleanup -H "Authorization: Bearer $CRON_SECRET"
```

```json
{ "ok": true, "data": { "leads": 2, "verifications": 5, "rateLimits": 140 } }
```

Errors: `401 UNAUTHORIZED`, `500 DB_ERROR`.

## Auth.js routes

`/api/auth/*` belongs to Auth.js (sign-in callback, sign-out, session). Nothing outside the admin uses it.
