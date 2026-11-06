"use client";

import { X } from "lucide-react";
import { Dialog as RadixDialog } from "radix-ui";
import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog; rendered as-is. */
  trigger?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

/** A centered modal. Traps focus, closes on Escape and on the close button. */
export default function Dialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger> : null}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-bg/80 data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in" />
        <RadixDialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-48px)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-card border border-line bg-card p-6",
            "data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <RadixDialog.Title className="type-h4 text-ink">{title}</RadixDialog.Title>
            <RadixDialog.Close
              className="-m-2 rounded-control p-2 text-body transition-colors duration-150 ease-out hover:bg-card-2"
              aria-label="Close"
            >
              <Icon icon={X} size={20} />
            </RadixDialog.Close>
          </div>
          {description ? (
            <RadixDialog.Description className="mt-2 text-body">
              {description}
            </RadixDialog.Description>
          ) : (
            <RadixDialog.Description className="sr-only">{title}</RadixDialog.Description>
          )}
          {children ? <div className="mt-6">{children}</div> : null}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
