import { randomBytes, randomUUID } from "node:crypto";
import postgres from "postgres";
import { adminEmail, databaseUrl } from "./env";

/*
 * Test-only database access. Specs read and seed the test database directly,
 * never through an HTTP endpoint, so no test hook ships in the app.
 */

let client: postgres.Sql | undefined;

function sql(): postgres.Sql {
  client ??= postgres(databaseUrl, { max: 2, prepare: false, onnotice: () => undefined });
  return client;
}

export async function closeDatabase(): Promise<void> {
  await client?.end();
  client = undefined;
}

const TABLES = [
  "notification_deliveries",
  "notifications",
  "lead_events",
  "email_verifications",
  "leads",
  "rate_limits",
  "sessions",
  "accounts",
  "verification_tokens",
  "users",
];

/** Empties every table. Run before the suite and wherever a spec needs a clean slate. */
export async function resetDatabase(): Promise<void> {
  await sql().unsafe(`truncate ${TABLES.join(", ")} restart identity cascade`);
}

/** Clears rate-limit counters so specs that submit forms never trip the per-IP limits. */
export async function resetRateLimits(): Promise<void> {
  await sql()`delete from rate_limits`;
}

export async function leadsByEmail(email: string) {
  return sql()<{ id: string; status: string; source: string }[]>`
    select id, status, source from leads where email = ${email.toLowerCase()}
  `;
}

export async function leadEvents(leadId: string) {
  return sql()<{ type: string; actor: string; data: Record<string, unknown> }[]>`
    select type, actor, data from lead_events where lead_id = ${leadId} order by created_at
  `;
}

/** A confirmed contact lead, as if the visitor had entered their code. */
export async function insertVerifiedLead(name: string): Promise<{ id: string; email: string }> {
  const id = randomUUID();
  const email = `e2e.${id.slice(0, 8)}@example.com`;
  await sql()`
    insert into leads (id, source, status, name, email, email_verified_at, services, message)
    values (${id}, 'contact', 'new', ${name}, ${email}, now(), '["web-development"]'::jsonb,
      'We need a new marketing site that our team can edit.')
  `;
  return { id, email };
}

/**
 * A signed-in admin without the email round trip: the allowlisted user plus a
 * database session, the same rows Auth.js writes after a magic link. Returns
 * the session token to set as the `authjs.session-token` cookie.
 */
export async function createAdminSession(): Promise<string> {
  const [user] = await sql()<{ id: string }[]>`
    insert into users (email, email_verified, role) values (${adminEmail}, now(), 'admin')
    on conflict (email) do update set email_verified = excluded.email_verified
    returning id
  `;
  const token = randomBytes(32).toString("hex");
  await sql()`
    insert into sessions (session_token, user_id, expires)
    values (${token}, ${user.id}, now() + interval '1 day')
  `;
  return token;
}
