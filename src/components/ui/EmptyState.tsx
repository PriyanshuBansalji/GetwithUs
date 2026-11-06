import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/** Shown when a list has nothing in it. Invites the next action instead of apologizing. */
export default function EmptyState({ icon, title, children, action, className }: EmptyStateProps) {
  return (
    <div className={cn("rounded-card border border-line bg-card p-6 md:p-8", className)}>
      {icon ? <Icon icon={icon} size={24} className="mb-4 text-accent" /> : null}
      <p className="type-h4 text-ink">{title}</p>
      {children ? <div className="mt-2 max-w-[60ch] text-body">{children}</div> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
