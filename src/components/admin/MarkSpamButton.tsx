"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import { updateLeadStatus } from "@/features/leads/actions";

/** "Mark as spam" sets a status (nothing is deleted), after a confirmation. */
export default function MarkSpamButton({ leadId }: { leadId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const confirm = () => {
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, "spam");
      if (result.ok) {
        setOpen(false);
        toast.success("Marked as spam");
      } else {
        toast.error(
          `Not marked as spam. ${result.error.message} Reference ${result.error.requestId}.`,
        );
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Mark this lead as spam?"
      description="The lead stays in the database with the status Spam. You can change the status back at any time."
      trigger={
        <Button variant="secondary" size="sm">
          Mark as spam
        </Button>
      }
    >
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="ghost" onClick={() => setOpen(false)}>
          Keep as is
        </Button>
        <Button onClick={confirm} loading={pending}>
          Mark as spam
        </Button>
      </div>
    </Dialog>
  );
}
