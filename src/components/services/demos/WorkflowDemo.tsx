"use client";

import { Bell, Bot, CalendarCheck, Contact, MessageCircle, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { sleep } from "@/components/motion/sleep";
import { useDemoLoop } from "@/components/motion/useDemoLoop";
import { EXAMPLE_DATA_LABEL, workflowDemo } from "@/content/demos";
import { cn } from "@/lib/cn";

const ICONS: Record<(typeof workflowDemo)[number]["node"], LucideIcon> = {
  whatsapp: MessageCircle,
  agent: Bot,
  crm: Contact,
  calendar: CalendarCheck,
  team: Bell,
};

type View = { lit: number; typed: number };

const COUNT = workflowDemo.length;
const FULL: View = { lit: COUNT, typed: workflowDemo[COUNT - 1].log.length };

/**
 * The agentic automation demo: a workflow run. Each node lights in turn, from
 * the WhatsApp message to the team notification, while the log panel types
 * the matching line. Renders finished first, then replays while on screen.
 */
export default function WorkflowDemo() {
  const frame = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(FULL);

  const { reduce, active } = useDemoLoop(frame, async (signal) => {
    await sleep(400, signal);
    setView({ lit: 0, typed: 0 });
    await sleep(700, signal);
    for (let node = 1; node <= COUNT; node++) {
      setView({ lit: node, typed: 0 });
      const line = workflowDemo[node - 1].log;
      for (let typed = 1; typed <= line.length; typed++) {
        setView({ lit: node, typed });
        await sleep(18 + Math.random() * 18, signal);
      }
      await sleep(650, signal);
    }
    await sleep(4000, signal);
  });

  const current = reduce ? FULL : view;

  return (
    <figure className="m-0">
      <figcaption className="sr-only">
        Example workflow run:{" "}
        {workflowDemo.map((step) => `${step.label} (${step.log})`).join(", then ")}.
      </figcaption>
      <div
        ref={frame}
        aria-hidden="true"
        data-paused={active ? undefined : ""}
        className="grid gap-6"
      >
        <ol className="grid gap-3 sm:grid-cols-5">
          {workflowDemo.map((step, index) => {
            const NodeIcon = ICONS[step.node];
            const lit = index < current.lit;
            const now = index === current.lit - 1;
            return (
              <li key={step.node} className="relative">
                {index < COUNT - 1 ? (
                  <span
                    className={cn(
                      "absolute top-8 left-[calc(50%+34px)] hidden h-0.5 w-[calc(100%-56px)] sm:block",
                      index < current.lit - 1
                        ? "bg-accent"
                        : "bg-[repeating-linear-gradient(90deg,var(--line-2)_0_6px,transparent_6px_12px)]",
                    )}
                  />
                ) : null}
                <div className="flex items-center gap-4 sm:flex-col sm:text-center">
                  <span
                    className={cn(
                      "relative grid size-16 shrink-0 place-items-center rounded-[18px] border transition-all duration-500",
                      lit
                        ? "border-accent bg-accent text-accent-ink shadow-[0_14px_34px_var(--glow)]"
                        : "border-line-2 bg-card text-muted",
                      now && "scale-110",
                    )}
                  >
                    <NodeIcon size={26} strokeWidth={1.7} />
                  </span>
                  <span
                    className={cn(
                      "text-[0.9375rem] font-semibold transition-colors",
                      lit ? "text-ink" : "text-muted",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="overflow-hidden rounded-card border border-white/10 bg-ed-bg font-mono text-[0.8125rem] text-[#d6deeb] shadow-lift sm:text-sm">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-[#8b9ab0]">
            <span className="size-2 rounded-full bg-[#3ee08a]" />
            workflow.log
          </div>
          <div className="grid min-h-[190px] content-start gap-1.5 px-5 py-4">
            {workflowDemo.slice(0, current.lit).map((step, index) => {
              const last = index === current.lit - 1;
              const text = last ? step.log.slice(0, current.typed) : step.log;
              return (
                <p key={step.node} className="whitespace-pre-wrap">
                  <span className="text-[#3ee08a]">✓ </span>
                  {text}
                  {last && current.typed < step.log.length ? (
                    <span className="code-caret ml-0.5" />
                  ) : null}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <p className="example-label mt-4">{EXAMPLE_DATA_LABEL}</p>
    </figure>
  );
}
