import type { LeadSource, LeadStatus } from "@/features/leads/types";

/** How each status reads in the admin, in notifications, and on the status select. */
export const statusLabels: Record<LeadStatus, string> = {
  pending_verification: "Awaiting verification",
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
  spam: "Spam",
};

/** How each source reads in the admin table, the lead page, and team emails. */
export const sourceLabels: Record<LeadSource, string> = {
  contact: "Contact form",
  brief: "Project brief",
  api: "Integration",
};

/** Badge tone per status. Each badge also carries its label, so color is never the only signal. */
export const statusTones: Record<LeadStatus, "neutral" | "signal" | "ok" | "err"> = {
  pending_verification: "neutral",
  new: "signal",
  contacted: "neutral",
  qualified: "neutral",
  won: "ok",
  lost: "neutral",
  spam: "err",
};
