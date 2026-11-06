"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type RevealTextProps = {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
};

/**
 * A heading that rises in once, line by line (word by word when it fits on one
 * line), 60 ms apart over 600 ms, when it first enters the screen. The text is
 * server-rendered and visible: only headings that start below the fold are
 * hidden for their reveal, so nothing on screen at load ever blinks. Screen
 * readers read the heading once. Never use it for an above-the-fold h1.
 */
export default function RevealText({ text, as: Tag = "h2", id, className }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const words = text.split(" ");

  useEffect(() => {
    const element = ref.current;
    if (!element || reduce) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    const spans = Array.from(element.querySelectorAll<HTMLElement>("[data-word]"));
    const tops = [...new Set(spans.map((span) => span.offsetTop))].sort((a, b) => a - b);
    const multiline = tops.length > 1;
    spans.forEach((span, index) => {
      const line = tops.indexOf(span.offsetTop);
      span.style.setProperty("--i", String(multiline ? line : index));
    });
    element.dataset.reveal = "waiting";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.reveal;
    };
  }, [reduce, text]);

  return (
    <Tag ref={ref} id={id} className={cn("reveal-text", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="reveal-word-mask">
              <span data-word="" className="reveal-word" style={{ "--i": index } as CSSProperties}>
                {word}
              </span>
            </span>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
