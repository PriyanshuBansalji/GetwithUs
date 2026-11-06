"use client";

import { Check } from "lucide-react";
import { Checkbox as RadixCheckbox } from "radix-ui";
import { useId, type ComponentProps, type ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type CheckboxProps = ComponentProps<typeof RadixCheckbox.Root> & { label: ReactNode };

/** A single checkbox with its label to the right. */
export default function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  const fallbackId = useId();
  const controlId = id ?? fallbackId;
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <RadixCheckbox.Root
        id={controlId}
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-tag border border-line-2 bg-card transition-colors duration-150 ease-out hover:border-muted aria-invalid:border-err data-[state=checked]:border-accent data-[state=checked]:bg-accent"
        {...props}
      >
        <RadixCheckbox.Indicator className="text-accent-ink">
          <Icon icon={Check} size={16} />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label htmlFor={controlId} className="cursor-pointer text-ink">
        {label}
      </label>
    </div>
  );
}
