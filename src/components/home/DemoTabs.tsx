"use client";

import { ArrowRight, Check, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Tabs } from "radix-ui";
import CallDemo from "@/components/motion/CallDemo";
import ChatDemo from "@/components/motion/ChatDemo";
import Icon from "@/components/ui/Icon";
import { callDemo, whatsappDemo } from "@/content/demos";

export type DemoTab = {
  value: "whatsapp" | "calling";
  label: string;
  title: string;
  points: readonly string[];
  link: { label: string; href: string };
};

const ICONS = { whatsapp: MessageCircle, calling: Phone } as const;

/**
 * "See it working": a two-tab switch between the WhatsApp bot demo and the
 * calling agent demo, each with three points from its product page and a link
 * there. Only the open tab's demo is mounted, so only one plays.
 */
export default function DemoTabs({ tabs }: { tabs: readonly DemoTab[] }) {
  return (
    <Tabs.Root defaultValue={tabs[0]?.value} className="mt-12">
      <Tabs.List
        aria-label="Agent demos"
        className="mx-auto flex w-fit gap-1 rounded-full border border-line bg-card p-1 shadow-soft"
      >
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-[0.94rem] font-semibold whitespace-nowrap text-body transition-colors duration-200 ease-out hover:text-ink data-[state=active]:bg-accent data-[state=active]:text-accent-ink sm:px-5 sm:text-base"
          >
            <Icon icon={ICONS[tab.value]} size={16} />
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.value}
          value={tab.value}
          className="mt-10 grid min-h-[640px] items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        >
          <div className="lg:pl-6">
            <h3 className="type-h3 text-ink">{tab.title}</h3>
            <ul className="mt-6 grid gap-4">
              {tab.points.map((point) => (
                <li key={point} className="flex gap-3 text-body">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={tab.link.href}
              className="group mt-7 inline-flex items-center gap-1.5 font-semibold text-accent"
            >
              {tab.link.label}
              <Icon
                icon={ArrowRight}
                size={16}
                className="transition-transform duration-150 ease-out group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          {tab.value === "whatsapp" ? (
            <ChatDemo script={whatsappDemo} className="mx-auto w-full max-w-[420px]" />
          ) : (
            <CallDemo script={callDemo} className="mx-auto w-full max-w-[460px]" />
          )}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
