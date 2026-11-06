"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useOnScreen } from "@/components/motion/useOnScreen";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

export type StepperStep = {
  title: string;
  icon: ReactNode;
  /** What the detail card shows for this step (server-rendered). */
  detail: ReactNode;
};

/** Milliseconds between automatic steps, and how long a click holds the choice. */
const ADVANCE_MS = 2800;
const HOLD_MS = 9000;

/**
 * Steps as circles on a dashed track, with a solid fill and a glowing runner
 * up to the active one, and a detail card below. It advances by itself every
 * 2.8 s while on screen, and holds still while the pointer or keyboard focus
 * is on it; choosing a step holds it for 9 s. A tab list for assistive
 * technology (arrow keys move between steps). Under reduced motion it never
 * advances by itself.
 */
export default function ProcessStepper({
  steps,
  label,
  className,
}: {
  steps: readonly StepperStep[];
  /** Names the steps, for example "How a project runs". */
  label: string;
  className?: string;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  // How long until the next automatic step, and a count of choices so each one restarts the wait.
  const [wait, setWait] = useState(ADVANCE_MS);
  const [choices, setChoices] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const reduce = useReducedMotion();
  const active = useOnScreen(root, { threshold: 0.3 });
  const count = steps.length;

  useEffect(() => {
    if (reduce || !active || engaged || count < 2) return;
    const timer = window.setTimeout(() => {
      setWait(ADVANCE_MS);
      setIndex((current) => (current + 1) % count);
    }, wait);
    return () => window.clearTimeout(timer);
  }, [active, reduce, engaged, index, wait, choices, count]);

  const choose = (next: number, focus = false) => {
    setIndex(next);
    setWait(HOLD_MS);
    setChoices((current) => current + 1);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: (index + 1) % count,
      ArrowDown: (index + 1) % count,
      ArrowLeft: (index - 1 + count) % count,
      ArrowUp: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    choose(next, true);
  };

  const progress = count > 1 ? (index / (count - 1)) * 100 : 0;
  const step = steps[index];

  return (
    <div
      ref={root}
      className={className}
      data-paused={active ? undefined : ""}
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onFocus={() => setEngaged(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEngaged(false);
      }}
    >
      <div
        role="tablist"
        aria-label={label}
        className="stepper"
        style={{ "--n": count, "--progress": `${progress}%` } as CSSProperties}
        onKeyDown={onKeyDown}
      >
        <div className="stepper-track" aria-hidden="true">
          <div className="stepper-fill" />
          <div className="stepper-runner" />
        </div>
        {steps.map((entry, position) => (
          <button
            key={entry.title}
            ref={(element) => {
              tabs.current[position] = element;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${position}`}
            aria-selected={position === index}
            aria-controls={`${id}-panel`}
            tabIndex={position === index ? 0 : -1}
            data-done={position < index ? "" : undefined}
            className="stepper-step"
            onClick={() => choose(position)}
          >
            <span className="stepper-circle" aria-hidden="true">
              {entry.icon}
            </span>
            <span className="stepper-label">{entry.title}</span>
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${index}`}
        className={cn("stepper-detail")}
      >
        <div key={`n-${index}`} className="stepper-number fade-up" aria-hidden="true">
          {index + 1}
        </div>
        <div key={`d-${index}`} className="fade-up min-w-0">
          {step.detail}
        </div>
      </div>
    </div>
  );
}
