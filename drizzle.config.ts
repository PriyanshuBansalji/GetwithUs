import { defineConfig } from "drizzle-kit";
import "./scripts/load-env";

// Tooling config: reads DATABASE_URL directly, outside the app's validated env.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema/index.ts",
  out: "./src/server/db/migrations",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
  verbose: true,
});
