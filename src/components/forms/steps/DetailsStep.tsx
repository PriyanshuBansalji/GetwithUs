"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormAlert from "@/components/forms/FormAlert";
import Honeypot from "@/components/forms/Honeypot";
import StepFrame from "@/components/forms/steps/StepFrame";
import Turnstile from "@/components/forms/Turnstile";
import { useLeadSubmission } from "@/components/forms/useLeadSubmission";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import { formCopy } from "@/content/forms";
import { briefFieldsSchema, briefStepSchemas } from "@/features/leads/schema";
import { useBriefStore, type BriefStep } from "@/stores/brief.store";

const contactFields = ["name", "email", "company", "phone", "referral"] as const;

/** The step that owns each brief field, so a server rejection can send the person back to it. */
const stepOfField: Record<string, BriefStep> = {
  services: 1,
  description: 2,
  existingUrl: 2,
  budgetRange: 3,
  timeline: 3,
};

/** Step 4: who to reply to, then "Send and verify" submits the whole brief. */
export default function DetailsStep() {
  const draft = useBriefStore((state) => state.draft);
  const update = useBriefStore((state) => state.update);
  const goTo = useBriefStore((state) => state.goTo);
  const submitted = useBriefStore((state) => state.submitted);
  const { submit, honeypot, onTurnstileToken, formError } = useLeadSubmission();
  const form = useForm({
    resolver: zodResolver(briefStepSchemas.details),
    defaultValues: draft.contact,
    mode: "onTouched",
  });
  const { errors, isSubmitting } = form.formState;

  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) => update({ contact: values }),
      }),
    [form, update],
  );

  const onSubmit = form.handleSubmit(async (contact) => {
    const { contact: _stored, ...rest } = draft;
    const brief = briefFieldsSchema.safeParse({ ...rest, ...contact });
    if (!brief.success) {
      // An earlier answer no longer validates (for example an old saved draft): go back to it.
      const field = brief.error.issues[0]?.path[0];
      goTo(stepOfField[String(field)] ?? 1);
      return;
    }
    const result = await submit({ source: "brief", ...brief.data }, (fieldErrors) => {
      for (const name of contactFields) {
        const message = fieldErrors[name]?.[0];
        if (message) form.setError(name, { message });
      }
      const earlier = Object.keys(fieldErrors).find((name) => stepOfField[name]);
      if (earlier) goTo(stepOfField[earlier]);
    });
    if (result) submitted(result);
  });

  return (
    <StepFrame
      title={formCopy.brief.steps[3]}
      canContinue
      loading={isSubmitting}
      submitLabel={formCopy.sendAndVerify}
      onBack={() => goTo(3)}
      onSubmit={onSubmit}
    >
      <Field label={formCopy.fields.name} error={errors.name?.message}>
        {(control) => <Input {...control} {...form.register("name")} autoComplete="name" />}
      </Field>
      <Field
        label={formCopy.fields.email}
        hint={formCopy.hints.email}
        error={errors.email?.message}
      >
        {(control) => (
          <Input
            {...control}
            {...form.register("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
          />
        )}
      </Field>
      <Field label={formCopy.fields.company} optional error={errors.company?.message}>
        {(control) => (
          <Input {...control} {...form.register("company")} autoComplete="organization" />
        )}
      </Field>
      <Field
        label={formCopy.fields.phone}
        optional
        hint={formCopy.hints.phone}
        error={errors.phone?.message}
      >
        {(control) => (
          <Input {...control} {...form.register("phone")} type="tel" autoComplete="tel" />
        )}
      </Field>
      <Field label={formCopy.fields.referral} optional error={errors.referral?.message}>
        {(control) => <Input {...control} {...form.register("referral")} />}
      </Field>
      <Honeypot inputRef={honeypot} />
      <Turnstile onToken={onTurnstileToken} />
      <FormAlert message={formError} />
    </StepFrame>
  );
}
