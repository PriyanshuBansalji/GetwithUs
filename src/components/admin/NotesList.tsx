"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Textarea from "@/components/ui/Textarea";
import { addLeadNote } from "@/features/leads/actions";

type Note = { id: string; body: string; actor: string; createdAt: string; createdLabel: string };

/** Internal notes on a lead, newest first, and the form to add one. Notes are lead events. */
export default function NotesList({ leadId, notes }: { leadId: string; notes: readonly Note[] }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    startTransition(async () => {
      const result = await addLeadNote(leadId, body);
      if (result.ok) {
        setBody("");
        setError(undefined);
        toast.success("Note added");
      } else {
        setError(result.error.message);
      }
    });
  };

  return (
    <section aria-labelledby="notes-title" className="grid gap-5">
      <h2 id="notes-title" className="type-h4">
        Notes
      </h2>
      <form onSubmit={submit} noValidate className="grid gap-3">
        <Field label="Add a note" hint="Only the team sees notes." error={error}>
          {(control) => (
            <Textarea
              {...control}
              rows={3}
              maxLength={2000}
              value={body}
              onChange={(event) => setBody(event.currentTarget.value)}
            />
          )}
        </Field>
        <div>
          <Button type="submit" size="sm" loading={pending}>
            Add note
          </Button>
        </div>
      </form>
      {notes.length ? (
        <ul className="grid gap-4">
          {notes.map((note) => (
            <li key={note.id} className="border-l-2 border-line pl-4">
              <p className="whitespace-pre-wrap text-ink">{note.body}</p>
              <p className="mt-1 type-small text-body">
                <span className="font-mono">{note.actor}</span>,{" "}
                <time dateTime={note.createdAt}>{note.createdLabel}</time>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="type-small text-body">No notes yet.</p>
      )}
    </section>
  );
}
