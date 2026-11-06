# Notifications

When a lead confirms their email (or arrives through the integration endpoint), and when a team member changes a lead's status, `src/features/notifications/dispatch.ts`:

1. Writes an in-app notification (title such as "New project brief from Jane Doe (Acme)", linking to `/admin/leads/<id>`).
2. Sends every enabled channel at once with `Promise.allSettled`, each with a 5 second timeout.
3. Records one delivery row per channel (`sent` or `failed`, with the error) and a `notification_sent` or `notification_failed` event on the lead's timeline.

A failing channel never affects the visitor's response or the other channels. Failures show on the lead's Timeline tab in the admin with the reason.

## Channels

| Channel  | When it is on                           | New verified lead                             | Status change |
| -------- | --------------------------------------- | --------------------------------------------- | ------------- |
| In-app   | always                                  | yes                                           | yes           |
| Email    | always                                  | yes, to every address in `TEAM_NOTIFY_EMAILS` | no            |
| Slack    | `SLACK_WEBHOOK_URL` is set              | yes                                           | yes           |
| WhatsApp | all four `WHATSAPP_*` variables are set | yes                                           | no            |

### In-app

The admin header shows a bell with the unread count, refreshed every 30 seconds while the tab is visible. `/admin/notifications` lists them with "Mark as read", "Mark all as read", and an "Unread only" filter.

### Email

Template `src/server/email/templates/LeadReceived.tsx`. Subject "New contact message from Jane Doe" or "New project brief from Jane Doe". The body lists every field the lead sent, the message in full, and an "Open in admin" button. No images.

The client gets their own email after confirming (`LeadConfirmed.tsx`, subject "Confirmed. We reply within [response time].") with a summary of what they sent and the team's contact details. Leads from the integration endpoint do not get it.

### Slack

1. In Slack, create an app (or use an existing one), enable Incoming Webhooks, and add a webhook to the channel the team watches.
2. Set `SLACK_WEBHOOK_URL` to the webhook URL in Vercel (Production and Preview) and redeploy.

Messages use Block Kit: a header with the title, up to ten fields, and an "Open in admin" button.

### WhatsApp Cloud API

WhatsApp notifications go to one number, the owner's, as a pre-approved template. Free-form messages are never sent: outside the 24-hour customer service window Meta rejects anything except templates.

Setup:

1. In Meta Business Manager, create a WhatsApp Business account and add a phone number for sending (it cannot be the same number that receives).
2. Create a system user with the `whatsapp_business_messaging` permission and generate a permanent access token.
3. Submit the template below for approval (category Utility, language English).
4. Once approved, set in Vercel:
   - `WHATSAPP_PHONE_NUMBER_ID`: the sending number's ID (WhatsApp Manager, API setup)
   - `WHATSAPP_ACCESS_TOKEN`: the permanent token
   - `WHATSAPP_NOTIFY_TO`: the receiving number in E.164, for example `+15551234567`
   - `WHATSAPP_TEMPLATE_NAME`: the template name, for example `new_lead`
5. Redeploy and send a test lead.

The app calls the Graph API `v26.0` (`POST https://graph.facebook.com/v26.0/<phone number id>/messages`) with template language code `en`. If you submit the template in another language, change `TEMPLATE_LANGUAGE` in `src/features/notifications/channels/whatsapp.ts` to match. Meta supports each Graph API version for about two years; move `GRAPH_API_VERSION` forward when Meta announces its end of life.

#### Template to submit

Name: `new_lead` (or any name; it goes in `WHATSAPP_TEMPLATE_NAME`)
Category: Utility
Language: English (`en`)

Body:

```text
New lead from {{1}} ({{2}}).
Services: {{3}}
Open it in the admin: {{4}}
```

Parameters, in this exact order (the app sends them as body text parameters):

| Parameter | Value                                                                             | When missing       |
| --------- | --------------------------------------------------------------------------------- | ------------------ |
| `{{1}}`   | The lead's name                                                                   | always present     |
| `{{2}}`   | Company                                                                           | "No company given" |
| `{{3}}`   | Services, comma separated                                                         | "Not specified"    |
| `{{4}}`   | Link to the lead in the admin, for example `https://example.com/admin/leads/<id>` | always present     |

Each parameter is cut to 200 characters. Meta asks for sample values when you submit; use something like "Jane Doe", "Acme", "Web development", and your admin URL.

## Testing locally with the console transport

With `EMAIL_TRANSPORT=console`, no email leaves the machine: every email (the client's code, the confirmation, the team email, admin sign-in links) is rendered and printed to the terminal running the server.

1. `pnpm dev`, then send the contact form at http://localhost:3000/contact.
2. Copy the 6-digit code from the terminal and enter it.
3. The terminal then shows the client confirmation and the team email. Open `/admin/notifications` (sign in with a link printed the same way) to see the in-app notification, and the lead's Timeline tab to see each delivery.

To try Slack without the real channel, point `SLACK_WEBHOOK_URL` at a request inspector such as a local `nc -l 9000` (`http://localhost:9000`) and watch the payload arrive. The unit tests in `tests/unit/features/notifications/dispatch.test.ts` check that every channel is called, that one failing channel does not stop the others, that deliveries are recorded with the right status, and the exact WhatsApp payload.
