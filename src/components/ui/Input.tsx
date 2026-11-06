import type { ComponentProps } from "react";
import { controlClasses } from "@/components/ui/styles";
import { cn } from "@/lib/cn";

/** Single-line text input. Pair with Field for the label and error. */
export default function Input({ className, type = "text", ...props }: ComponentProps<"input">) {
  return <input type={type} className={cn(controlClasses, "h-11", className)} {...props} />;
}
