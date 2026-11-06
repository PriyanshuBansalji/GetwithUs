"use server";

import { refresh } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/features/admin/auth";
import { noteSchema, statusChangeSchema } from "@/features/admin/schema";
import { addLeadNote as addNote, changeLeadStatus } from "@/features/leads/service";
import type { LeadStatus } from "@/features/leads/types";
import { notifyLeadStatusChanged } from "@/features/notifications/dispatch";
import { withAction, type ActionResult } from "@/lib/action";
import { validationError } from "@/lib/errors";
import { err, ok } from "@/lib/result";

/** Moves a lead to a new status, records who did it, and tells the team after responding. */
export async function updateLeadStatus(
  leadId: string,
  status: string,
): Promise<ActionResult<{ status: LeadStatus }>> {
  return withAction("updateLeadStatus", async () => {
    const admin = await requireAdmin();
    const parsed = statusChangeSchema.safeParse({ leadId, status });
    if (!parsed.success) return err(validationError("Choose a status from the list."));

    const changed = await changeLeadStatus(parsed.data.leadId, parsed.data.status, admin.email);
    if (!changed.ok) return changed;
    const { lead, from } = changed.data;
    if (from !== lead.status) {
      after(() => notifyLeadStatusChanged(lead, from, lead.status, admin.email));
    }
    refresh();
    return ok({ status: lead.status });
  });
}

/** Adds an internal note to a lead's timeline. */
export async function addLeadNote(leadId: string, body: string): Promise<ActionResult<null>> {
  return withAction("addLeadNote", async () => {
    const admin = await requireAdmin();
    const parsed = noteSchema.safeParse({ leadId, body });
    if (!parsed.success) {
      return err(
        validationError(
          z.flattenError(parsed.error).fieldErrors.body?.[0] ?? "Write a note before adding it.",
        ),
      );
    }
    const added = await addNote(parsed.data.leadId, parsed.data.body, admin.email);
    if (added.ok) refresh();
    return added;
  });
}
