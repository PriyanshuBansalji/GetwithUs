"use client";

import { Check } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type ChipOption = { value: string; label: string; children?: readonly ChipOption[] };

type ChipGroupProps = {
  options: readonly ChipOption[];
  value: readonly string[];
  onChange: (value: string[]) => void;
  name: string;
  id?: string;
  disabled?: boolean;
  className?: string;
};

function Chip({
  option,
  checked,
  onToggle,
  name,
  id,
  disabled,
}: {
  option: ChipOption;
  checked: boolean;
  onToggle: () => void;
  name: string;
  id?: string;
  disabled?: boolean;
}) {
  return (
    <label className="relative inline-flex">
      <input
        id={id}
        type="checkbox"
        name={name}
        value={option.value}
        checked={checked}
        onChange={onToggle}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-control border border-line-2 bg-card px-3.5 type-small text-ink transition-colors duration-150 ease-out",
          "peer-checked:border-accent peer-checked:bg-card-2 hover:border-muted",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
          "peer-disabled:cursor-not-allowed peer-disabled:text-muted",
        )}
      >
        <span className={cn("text-accent", checked ? "inline-flex" : "hidden")}>
          <Icon icon={Check} size={16} />
        </span>
        {option.label}
      </span>
    </label>
  );
}

/**
 * Multi-select pills backed by native checkboxes, so keyboard and screen reader
 * behavior come from the platform. Options can carry nested sub-options.
 */
export default function ChipGroup({
  options,
  value,
  onChange,
  name,
  id,
  disabled,
  className,
}: ChipGroupProps) {
  const selected = new Set(value);
  const toggle = (optionValue: string) => {
    const next = new Set(selected);
    if (next.has(optionValue)) next.delete(optionValue);
    else next.add(optionValue);
    onChange(Array.from(next));
  };

  return (
    <div className={cn("grid gap-3", className)}>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <Chip
            key={option.value}
            option={option}
            id={index === 0 ? id : undefined}
            name={name}
            disabled={disabled}
            checked={selected.has(option.value)}
            onToggle={() => toggle(option.value)}
          />
        ))}
      </div>
      {options
        .filter((option) => option.children?.length)
        .map((option) => (
          <div
            key={option.value}
            className="flex flex-wrap items-center gap-2 border-l-2 border-line pl-4"
          >
            <span className="mr-1 type-small text-body">{option.label}:</span>
            {option.children?.map((child) => (
              <Chip
                key={child.value}
                option={child}
                name={name}
                disabled={disabled}
                checked={selected.has(child.value)}
                onToggle={() => toggle(child.value)}
              />
            ))}
          </div>
        ))}
    </div>
  );
}
