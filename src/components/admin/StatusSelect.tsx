"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import Field from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import { updateLeadStatus } from "@/features/leads/actions";
import { statusLabels } from "@/features/leads/status";
import { ASSIGNABLE_STATUSES, type LeadStatus } from "@/features/leads/types";

const options = ASSIGNABLE_STATUSES.map((status) => ({
  value: status,
  label: statusLabels[status],
}));

/**
 * The lead's status. Changes show at once (optimistic) and are confirmed with a
 * toast that repeats the action's verb; a failure reverts and says why.
 */
export default function StatusSelect({ leadId, status }: { leadId: string; status: LeadStatus }) {
  const [optimistic, setOptimistic] = useOptimistic(status);
  const [pending, startTransition] = useTransition();

  const change = (next: LeadStatus) => {
    if (next === optimistic || !(ASSIGNABLE_STATUSES as readonly string[]).includes(next)) return;
    startTransition(async () => {
      setOptimistic(next);
      const result = await updateLeadStatus(leadId, next);
      if (result.ok) toast.success(`Status changed to ${statusLabels[result.data.status]}`);
      else
        toast.error(
          `Status not changed. ${result.error.message} Reference ${result.error.requestId}.`,
        );
    });
  };

  return (
    <Field label="Status">
      {(control) => (
        <Select
          {...control}
          options={options}
          value={optimistic === "pending_verification" ? "" : optimistic}
          placeholder={
            optimistic === "pending_verification" ? statusLabels.pending_verification : undefined
          }
          disabled={pending}
          onChange={(event) => change(event.currentTarget.value as LeadStatus)}
        />
      )}
    </Field>
  );
}
