"use client";

import { Contact, CreditCard, Factory, Mail, Sheet, Server, type LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { sleep } from "@/components/motion/sleep";
import { useDemoLoop } from "@/components/motion/useDemoLoop";
import { EXAMPLE_DATA_LABEL, deployLog, hubDemo } from "@/content/demos";
import { cn } from "@/lib/cn";

const ICONS: LucideIcon[] = [Contact, Sheet, Factory, CreditCard, Mail];

/** Spoke ends around the hub, in percent of the stage. */
const SPOKES = [
  { x: 16, y: 20 },
  { x: 84, y: 20 },
  { x: 92, y: 66 },
  { x: 50, y: 92 },
  { x: 8, y: 66 },
];
const HUB = { x: 50, y: 48 };

/**
 * The custom software demo: the client's app at the centre with spokes to
 * the CRM, sheets, ERP, payments, and email, and data flowing along them;
 * beside it a terminal types the deploy log. Renders finished first, then
 * replays the log while on screen.
 */
export default function HubDemo() {
  const frame = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<number>(deployLog.length);
  const [typed, setTyped] = useState(0);

  const { reduce, active } = useDemoLoop(frame, async (signal) => {
    await sleep(400, signal);
    setLines(0);
    setTyped(0);
    await sleep(600, signal);
    for (let line = 1; line <= deployLog.length; line++) {
      const text = deployLog[line - 1];
      setLines(line);
      const command = text.startsWith("$");
      for (let count = 1; count <= text.length; count++) {
        setTyped(count);
        if (command) await sleep(32 + Math.random() * 30, signal);
      }
      await sleep(command ? 350 : 650, signal);
    }
    await sleep(4500, signal);
  });

  const shownLines = reduce ? deployLog.length : lines;

  return (
    <figure className="m-0">
      <figcaption className="sr-only">{hubDemo.summary}</figcaption>
      <div
        ref={frame}
        aria-hidden="true"
        data-paused={active ? undefined : ""}
        className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        <div className="dots-bg relative aspect-[4/3] rounded-card border border-line bg-bg-soft">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          >
            {SPOKES.map((spoke) => (
              <line
                key={`${spoke.x}-${spoke.y}`}
                x1={spoke.x}
                y1={spoke.y}
                x2={HUB.x}
                y2={HUB.y}
                className="hub-wire"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          <div
            className="absolute grid -translate-x-1/2 -translate-y-1/2 justify-items-center gap-1.5"
            style={{ left: `${HUB.x}%`, top: `${HUB.y}%` }}
          >
            <span className="grid size-20 place-items-center rounded-[22px] bg-accent text-accent-ink shadow-[0_18px_44px_var(--glow)]">
              <Server size={34} strokeWidth={1.6} />
            </span>
            <span className="rounded-full bg-card px-3 py-1 text-sm font-bold text-ink shadow-soft">
              {hubDemo.centre}
            </span>
          </div>
          {hubDemo.spokes.map((name, index) => {
            const SpokeIcon = ICONS[index];
            const spoke = SPOKES[index];
            return (
              <div
                key={name}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-line bg-card py-1.5 pr-3.5 pl-1.5 shadow-soft"
                // Clamped so a chip centred near an edge never hangs out of the frame on a phone.
                style={{
                  left: `clamp(3.75rem, ${spoke.x}%, calc(100% - 3.75rem))`,
                  top: `${spoke.y}%`,
                }}
              >
                <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-accent">
                  <SpokeIcon size={16} strokeWidth={1.9} />
                </span>
                <span className="text-sm font-semibold whitespace-nowrap text-ink">{name}</span>
              </div>
            );
          })}
        </div>
        <div className="overflow-hidden rounded-card border border-white/10 bg-ed-bg font-mono text-[0.8125rem] text-[#d6deeb] shadow-lift sm:text-sm">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-[#8b9ab0]">
            <span className="size-2.5 rounded-full bg-[#f26b5b]" />
            <span className="size-2.5 rounded-full bg-[#f5b54a]" />
            <span className="size-2.5 rounded-full bg-[#3ec27a]" />
            <span className="ml-2">deploy</span>
          </div>
          <div className="grid min-h-[250px] content-start gap-1.5 px-5 py-4">
            {deployLog.slice(0, shownLines).map((line, index) => {
              const last = !reduce && index === shownLines - 1;
              const text = last ? line.slice(0, typed) : line;
              const command = line.startsWith("$");
              return (
                <p
                  key={line}
                  className={cn(
                    command ? "text-[#d6deeb]" : "text-[#8b9ab0]",
                    line.includes("passed") && "text-[#3ee08a]",
                  )}
                >
                  {text}
                  {last && typed < line.length ? <span className="code-caret ml-0.5" /> : null}
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
