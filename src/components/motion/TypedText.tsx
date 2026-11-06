"use client";

import { useEffect, useRef, useState } from "react";
import { sleep } from "@/components/motion/sleep";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type TypedTextProps = {
  text: string;
  /** Milliseconds per character. */
  speed?: number;
  /** Wait before typing starts once on screen. */
  delay?: number;
  caret?: boolean;
  className?: string;
  /** Called once the whole string is shown. */
  onDone?: () => void;
};

/**
 * Types one string, once, when it first comes on screen: search queries, URL
 * bars, terminal lines, chat input. Screen readers get the whole string from
 * the start; under reduced motion it simply shows.
 */
export default function TypedText({
  text,
  speed = 45,
  delay = 200,
  caret = true,
  className,
  onDone,
}: TypedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const reduce = useReducedMotion();
  const done = reduce || count >= text.length;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (reduce) {
      onDone?.();
      return;
    }
    const controller = new AbortController();
    const type = async () => {
      await sleep(delay, controller.signal);
      for (let next = 1; next <= text.length; next++) {
        setCount(next);
        await sleep(speed, controller.signal);
      }
      onDone?.();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        type().catch(() => {
          // Unmounted or the text changed.
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      controller.abort();
    };
  }, [reduce, text, speed, delay, onDone]);

  return (
    <span ref={ref} className={cn("typed-text", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {reduce ? text : text.slice(0, count)}
        {caret && !done ? <span className="typed-caret" /> : null}
      </span>
    </span>
  );
}
