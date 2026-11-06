"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { sleep } from "@/components/motion/sleep";
import { useOnScreen } from "@/components/motion/useOnScreen";
import type { CodeSample } from "@/content/code-samples";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import { caretPosition, sliceTokens, tokenize } from "@/lib/code-tokenizer";

type CodeTypewriterProps = {
  samples: readonly CodeSample[];
  /** Each sample's language mark (TechLogo, rendered on the server), in the same order. */
  logos?: readonly ReactNode[];
  /** Heading and intro: when given, a language list sits beside the editor and drives it too. */
  intro?: ReactNode;
  /** Objects floating around the editor in 3D (FloatingTiles, RotatingSeal). */
  decor?: ReactNode;
  className?: string;
};

const LIGHTS = ["#f26b5b", "#f5b54a", "#3ec27a"];

/**
 * The editor: file tabs, a line gutter, syntax colours, a status bar with the
 * language and caret position, and a terminal line once a file is written. It
 * types each file while on screen, runs it, and moves to the next; choosing a
 * tab or a language row switches at once and holds that file a little longer.
 * The whole editor leans toward the pointer. Screen readers get each file's
 * full code; under reduced motion every file shows complete and nothing loops.
 */
export default function CodeTypewriter({
  samples,
  logos,
  intro,
  decor,
  className,
}: CodeTypewriterProps) {
  const id = useId();
  const stage = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const progress = useRef({ count: 0, term: 0 });
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [term, setTerm] = useState(0);
  const [manual, setManual] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const active = useOnScreen(stage, { threshold: 0.3 });
  const tokens = useMemo(
    () => samples.map((sample) => tokenize(sample.code, sample.language)),
    [samples],
  );

  useEffect(() => {
    if (reduce || !active) return;
    const controller = new AbortController();
    const { signal } = controller;
    const play = async () => {
      const { code } = samples[index];
      let typed = progress.current.count;
      while (typed < code.length) {
        typed += 1;
        progress.current.count = typed;
        setCount(typed);
        await sleep(code[typed - 1] === "\n" ? 90 : 14 + Math.random() * 30, signal);
      }
      if (progress.current.term < 1) {
        await sleep(500, signal);
        progress.current.term = 1;
        setTerm(1);
      }
      if (progress.current.term < 2) {
        await sleep(900, signal);
        progress.current.term = 2;
        setTerm(2);
      }
      await sleep(manual ? 6000 : 2600, signal);
      progress.current = { count: 0, term: 0 };
      setIndex((index + 1) % samples.length);
      setCount(0);
      setTerm(0);
      setManual(false);
    };
    play().catch(() => {
      // Off screen, switched, or unmounted: the next run resumes from `progress`.
    });
    return () => controller.abort();
  }, [active, reduce, index, manual, run, samples]);

  const choose = (next: number, focus = false) => {
    progress.current = { count: 0, term: 0 };
    setIndex(next);
    setCount(0);
    setTerm(0);
    setManual(true);
    setRun((current) => current + 1);
    if (focus) tabs.current[next]?.focus();
  };

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    choose((index + step + samples.length) % samples.length, true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || !fine || !rig.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    rig.current.style.setProperty("--ry", `${(-14 + x * 16).toFixed(2)}deg`);
    rig.current.style.setProperty("--rx", `${(7 - y * 12).toFixed(2)}deg`);
  };

  const sample = samples[index];
  const shown = reduce ? sample.code.length : count;
  const shownTerm = reduce ? 2 : term;
  const caret = caretPosition(sample.code, shown);
  const lines = sample.code.split("\n").length;
  const typing = !reduce && shown < sample.code.length;

  const editor = (
    <div
      ref={stage}
      className="code-stage"
      data-paused={active ? undefined : ""}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        rig.current?.style.removeProperty("--ry");
        rig.current?.style.removeProperty("--rx");
      }}
    >
      <div ref={rig} className="code-rig">
        {decor}
        <div className="code-editor">
          <div className="code-top">
            {LIGHTS.map((color) => (
              <span
                key={color}
                className="code-light"
                style={{ background: color }}
                aria-hidden="true"
              />
            ))}
            <div
              role="tablist"
              aria-label="Example files"
              className="code-tabs"
              onKeyDown={onTabKey}
            >
              {samples.map((entry, position) => (
                <button
                  key={entry.name}
                  ref={(element) => {
                    tabs.current[position] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${position}`}
                  aria-selected={position === index}
                  aria-controls={`${id}-panel`}
                  tabIndex={position === index ? 0 : -1}
                  className="code-tab"
                  onClick={() => choose(position)}
                >
                  {entry.name}
                </button>
              ))}
            </div>
          </div>
          <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${index}`}>
            <pre className="sr-only">{`${sample.label}, ${sample.name}:\n${sample.code}`}</pre>
            <div className="code-body" aria-hidden="true">
              <div className="code-gutter">
                {Array.from({ length: lines }, (_, line) => (
                  <div key={line} data-on={line < caret.line ? "" : undefined}>
                    {line + 1}
                  </div>
                ))}
              </div>
              <pre key={`${index}-${run}`} className="code-text">
                {sliceTokens(tokens[index], shown).map(([kind, text], position) =>
                  kind === "ws" ? (
                    text
                  ) : (
                    <span key={position} className={`t-${kind}`}>
                      {text}
                    </span>
                  ),
                )}
                {typing || shown === 0 ? <span className="code-caret" /> : null}
              </pre>
            </div>
            <div className="code-term" aria-hidden="true">
              {shownTerm === 0 ? (
                <div className="code-term-dim">$ editing {sample.name}…</div>
              ) : null}
              {shownTerm >= 1 ? <div className="code-term-dim">{sample.run}</div> : null}
              {shownTerm >= 2 ? <div className="code-term-ok">{sample.result}</div> : null}
            </div>
            <div className="code-status" aria-hidden="true">
              <span>{sample.label}</span>
              <span>
                Ln {caret.line}, Col {caret.column}
              </span>
              <span className="code-status-live">staging live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!intro) return <div className={className}>{editor}</div>;

  return (
    <div
      className={cn(
        "grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
        className,
      )}
    >
      <div>
        {intro}
        <div role="group" aria-label="Languages" className="mt-8 flex flex-col gap-3">
          {samples.map((entry, position) => (
            <button
              key={entry.name}
              type="button"
              aria-pressed={position === index}
              className="language-row"
              onClick={() => choose(position)}
            >
              <span className="language-tile" aria-hidden="true">
                {logos?.[position]}
              </span>
              <span>
                <span className="block font-bold text-ink">{entry.label}</span>
                <span className="block text-sm text-muted">{entry.note}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      {editor}
    </div>
  );
}
