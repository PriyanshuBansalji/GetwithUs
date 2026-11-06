import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type SectionProps = ComponentProps<"section"> & {
  /** Drop the default vertical padding. */
  flush?: boolean;
};

/** A page section with the standard vertical rhythm: 64 px on mobile, 96 px from 768 px. */
export default function Section({ flush = false, className, ...props }: SectionProps) {
  return <section className={cn(!flush && "py-16 md:py-24", className)} {...props} />;
}
