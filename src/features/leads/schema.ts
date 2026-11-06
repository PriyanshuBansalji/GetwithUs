import * as z from "zod/mini";
import { budgetOptions, timelineOptions } from "@/content/brief";
import { serviceSlugs } from "@/content/services/catalog";

/*
 * Zod schemas shared by the browser forms and the API. Messages are the copy the
 * forms show next to each field. Optional text fields accept "" (an untouched
 * input) and normalize it to undefined.
 *
 * Written with zod/mini: these schemas ship to the browser, and the mini API
 * tree-shakes to a fraction of the classic one. Server-only schemas use classic zod.
 */

const optionalText = (max: number, message: string) =>
  z.pipe(
    z.optional(z.string().check(z.trim(), z.maxLength(max, message))),
    z.transform((value) => value || undefined),
  );

const name = z
  .string()
  .check(
    z.trim(),
    z.minLength(1, "Enter your name."),
    z.maxLength(120, "Use 120 characters or fewer."),
  );

/** Trimmed and lowercased before it is validated or stored. */
const email = z.pipe(
  z.string().check(z.trim(), z.toLowerCase(), z.maxLength(254, "Use 254 characters or fewer.")),
  z.email("Enter a valid email address, for example name@company.com."),
);

const company = optionalText(120, "Use 120 characters or fewer.");

const phone = z.pipe(
  z.optional(
    z
      .string()
      .check(
        z.trim(),
        z.maxLength(40, "Use 40 characters or fewer."),
        z.regex(
          /^$|^\+?[\d\s().-]{6,}$/,
          "Use digits, spaces, and an optional + for the country code.",
        ),
      ),
  ),
  z.transform((value) => value || undefined),
);

const services = z.array(z.enum(serviceSlugs)).check(z.maxLength(serviceSlugs.length));

/** Adds https:// when the visitor typed a bare domain; any other scheme is kept and rejected. */
const existingUrl = z.pipe(
  z.pipe(
    z.optional(z.string().check(z.trim(), z.maxLength(500, "Use 500 characters or fewer."))),
    z.transform((value) =>
      value ? (/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`) : undefined,
    ),
  ),
  z.optional(
    z.url({ protocol: /^https?$/, error: "Enter a web address, for example example.com." }),
  ),
);

const budgetValues = budgetOptions.map((option) => option.value) as [string, ...string[]];
const timelineValues = timelineOptions.map((option) => option.value) as [string, ...string[]];

/** The contact form's visible fields. */
export const contactFieldsSchema = z.object({
  name,
  email,
  company,
  services: z._default(services, []),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(20, "Write at least 20 characters so we understand the request."),
      z.maxLength(2000, "Use 2,000 characters or fewer."),
    ),
});

/** The project brief, one object per wizard step. Each step validates before Continue. */
export const briefStepSchemas = {
  services: z.object({
    services: services.check(z.minLength(1, "Choose at least one service.")),
  }),
  project: z.object({
    description: z
      .string()
      .check(
        z.trim(),
        z.minLength(40, "Write at least 40 characters so we understand the project."),
        z.maxLength(3000, "Use 3,000 characters or fewer."),
      ),
    existingUrl,
  }),
  budget: z.object({
    budgetRange: z.enum(budgetValues, { error: "Choose a budget range, or Not sure yet." }),
    timeline: z.enum(timelineValues, { error: "Choose a timeline." }),
  }),
  details: z.object({
    name,
    email,
    company,
    phone,
    referral: optionalText(200, "Use 200 characters or fewer."),
  }),
};

export const briefFieldsSchema = z.extend(
  z.extend(
    z.extend(briefStepSchemas.services, briefStepSchemas.project.shape),
    briefStepSchemas.budget.shape,
  ),
  briefStepSchemas.details.shape,
);

/** Bot defenses sent alongside every public submission. */
const botFields = {
  formToken: z.string().check(z.minLength(1), z.maxLength(200)),
  /** Honeypot: hidden from people, so any value means a bot. */
  website: z.optional(z.string().check(z.maxLength(500))),
  turnstileToken: z.optional(z.string().check(z.maxLength(4096))),
  utm: z.optional(z.record(z.string().check(z.maxLength(40)), z.string().check(z.maxLength(200)))),
};

/** Body of POST /api/v1/leads. */
export const leadSubmissionSchema = z.discriminatedUnion("source", [
  z.extend(contactFieldsSchema, { source: z.literal("contact"), ...botFields }),
  z.extend(briefFieldsSchema, { source: z.literal("brief"), ...botFields }),
]);

export type LeadSubmission = z.output<typeof leadSubmissionSchema>;

/** Body of POST /api/v1/integrations/leads, for the agency's own systems. */
export const integrationLeadSchema = z.object({
  name,
  email,
  company,
  phone,
  services: z._default(services, []),
  message: optionalText(2000, "Use 2,000 characters or fewer."),
  budgetRange: optionalText(120, "Use 120 characters or fewer."),
  timeline: optionalText(120, "Use 120 characters or fewer."),
  /** Which system sent the lead, for example "whatsapp-bot". */
  integration: optionalText(60, "Use 60 characters or fewer."),
});

export type IntegrationLead = z.output<typeof integrationLeadSchema>;
