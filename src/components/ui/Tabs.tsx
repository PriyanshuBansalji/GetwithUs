"use client";

import { Tabs as RadixTabs } from "radix-ui";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tab = { value: string; label: string; content: ReactNode };

type TabsProps = {
  tabs: readonly Tab[];
  defaultValue?: string;
  /** Accessible name for the tab list. */
  label: string;
  className?: string;
};

/** Switches between panels of related content. Arrow keys move between tabs. */
export default function Tabs({ tabs, defaultValue, label, className }: TabsProps) {
  return (
    <RadixTabs.Root defaultValue={defaultValue ?? tabs[0]?.value} className={className}>
      <RadixTabs.List aria-label={label} className="flex gap-1 border-b border-line">
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "-mb-px border-b-2 border-transparent px-3 py-2.5 type-small font-medium text-body transition-colors duration-150 ease-out",
              "hover:text-ink data-[state=active]:border-accent data-[state=active]:text-ink",
            )}
          >
            {tab.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {tabs.map((tab) => (
        <RadixTabs.Content key={tab.value} value={tab.value} className="pt-6">
          {tab.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
