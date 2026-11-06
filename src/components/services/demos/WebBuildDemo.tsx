"use client";

import { Check, Lock, PenLine } from "lucide-react";
import { useRef, useState } from "react";
import { sleep } from "@/components/motion/sleep";
import { useDemoLoop } from "@/components/motion/useDemoLoop";
import { EXAMPLE_DATA_LABEL, buildDemo, cmsDemo } from "@/content/demos";
import { cn } from "@/lib/cn";

type View = {
  /** Characters of the domain typed into the URL bar. */
  url: number;
  /** 0 blank, 1 wireframe, 2 content, 3 live. */
  stage: number;
  ticks: number;
  heading: string;
  /** The CMS field is being edited (caret shown). */
  editing: boolean;
  published: boolean;
};

const FULL: View = {
  url: buildDemo.domain.length,
  stage: 3,
  ticks: buildDemo.checks.length,
  heading: cmsDemo.after,
  editing: false,
  published: true,
};

const START: View = {
  url: 0,
  stage: 0,
  ticks: 0,
  heading: cmsDemo.before,
  editing: false,
  published: false,
};

function Block({ stage, className }: { stage: number; className: string }) {
  return (
    <span
      className={cn(
        "block rounded-[6px] transition-all duration-500 ease-out",
        stage === 0 && "opacity-0",
        stage === 1 && "border border-dashed border-line-2 bg-transparent",
        stage >= 2 && "border border-transparent",
        className,
      )}
    />
  );
}

/**
 * The web development demo: the URL bar types a domain, the page draws in as a
 * wireframe, fills with content, and a checklist ticks; then the heading is
 * edited in a CMS field and the live page follows it. Renders finished first
 * (the reduced motion and screen reader view), then replays while on screen.
 */
export default function WebBuildDemo() {
  const frame = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(FULL);
  const set = (patch: Partial<View>) => setView((current) => ({ ...current, ...patch }));

  const { reduce } = useDemoLoop(frame, async (signal) => {
    await sleep(400, signal);
    setView(START);
    await sleep(500, signal);
    for (let count = 1; count <= buildDemo.domain.length; count++) {
      set({ url: count });
      await sleep(55 + Math.random() * 35, signal);
    }
    await sleep(300, signal);
    set({ stage: 1 });
    await sleep(1000, signal);
    set({ stage: 2 });
    await sleep(900, signal);
    set({ stage: 3 });
    for (let tick = 1; tick <= buildDemo.checks.length; tick++) {
      await sleep(450, signal);
      set({ ticks: tick });
    }
    await sleep(900, signal);
    set({ editing: true });
    for (let length = cmsDemo.before.length; length >= 0; length--) {
      set({ heading: cmsDemo.before.slice(0, length) });
      await sleep(26, signal);
    }
    for (let length = 1; length <= cmsDemo.after.length; length++) {
      set({ heading: cmsDemo.after.slice(0, length) });
      await sleep(55 + Math.random() * 30, signal);
    }
    await sleep(500, signal);
    set({ editing: false, published: true });
    await sleep(4500, signal);
  });

  const current = reduce ? FULL : view;
  const { stage } = current;

  return (
    <figure className="m-0">
      <figcaption className="sr-only">{buildDemo.summary}</figcaption>
      <div
        ref={frame}
        aria-hidden="true"
        className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]"
      >
        <div className="overflow-hidden rounded-card border border-line bg-card shadow-lift">
          <div className="flex h-11 items-center gap-2 border-b border-line px-4">
            <span className="size-2.5 rounded-full bg-[#f26b5b]" />
            <span className="size-2.5 rounded-full bg-[#f5b54a]" />
            <span className="size-2.5 rounded-full bg-[#3ec27a]" />
            <span className="ml-3 flex h-7 flex-1 items-center gap-2 rounded-full bg-bg-soft px-3 font-mono text-[0.8125rem] text-body">
              <Lock size={12} strokeWidth={2} />
              {buildDemo.domain.slice(0, current.url)}
              {current.url < buildDemo.domain.length ? <span className="typed-caret" /> : null}
            </span>
          </div>
          <div className="grid gap-5 p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <Block stage={stage} className={cn("h-6 w-24", stage >= 2 && "bg-ink")} />
              <div className="flex gap-3">
                {[0, 1, 2].map((item) => (
                  <Block
                    key={item}
                    stage={stage}
                    className={cn("h-3 w-12", stage >= 2 && "bg-line")}
                  />
                ))}
              </div>
            </div>
            <div className="grid items-center gap-6 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-3">
                {stage >= 2 ? (
                  <p className="min-h-[2.4em] font-display text-[1.6rem] leading-[1.15] font-extrabold tracking-[-0.02em] text-ink">
                    {current.heading}
                    {current.editing ? <span className="typed-caret text-accent" /> : null}
                  </p>
                ) : (
                  <Block stage={stage} className="h-[3.7rem] w-full" />
                )}
                <Block stage={stage} className={cn("h-2.5 w-[92%]", stage >= 2 && "bg-line")} />
                <Block stage={stage} className={cn("h-2.5 w-[70%]", stage >= 2 && "bg-line")} />
                <Block
                  stage={stage}
                  className={cn("mt-2 h-10 w-36 rounded-full", stage >= 2 && "bg-accent")}
                />
              </div>
              <Block
                stage={stage}
                className={cn("aspect-[4/3] w-full rounded-[14px]", stage >= 2 && "bg-accent-soft")}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((item) => (
                <Block
                  key={item}
                  stage={stage}
                  className={cn("h-20 rounded-[12px]", stage >= 2 && "bg-bg-soft")}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="grid content-start gap-6">
          <div className="rounded-card border border-line bg-card p-6 shadow-soft">
            <p className="font-bold text-ink">Before launch</p>
            <ul className="mt-4 grid gap-3">
              {buildDemo.checks.map((check, index) => {
                const done = index < current.ticks;
                return (
                  <li key={check} className="flex items-center gap-3 text-body">
                    <span
                      className={cn(
                        "grid size-6 place-items-center rounded-full border transition-colors duration-300",
                        done ? "border-ok bg-ok text-bg" : "border-line-2 text-transparent",
                      )}
                    >
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span className={cn("transition-colors duration-300", done && "text-ink")}>
                      {check}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-card border border-line bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-bold text-ink">
                <PenLine size={16} strokeWidth={2} className="text-accent" />
                CMS
              </p>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-bold transition-colors duration-300",
                  current.published ? "bg-accent text-accent-ink" : "bg-bg-soft text-muted",
                )}
              >
                {current.published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold text-muted">{cmsDemo.field}</p>
            <p
              className={cn(
                "mt-1.5 min-h-12 rounded-control border bg-bg px-3 py-2.5 text-[0.94rem] text-ink transition-colors duration-200",
                current.editing ? "border-accent" : "border-line-2",
              )}
            >
              {current.heading}
              {current.editing ? <span className="typed-caret" /> : null}
            </p>
          </div>
        </div>
      </div>
      <p className="example-label mt-4">{EXAMPLE_DATA_LABEL}</p>
    </figure>
  );
}
