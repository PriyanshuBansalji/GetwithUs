"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import StepFrame from "@/components/forms/steps/StepFrame";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { formCopy } from "@/content/forms";
import { briefStepSchemas } from "@/features/leads/schema";
import { useBriefStore } from "@/stores/brief.store";

/** Step 2: what to build and why, plus an optional existing site or app. */
export default function ProjectStep() {
  const draft = useBriefStore((state) => state.draft);
  const update = useBriefStore((state) => state.update);
  const goTo = useBriefStore((state) => state.goTo);
  const form = useForm({
    resolver: zodResolver(briefStepSchemas.project),
    defaultValues: { description: draft.description, existingUrl: draft.existingUrl },
    mode: "onChange",
  });
  const { errors, touchedFields, isValid } = form.formState;

  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) =>
          update({ description: values.description ?? "", existingUrl: values.existingUrl ?? "" }),
      }),
    [form, update],
  );

  return (
    <StepFrame
      title={formCopy.brief.steps[1]}
      canContinue={isValid}
      onBack={() => goTo(1)}
      onSubmit={form.handleSubmit(() => goTo(3))}
    >
      <Field
        label={formCopy.fields.description}
        error={touchedFields.description ? errors.description?.message : undefined}
      >
        {(control) => (
          <Textarea {...control} {...form.register("description")} rows={7} maxLength={3000} />
        )}
      </Field>
      <Field label={formCopy.fields.existingUrl} optional error={errors.existingUrl?.message}>
        {(control) => (
          <Input
            {...control}
            {...form.register("existingUrl")}
            inputMode="url"
            autoComplete="url"
            placeholder="example.com"
          />
        )}
      </Field>
    </StepFrame>
  );
}
