# 0010. End-to-end test environment

Date: 2026-10-31

## Context

Section 22 asks for Playwright tests against `next start` with the console email transport and a test database, axe checks, and visual snapshots with the 3D canvas off. The suite must fail on any browser console error or warning, run the same locally and in CI, and never touch real data or real integrations.

## Decision

- `playwright.config.ts` builds and starts the app on port 3200 with variables from `tests/e2e/support/env.ts`: test hooks on (full console emails), console email, fixed test secrets, every third-party integration blanked, and `DATABASE_URL` pointed at a dedicated database (`E2E_DATABASE_URL`, default `getwithus_test` on `localhost:5432`, the Docker Postgres from `docker-compose.yml`).
- Global setup creates that database if missing, applies the migrations, and empties it. Specs read and seed it directly through `tests/e2e/support/db.ts`; the app has no test-only HTTP endpoints. Admin specs insert a user and a session row instead of going through email.
- Every spec uses the fixture in `tests/e2e/support/test.ts`, which fails the test on any console error, warning, or uncaught exception, and clears rate-limit counters first.
- Chromium runs WebGL through ANGLE on SwiftShader (`--use-angle=swiftshader`). The default headless path composites WebGL by reading pixels back and logs a "GPU stall due to ReadPixels" driver warning that real browsers never show.
- One worker, since specs share the database.
- Visual baselines are per platform (`*-chromium-win32.png`, `*-chromium-linux.png`). CI runs with `--update-snapshots=missing` and uploads any baseline it had to create.

## Consequences

- A run never sends email, never posts to Slack or WhatsApp, and never touches the development database.
- The first CI run has no Linux baselines to compare against. Download them from the `playwright` artifact and commit them under `tests/e2e/visual.spec.ts-snapshots/`; from then on CI compares.
- The suite rebuilds the app with test settings, which overwrites `.next`. Run `pnpm build` again before `pnpm start` for anything but tests.
