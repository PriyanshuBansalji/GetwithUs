import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Props a control receives from its Field so label, hint, and error are wired up. */
type FieldControlProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
};

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  /** Adds "(optional)" after the label. Required is the default and is not marked. */
  optional?: boolean;
  required?: boolean;
  /** Use a fieldset and legend for groups (radio groups, chip groups). */
  group?: boolean;
  /** Keeps the label for assistive technology but hides it, when a heading right above says the same. */
  labelHidden?: boolean;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
};

/**
 * Renders a visible label, an optional hint, the control, and an error message,
 * with `aria-describedby` and `aria-invalid` wired to the control. The error
 * region is always present and polite, so new errors are announced.
 */
export default function Field({
  label,
  hint,
  error,
  optional = false,
  required = false,
  group = false,
  labelHidden = false,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  // In a group the fieldset carries the description; repeating it on the control would read it twice.
  const control = children({
    id,
    "aria-describedby": group ? undefined : describedBy || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-required": required ? true : undefined,
  });

  const labelText = (
    <>
      {label}
      {optional ? <span className="font-normal text-body"> (optional)</span> : null}
    </>
  );

  const body = (
    <>
      {hint ? (
        <p id={hintId} className="mt-1 type-small text-body">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{control}</div>
      <p id={errorId} aria-live="polite" className="mt-1.5 type-small text-err empty:hidden">
        {error ?? ""}
      </p>
    </>
  );

  if (group) {
    return (
      <fieldset className={cn("min-w-0", className)} aria-describedby={describedBy || undefined}>
        <legend className={labelHidden ? "sr-only" : "type-body font-medium text-ink"}>
          {labelText}
        </legend>
        {body}
      </fieldset>
    );
  }

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={labelHidden ? "sr-only" : "block type-body font-medium text-ink"}
      >
        {labelText}
      </label>
      {body}
    </div>
  );
}
