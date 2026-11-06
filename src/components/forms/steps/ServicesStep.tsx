"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { serviceOptions } from "@/components/forms/service-options";
import StepFrame from "@/components/forms/steps/StepFrame";
import ChipGroup from "@/components/ui/ChipGroup";
import Field from "@/components/ui/Field";
import { formCopy } from "@/content/forms";
import type { ServiceSlug } from "@/content/types";
import { briefStepSchemas } from "@/features/leads/schema";
import { useBriefStore } from "@/stores/brief.store";

/** Step 1: which services. At least one; the agentic products are nested chips. */
export default function ServicesStep() {
  const services = useBriefStore((state) => state.draft.services);
  const update = useBriefStore((state) => state.update);
  const goTo = useBriefStore((state) => state.goTo);
  const form = useForm({
    resolver: zodResolver(briefStepSchemas.services),
    // The draft stores plain strings; the resolver checks each one is a real service.
    defaultValues: { services: services as ServiceSlug[] },
    mode: "onChange",
  });

  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) => update({ services: (values.services ?? []) as string[] }),
      }),
    [form, update],
  );

  return (
    <StepFrame
      title={formCopy.brief.steps[0]}
      canContinue={form.formState.isValid}
      onSubmit={form.handleSubmit(() => goTo(2))}
    >
      {/* The step heading already asks "What do you need?": the legend stays for screen readers only. */}
      <Field
        label={formCopy.fields.services}
        group
        labelHidden
        error={form.formState.errors.services?.message}
      >
        {(control) => (
          <Controller
            control={form.control}
            name="services"
            render={({ field }) => (
              <ChipGroup
                id={control.id}
                name={field.name}
                options={serviceOptions}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        )}
      </Field>
    </StepFrame>
  );
}
