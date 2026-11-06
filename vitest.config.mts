import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    environment: "node",
    // Fixed, obviously fake values so importing @/config/env validates in tests.
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgres://test:test@localhost:5432/test",
      AUTH_SECRET: "test-auth-secret-0000000000000000000000",
      ADMIN_EMAILS: "admin@example.com",
      VERIFICATION_PEPPER: "test-pepper-00000000000000000000000000",
      CRON_SECRET: "test-cron-secret-0000",
      EMAIL_TRANSPORT: "console",
      EMAIL_FROM: "Getwithus <no-reply@example.com>",
      TEAM_NOTIFY_EMAILS: "team@example.com",
      LEADS_API_KEY: "test-leads-api-key-000000000000000000",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    },
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/features/**", "src/server/**", "src/components/three/hooks/**"],
    },
  },
});
