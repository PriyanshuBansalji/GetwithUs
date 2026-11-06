# 0003. Drizzle ORM over Prisma

Date: 2026-10-31

## Context

The app needs a typed Postgres layer for a handful of tables (leads, events, verifications, notifications, deliveries, rate limits, and the Auth.js tables), running on Vercel functions against Neon. Cold starts and connection behavior matter more than ORM features.

## Decision

Drizzle ORM 0.45 with the postgres.js driver (`prepare: false`, which Neon's pooler needs). The schema lives in `src/server/db/schema`, migrations are generated SQL in `src/server/db/migrations`, and only repositories import the database client.

## Consequences

- No query engine binary and no generate step at install, so builds and cold starts stay small.
- Queries read like SQL, including the single-statement upsert the rate limiter relies on and `select ... for update` for status changes.
- Migrations are plain SQL files that can be reviewed and run with `pnpm db:migrate`.
- Fewer conveniences than Prisma (no nested writes); transactions are written explicitly in repositories.
- `@auth/drizzle-adapter` works with the same schema, so authentication needs no second data layer.
