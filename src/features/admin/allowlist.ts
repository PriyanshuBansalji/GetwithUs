import { env } from "@/config/env";

/** True when the email is on ADMIN_EMAILS. Compared trimmed and lowercased. */
export function isAllowlisted(email: string | null | undefined): boolean {
  if (!email) return false;
  return env.ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
