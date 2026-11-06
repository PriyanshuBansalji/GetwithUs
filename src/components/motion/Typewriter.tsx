"use client";

import { useEffect, useRef, useState } from "react";
import { sleep } from "@/components/motion/sleep";
import { useOnScreen } from "@/components/motion/useOnScreen";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type TypewriterProps = {
  /** Words to cycle through; the first is what paints first and what reduced motion keeps. */
  words: readonly string[];
  /** The word screen readers hear, in place of the animation. */
  spoken: string;
  className?: string;
};

/**
 * Types and deletes a rotating list of words, with a blinking caret: the home
 * hero's word slot only. The first word is server-rendered, so the heading
 * paints at once; typing starts 1.4 s later, only while on screen. Screen
 * readers hear `spoken`; under reduced motion the first word stays.
 */
export default function Typewriter({ words, spoken, className }: TypewriterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(words[0] ?? "");
  const reduce = useReducedMotion();
  const active = useOnScreen(ref, { threshold: 0 });

  useEffect(() => {
    if (reduce || !active || words.length < 2) return;
    const controller = new AbortController();
    const { signal } = controller;
    const run = async () => {
      let index = Math.max(0, words.indexOf(ref.current?.dataset.word ?? words[0]));
      await sleep(1400, signal);
      for (;;) {
        const current = words[index];
        for (let length = current.length; length >= 0; length--) {
          setText(current.slice(0, length));
          await sleep(34, signal);
        }
        index = (index + 1) % words.length;
        const next = words[index];
        if (ref.current) ref.current.dataset.word = next;
        await sleep(160, signal);
        for (let length = 1; length <= next.length; length++) {
          setText(next.slice(0, length));
          await sleep(70 + Math.random() * 40, signal);
        }
        await sleep(1900, signal);
      }
    };
    run().catch(() => {
      // Stopped: off screen, hidden, or unmounted.
    });
    return () => controller.abort();
  }, [active, reduce, words]);

  return (
    <span className={cn("typewriter", className)} data-paused={active ? undefined : ""}>
      <span className="sr-only">{spoken}</span>
      <span ref={ref} aria-hidden="true" data-word={words[0]}>
        {reduce ? words[0] : text}
        <span className="typewriter-caret" />
      </span>
    </span>
  );
}
