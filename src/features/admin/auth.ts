import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { isAllowlisted } from "@/features/admin/allowlist";
import { auth } from "@/server/auth/config";

export type AdminUser = { email: string; name: string | null };

/**
 * The signed-in team member, or null. Re-checks the allowlist on every request;
 * memoized per request because the layout and the page both ask.
 */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  // Auth.js draws a random CSRF token inside auth(); reading cookies alone still
  // counts as prerenderable under Cache Components, so opt into request time first.
  await connection();
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !isAllowlisted(email)) return null;
  return { email: email.toLowerCase(), name: session.user?.name ?? null };
});

/**
 * The signed-in team member, or a redirect to /admin/login. Called by the admin
 * layout, by every admin page before it reads data (layouts and pages render in
 * parallel, so the layout alone does not guard a page), and by every admin server
 * action, all behind the optimistic cookie check in proxy.ts.
 */
export async function requireAdmin(next?: string): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect(next ? `/admin/login?next=${encodeURIComponent(next)}` : "/admin/login");
  return admin;
}
