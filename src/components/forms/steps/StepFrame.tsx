import type { FormEvent, ReactNode } from "react";
import Button from "@/components/ui/Button";
import { formCopy } from "@/content/forms";

type StepFrameProps = {
  title: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack?: () => void;
  /** Continue stays disabled until the step validates. */
  canContinue: boolean;
  submitLabel?: string;
  loading?: boolean;
  children: ReactNode;
};

/** One brief step: its heading, its fields, and Back and Continue. Back never loses data. */
export default function StepFrame({
  title,
  onSubmit,
  onBack,
  canContinue,
  submitLabel = formCopy.continue,
  loading = false,
  children,
}: StepFrameProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6">
      <h2 data-step-heading tabIndex={-1} className="type-h3 outline-none">
        {title}
      </h2>
      {children}
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
        {onBack ? (
          <Button type="button" variant="secondary" onClick={onBack}>
            {formCopy.back}
          </Button>
        ) : null}
        <Button type="submit" disabled={!canContinue} loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
