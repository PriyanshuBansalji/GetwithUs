"use client";

import { Tooltip as RadixTooltip } from "radix-ui";
import type { ReactNode } from "react";

type TooltipProps = {
  content: ReactNode;
  /** A focusable element; the tooltip shows on hover and on keyboard focus. */
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
};

/** Supplementary text on hover or focus. Never the only place information lives. */
export default function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={300}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            sideOffset={6}
            className="z-50 max-w-xs rounded-control border border-line-2 bg-card-2 px-2.5 py-1.5 type-small text-ink data-[state=closed]:animate-menu-out data-[state=delayed-open]:animate-menu-in"
          >
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
