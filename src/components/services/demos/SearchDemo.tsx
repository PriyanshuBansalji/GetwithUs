"use client";

import { Search } from "lucide-react";
import { useRef, useState } from "react";
import { sleep } from "@/components/motion/sleep";
import { useDemoLoop } from "@/components/motion/useDemoLoop";
import { EXAMPLE_DATA_LABEL, marketingDemo, searchDemo } from "@/content/demos";
import { cn } from "@/lib/cn";

type View = { typed: number; results: boolean; risen: boolean; chart: boolean };

const FULL: View = { typed: searchDemo.query.length, results: true, risen: true, chart: true };
const START: View = { typed: 0, results: false, risen: false, chart: false };

const ROW = 64;
/** The line chart's shape: rising, with a dip, in a 300 x 120 box. No values, only the shape. */
const LINE = "M0 104 C40 98 60 92 90 86 S140 70 170 74 S220 44 250 34 S285 16 300 10";
const BARS = [22, 30, 28, 40, 48, 58, 70, 86];

/**
 * The digital marketing demo: a search box types a local query, the results
 * appear, and the client's result rises to the top; then a dashboard draws its
 * line and bars. Axis labels only, no numbers. Renders finished first, then
 * replays while on screen.
 */
export default function SearchDemo() {
  const frame = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(FULL);
  const set = (patch: Partial<View>) => setView((current) => ({ ...current, ...patch }));

  const { reduce } = useDemoLoop(frame, async (signal) => {
    await sleep(400, signal);
    setView(START);
    await sleep(600, signal);
    for (let typed = 1; typed <= searchDemo.query.length; typed++) {
      set({ typed });
      await sleep(55 + Math.random() * 40, signal);
    }
    await sleep(400, signal);
    set({ results: true });
    await sleep(1300, signal);
    set({ risen: true });
    await sleep(1400, signal);
    set({ chart: true });
    await sleep(5200, signal);
  });

  const current = reduce ? FULL : view;
  const order = current.risen ? [3, 0, 1, 2] : [0, 1, 2, 3];

  return (
    <figure className="m-0">
      <figcaption className="sr-only">{marketingDemo.summary}</figcaption>
      <div ref={frame} aria-hidden="true" className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-card p-5 shadow-lift sm:p-6">
          <div className="flex h-12 items-center gap-3 rounded-full border border-line-2 bg-bg px-4 text-ink">
            <Search size={18} strokeWidth={2} className="text-muted" />
            <span className="truncate">
              {searchDemo.query.slice(0, current.typed)}
              {current.typed < searchDemo.query.length ? <span className="typed-caret" /> : null}
            </span>
          </div>
          <div className="relative mt-5" style={{ height: ROW * marketingDemo.results.length }}>
            {marketingDemo.results.map((result, index) => {
              const mine = index === 3;
              return (
                <div
                  key={result}
                  className={cn(
                    "absolute inset-x-0 flex h-14 items-center gap-3 rounded-[14px] border px-4 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                    mine ? "border-accent bg-accent-soft" : "border-line bg-card",
                    current.results ? "opacity-100" : "opacity-0",
                  )}
                  style={{
                    top: order.indexOf(index) * ROW,
                    transitionDelay: current.results && !current.risen ? `${index * 80}ms` : "0ms",
                  }}
                >
                  <span
                    className={cn(
                      "size-8 shrink-0 rounded-[8px]",
                      mine ? "bg-accent" : "bg-bg-soft",
                    )}
                  />
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate text-[0.9375rem] font-semibold",
                        mine ? "text-ink" : "text-body",
                      )}
                    >
                      {result}
                    </span>
                    <span className="mt-1 block h-1.5 w-32 rounded bg-line" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-card border border-line bg-card p-5 shadow-lift sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-bold text-ink">{marketingDemo.chart.title}</p>
            <div className="flex gap-4 text-sm text-body">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-c-mkt" />
                {marketingDemo.legend[0]}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-c-web" />
                {marketingDemo.legend[1]}
              </span>
            </div>
          </div>
          <div className="relative mt-6 h-[200px] border-b border-l border-line-2">
            <div className="absolute inset-x-3 bottom-0 flex h-[130px] items-end gap-2">
              {BARS.map((height, index) => (
                <span
                  key={height}
                  className="flex-1 origin-bottom rounded-t-[4px] bg-[color-mix(in_srgb,var(--c-web)_32%,transparent)] transition-transform duration-700 ease-out"
                  style={{
                    height: `${height}%`,
                    transform: current.chart ? "scaleY(1)" : "scaleY(0)",
                    transitionDelay: current.chart ? `${index * 60}ms` : "0ms",
                  }}
                />
              ))}
            </div>
            {/* The line draws in left to right by unclipping it: a dash animation
                cannot be used here, because Chrome measures dashes in screen
                pixels for a non-scaling stroke and stopped the line part way. */}
            <svg
              viewBox="0 0 300 120"
              preserveAspectRatio="none"
              className="absolute inset-x-0 top-4 h-[150px] w-full transition-[clip-path] duration-[1400ms] ease-out"
              style={{
                clipPath: current.chart
                  ? "inset(-4px -4px -4px -4px)"
                  : "inset(-4px 100% -4px -4px)",
              }}
            >
              <path
                d={LINE}
                fill="none"
                stroke="var(--c-mkt)"
                strokeWidth="3"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-sm text-muted">
            <span>{marketingDemo.chart.from}</span>
            <span>{marketingDemo.chart.to}</span>
          </div>
        </div>
      </div>
      <p className="example-label mt-4">{EXAMPLE_DATA_LABEL}</p>
    </figure>
  );
}
