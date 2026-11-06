"use client";

import type { LucideIcon } from "lucide-react";
import { DropdownMenu as RadixDropdownMenu } from "radix-ui";
import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";

type MenuItem = {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  disabled?: boolean;
};

type DropdownMenuProps = {
  /** The button that opens the menu; rendered as-is. */
  trigger: ReactNode;
  items: readonly MenuItem[];
  align?: "start" | "end";
};

/** A menu of actions opened from a button. Arrow keys move, Escape closes. */
export default function DropdownMenu({ trigger, items, align = "end" }: DropdownMenuProps) {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger asChild>{trigger}</RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content
          align={align}
          sideOffset={6}
          className="z-50 min-w-48 rounded-card border border-line bg-card p-1 data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in"
        >
          {items.map((item) => (
            <RadixDropdownMenu.Item
              key={item.label}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className="flex cursor-pointer items-center gap-2 rounded-control px-3 py-2 type-small text-ink outline-none data-disabled:cursor-not-allowed data-disabled:text-muted data-highlighted:bg-card-2"
            >
              {item.icon ? <Icon icon={item.icon} size={16} className="text-body" /> : null}
              {item.label}
            </RadixDropdownMenu.Item>
          ))}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
}
