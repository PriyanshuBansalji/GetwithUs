import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /** The `role` column on users. Every allowlisted team member is "admin". */
  interface User {
    role?: string;
  }

  interface Session {
    user: DefaultSession["user"] & { role?: string };
  }
}
