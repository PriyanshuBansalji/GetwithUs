import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { createElement } from "react";
import { env } from "@/config/env";
import { site } from "@/config/site";
import { isAllowlisted } from "@/features/admin/allowlist";
import { db } from "@/server/db/client";
import { accounts, sessions, users, verificationTokens } from "@/server/db/schema";
import { sendEmail } from "@/server/email/client";
import { renderEmail } from "@/server/email/render";
import MagicLink from "@/server/email/templates/MagicLink";

const SESSION_MAX_AGE = 7 * 24 * 60 * 60;
const LINK_MAX_AGE = 15 * 60;

/**
 * Auth.js for the admin area: email magic links (sent through the app's own email
 * client, so the console transport works in development), database sessions for
 * 7 days, and an allowlist enforced in the signIn callback so no other address
 * ever gets a user row.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  secret: env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "database", maxAge: SESSION_MAX_AGE },
  pages: { signIn: "/admin/login", verifyRequest: "/admin/login", error: "/admin/login" },
  providers: [
    Resend({
      from: env.EMAIL_FROM,
      maxAge: LINK_MAX_AGE,
      normalizeIdentifier: (identifier) => identifier.trim().toLowerCase(),
      async sendVerificationRequest({ identifier, url }) {
        const { html, text } = await renderEmail(createElement(MagicLink, { url }));
        const sent = await sendEmail({
          to: identifier,
          subject: `Sign in to the ${site.name} admin`,
          html,
          text,
        });
        // Auth.js expects a throw here to report that the link was not sent.
        if (!sent.ok) throw sent.error;
      },
    }),
  ],
  callbacks: {
    signIn: ({ user }) => isAllowlisted(user.email),
    session: ({ session, user }) => ({ ...session, user: { ...session.user, role: user.role } }),
  },
});
