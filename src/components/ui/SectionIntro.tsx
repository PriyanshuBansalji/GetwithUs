import type { ReactNode } from "react";
import RevealText from "@/components/motion/RevealText";
import { cn } from "@/lib/cn";

type SectionIntroProps = {
  /** The heading's id, for the section's aria-labelledby. */
  id: string;
  title: string;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
};

/**
 * A section's heading and lead in the final design: a large Bricolage heading
 * that rises in line by line as it enters (RevealText), and a lead under it.
 * Centred by default.
 */
export default function SectionIntro({
  id,
  title,
  lead,
  align = "center",
  className,
}: SectionIntroProps) {
  const centred = align === "center";
  return (
    <div className={cn("max-w-[46rem]", centred && "mx-auto text-center", className)}>
      <RevealText as="h2" id={id} text={title} className="type-h2 text-ink" />
      {lead ? (
        <p className={cn("mt-4 max-w-[36em] type-lead text-body", centred && "mx-auto")}>{lead}</p>
      ) : null}
    </div>
  );
}
