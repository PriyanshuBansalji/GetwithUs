import { z } from "zod";
import { ASSIGNABLE_STATUSES, LEAD_STATUSES } from "@/features/leads/types";

/** Server-only schemas for the admin area (classic Zod; none of this ships to public pages). */

const firstValue = (value: unknown) => (Array.isArray(value) ? value[0] : value);

/** Leads table filters from the URL. Anything malformed falls back to the default. */
export const leadFiltersSchema = z.object({
  status: z.preprocess(firstValue, z.enum(LEAD_STATUSES).optional().catch(undefined)),
  source: z.preprocess(firstValue, z.enum(["contact", "brief", "api"]).optional().catch(undefined)),
  q: z.preprocess(firstValue, z.string().trim().max(100).optional().catch(undefined)),
  page: z.preprocess(firstValue, z.coerce.number().int().min(1).max(10_000).catch(1)),
});

export const statusChangeSchema = z.object({
  leadId: z.uuid(),
  status: z.enum(ASSIGNABLE_STATUSES),
});

export const noteSchema = z.object({
  leadId: z.uuid(),
  body: z
    .string()
    .trim()
    .min(1, "Write a note before adding it.")
    .max(2000, "Keep notes under 2,000 characters."),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  next: z.string().optional(),
});
