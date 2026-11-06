import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { closeDatabase, resetDatabase } from "./db";
import { databaseUrl } from "./env";

/** Creates the test database when it is missing (local runs; CI's service creates it). */
async function ensureDatabase(): Promise<void> {
  const url = new URL(databaseUrl);
  const name = url.pathname.slice(1);
  url.pathname = "/postgres";
  const admin = postgres(url.toString(), { max: 1, onnotice: () => undefined });
  try {
    const [found] = await admin`select 1 from pg_database where datname = ${name}`;
    if (!found) await admin.unsafe(`create database "${name.replaceAll('"', "")}"`);
  } finally {
    await admin.end();
  }
}

/** Brings the test database to the latest migration and empties it before the suite. */
export default async function globalSetup(): Promise<void> {
  await ensureDatabase();
  const client = postgres(databaseUrl, { max: 1, onnotice: () => undefined });
  try {
    await migrate(drizzle(client), { migrationsFolder: "src/server/db/migrations" });
  } finally {
    await client.end();
  }
  await resetDatabase();
  await closeDatabase();
}
