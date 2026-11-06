"use client";

import { lazy, Suspense, useSyncExternalStore, type ReactNode } from "react";

// Split points: each form's code (react-hook-form, the shared Zod schemas) loads after hydration.
const forms = {
  contact: lazy(() => import("@/components/forms/LeadForm")),
  brief: lazy(() => import("@/components/forms/BriefWizard")),
};

const noSubscription = () => () => undefined;

/**
 * Renders `children` (the server-rendered FormPreview) for the first paint and
 * hydration, then loads the real form and swaps it in. Keeps form code out of
 * the page's initial JavaScript; the form is ready a moment after the page is.
 */
export default function DeferredForm({
  form,
  children,
}: {
  form: keyof typeof forms;
  children: ReactNode;
}) {
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  if (!hydrated) return children;
  const Form = forms[form];
  return (
    <Suspense fallback={children}>
      <Form />
    </Suspense>
  );
}
