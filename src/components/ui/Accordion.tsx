"use client";

import { Plus } from "lucide-react";
import { Accordion as RadixAccordion } from "radix-ui";
import type { ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type AccordionItem = { id: string; question: string; answer: ReactNode };

type AccordionProps = { items: readonly AccordionItem[]; className?: string };

/**
 * Questions that expand to answers, each in its own rounded card. Each trigger
 * sits in an h3, so FAQs keep a heading outline.
 */
export default function Accordion({ items, className }: AccordionProps) {
  return (
    <RadixAccordion.Root type="multiple" className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <RadixAccordion.Item
          key={item.id}
          value={item.id}
          className="rounded-[18px] border border-line bg-card px-6 transition-shadow duration-200 ease-out data-[state=open]:shadow-soft"
        >
          <RadixAccordion.Header className="m-0">
            <RadixAccordion.Trigger className="group flex w-full items-center justify-between gap-4 py-5 text-left text-[1.0625rem] font-semibold text-ink transition-colors duration-150 ease-out hover:text-accent">
              {item.question}
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <Icon
                  icon={Plus}
                  size={16}
                  className="transition-transform duration-200 ease-out group-data-[state=open]:rotate-45"
                />
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="max-w-[68ch] pb-6 text-body">{item.answer}</div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
