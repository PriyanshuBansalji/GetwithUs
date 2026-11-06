import { Check } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { formCopy } from "@/content/forms";
import { cn } from "@/lib/cn";

/** The numbered progress list above the brief. Numbers are right here: the steps are a sequence. */
export default function BriefProgress({ step, done }: { step: number; done: boolean }) {
  const total = formCopy.brief.steps.length;
  return (
    <ol aria-label={formCopy.brief.progressLabel} className="grid gap-2 sm:grid-cols-5 sm:gap-3">
      {formCopy.brief.steps.map((label, index) => {
        const number = index + 1;
        const complete = done || number < step;
        const current = !done && number === step;
        return (
          <li
            key={label}
            aria-current={current ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 border-t-2 pt-3 type-small",
              current
                ? "border-accent text-ink"
                : complete
                  ? "border-muted text-body"
                  : "border-line text-muted",
            )}
          >
            <span className="inline-flex size-5 shrink-0 items-center justify-center font-semibold tabular-nums">
              {complete ? <Icon icon={Check} size={16} label={`${label}, done`} /> : number}
            </span>
            <span className={cn(!current && "max-sm:sr-only")}>{label}</span>
            {current ? (
              <span className="sr-only">{formCopy.brief.stepOf(number, total)}</span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
