import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type ErrorStateProps = {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  /** A request ID or error digest the user can quote. */
  reference?: string;
  className?: string;
};

/** Shown when loading something failed. Says what happened and what to do next. */
export default function ErrorState({
  title,
  children,
  action,
  reference,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-card border border-err/40 bg-card p-6 md:p-8", className)}
    >
      <div className="flex items-start gap-3">
        <Icon icon={CircleAlert} size={20} className="mt-0.5 text-err" />
        <div>
          <p className="type-h4 text-ink">{title}</p>
          {children ? <div className="mt-2 max-w-[60ch] text-body">{children}</div> : null}
          {reference ? (
            <p className="mt-3 type-small text-body">
              Reference: <span className="text-ink tabular-nums">{reference}</span>
            </p>
          ) : null}
          {action ? <div className="mt-6">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
