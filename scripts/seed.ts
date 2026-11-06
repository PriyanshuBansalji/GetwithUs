// Development seed: one admin user from ADMIN_EMAILS and four clearly fake leads.
// Refuses to run in production. Run with `pnpm db:seed` after `pnpm db:migrate`.
import "./load-env";
import { env } from "@/config/env";
import type { LeadStatus, NewLead } from "@/features/leads/types";
import { db } from "@/server/db/client";
import { leadEvents, leads, users } from "@/server/db/schema";

if (env.NODE_ENV === "production") {
  console.error("Refusing to seed: NODE_ENV is production.");
  process.exit(1);
}

type Sample = NewLead & { status: LeadStatus; daysAgo: number };

const samples: Sample[] = [
  {
    status: "new",
    daysAgo: 0,
    source: "brief",
    name: "Test Lead One",
    email: "test.lead.one@example.com",
    company: "Example Clinics",
    services: ["app-development", "whatsapp-bot"],
    message: "A booking app for a small chain of clinics, with WhatsApp reminders.",
    budgetRange: "not-sure",
    timeline: "1-3-months",
  },
  {
    status: "contacted",
    daysAgo: 2,
    source: "contact",
    name: "Test Lead Two",
    email: "test.lead.two@example.com",
    services: ["web-development"],
    message: "We need a new marketing site that our team can edit.",
  },
  {
    status: "qualified",
    daysAgo: 5,
    source: "api",
    name: "Test Lead Three",
    email: "test.lead.three@example.com",
    company: "Example Logistics",
    services: ["calling-agent"],
    message: "Wants an after-hours calling agent for delivery questions.",
    meta: { integration: "whatsapp-bot" },
  },
  {
    status: "won",
    daysAgo: 12,
    source: "brief",
    name: "Test Lead Four",
    email: "test.lead.four@example.com",
    company: "Example Retail",
    services: ["digital-marketing"],
    message: "Set up conversion tracking, then run search ads for two stores.",
    budgetRange: "not-sure",
    timeline: "asap",
  },
];

async function main() {
  const [adminEmail] = env.ADMIN_EMAILS;
  await db.insert(users).values({ email: adminEmail, name: "Admin" }).onConflictDoNothing();

  for (const { status, daysAgo, ...lead } of samples) {
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    const [row] = await db
      .insert(leads)
      .values({ ...lead, status, emailVerifiedAt: createdAt, createdAt, updatedAt: createdAt })
      .returning({ id: leads.id });
    await db.insert(leadEvents).values([
      {
        leadId: row.id,
        type: "created",
        actor: "client",
        data: { source: lead.source },
        createdAt,
      },
      { leadId: row.id, type: "verified", actor: "client", data: {}, createdAt },
      ...(status === "new"
        ? []
        : [
            {
              leadId: row.id,
              type: "status_changed" as const,
              actor: adminEmail,
              data: { from: "new", to: status },
            },
          ]),
    ]);
  }

  console.log(`Seeded admin ${adminEmail} and ${samples.length} sample leads.`);
  await db.$client.end();
}

main().catch(async (error: unknown) => {
  console.error("Seed failed:", error);
  await db.$client.end();
  process.exit(1);
});
