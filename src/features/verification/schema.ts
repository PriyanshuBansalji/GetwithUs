import { z } from "zod";

const leadId = z.uuid("That request is not valid. Start again from the form.");

/** Body of POST /api/v1/leads/verify. */
export const verifyBodySchema = z.object({
  leadId,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code from the email."),
});

/** Body of POST /api/v1/leads/resend. */
export const resendBodySchema = z.object({ leadId });
