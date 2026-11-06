"use client";

import { Dialog as RadixDialog } from "radix-ui";
import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/cn";

type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible name for the panel. Rendered visually hidden. */
  title: string;
  children: ReactNode;
  className?: string;
  /**
   * Where focus goes when the sheet closes. Needed when the sheet is opened by
   * a button outside Radix (no Dialog.Trigger), or focus falls to the page body.
   */
  returnFocusRef?: RefObject<HTMLElement | null>;
};

/** A full-height panel (the mobile menu). Built on Dialog, so it traps focus and closes on Escape. */
export default function Sheet({
  open,
  onOpenChange,
  title,
  children,
  className,
  returnFocusRef,
}: SheetProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-bg/80 data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in" />
        <RadixDialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            if (!returnFocusRef) return;
            event.preventDefault();
            returnFocusRef.current?.focus();
          }}
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-card px-6 pt-3 pb-6",
            "data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in",
            className,
          )}
        >
          <RadixDialog.Title className="sr-only">{title}</RadixDialog.Title>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
