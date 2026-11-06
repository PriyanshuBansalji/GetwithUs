import type { ComponentProps } from "react";
import { controlClasses } from "@/components/ui/styles";
import { cn } from "@/lib/cn";

/** Multi-line text input that grows vertically only. */
export default function Textarea({ className, rows = 6, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(controlClasses, "min-h-32 resize-y py-2.5", className)}
      {...props}
    />
  );
}
