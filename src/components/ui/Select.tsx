import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { controlClasses } from "@/components/ui/styles";
import { cn } from "@/lib/cn";

type SelectOption = { value: string; label: string };

type SelectProps = Omit<ComponentProps<"select">, "children"> & {
  options: readonly SelectOption[];
  /** Shown as a first, empty choice. */
  placeholder?: string;
};

/** A native select: keyboard, screen reader, and mobile behavior come from the platform. */
export default function Select({ options, placeholder, className, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select className={cn(controlClasses, "h-11 appearance-none pr-10", className)} {...props}>
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={1.75}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-body"
      />
    </div>
  );
}
