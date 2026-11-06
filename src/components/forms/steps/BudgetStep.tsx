"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import StepFrame from "@/components/forms/steps/StepFrame";
import Field from "@/components/ui/Field";
import RadioGroup from "@/components/ui/RadioGroup";
import { budgetOptions, timelineOptions } from "@/content/brief";
import { formCopy } from "@/content/forms";
import { briefStepSchemas } from "@/features/leads/schema";
import { useBriefStore } from "@/stores/brief.store";

/** Step 3: a budget range (or not sure yet) and a timeline. */
export default function BudgetStep() {
  const draft = useBriefStore((state) => state.draft);
  const update = useBriefStore((state) => state.update);
  const goTo = useBriefStore((state) => state.goTo);
  const form = useForm({
    resolver: zodResolver(briefStepSchemas.budget),
    defaultValues: { budgetRange: draft.budgetRange, timeline: draft.timeline },
    mode: "onChange",
  });

  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) =>
          update({ budgetRange: values.budgetRange ?? "", timeline: values.timeline ?? "" }),
      }),
    [form, update],
  );

  return (
    <StepFrame
      title={formCopy.brief.steps[2]}
      canContinue={form.formState.isValid}
      onBack={() => goTo(2)}
      onSubmit={form.handleSubmit(() => goTo(4))}
    >
      <Field label={formCopy.fields.budgetRange} group>
        {(control) => (
          <Controller
            control={form.control}
            name="budgetRange"
            render={({ field }) => (
              <RadioGroup
                id={control.id}
                aria-required
                name={field.name}
                options={budgetOptions}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        )}
      </Field>
      <Field label={formCopy.fields.timeline} group>
        {(control) => (
          <Controller
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <RadioGroup
                id={control.id}
                aria-required
                name={field.name}
                options={timelineOptions}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        )}
      </Field>
    </StepFrame>
  );
}
