"use client";

import { Phone } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { sleep } from "@/components/motion/sleep";
import { useOnScreen } from "@/components/motion/useOnScreen";
import { EXAMPLE_LABEL, type CallScript } from "@/content/demos";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type View = {
  /** Lines said in full. */
  lines: number;
  /** Words of the next line said so far. */
  words: number;
  speaking: "caller" | "agent" | null;
  crm: boolean;
  status: "ringing" | "live" | "ended";
  seconds: number;
};

const BARS = 28;

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

function clock(seconds: number): string {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

/**
 * A call screen that plays a script: the caller card and a running timer, a
 * waveform that moves while someone speaks, the transcript streaming word by
 * word, and the summary card written to the CRM at the end. Like ChatDemo it
 * renders the finished call first (what reduced motion and screen readers
 * get), then replays it while on screen, looping. The CRM card's space is
 * always reserved, so nothing below it moves.
 */
export default function CallDemo({
  script,
  className,
}: {
  script: CallScript;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const active = useOnScreen(frame, { threshold: 0.35 });
  const full: View = {
    lines: script.lines.length,
    words: 0,
    speaking: null,
    crm: true,
    status: "ended",
    seconds: 0,
  };
  const [view, setView] = useState<View>(full);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (reduce || !active) return;
    const controller = new AbortController();
    const { signal } = controller;
    let timer = 0;
    const set = (patch: Partial<View>) => setView((current) => ({ ...current, ...patch }));
    const play = async () => {
      for (;;) {
        await sleep(300, signal);
        setResetting(true);
        await sleep(260, signal);
        setView({ lines: 0, words: 0, speaking: null, crm: false, status: "ringing", seconds: 0 });
        setResetting(false);
        await sleep(1400, signal);
        set({ status: "live" });
        timer = window.setInterval(
          () => setView((current) => ({ ...current, seconds: current.seconds + 1 })),
          1000,
        );
        for (let index = 0; index < script.lines.length; index++) {
          const line = script.lines[index];
          const words = line.text.split(" ").length;
          set({ speaking: line.from });
          for (let count = 1; count <= words; count++) {
            set({ words: count });
            await sleep(110 + Math.random() * 70, signal);
          }
          set({ lines: index + 1, words: 0, speaking: null });
          await sleep(650, signal);
        }
        window.clearInterval(timer);
        set({ crm: true, status: "ended" });
        await sleep(6000, signal);
      }
    };
    play().catch(() => {
      // Off screen or unmounted: the next run starts the call again.
    });
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [active, reduce, script]);

  const current = reduce ? full : view;
  const speakingLine = current.words > 0 ? script.lines[current.lines] : undefined;
  const status =
    current.status === "ringing"
      ? script.callerNote
      : current.status === "live"
        ? `On call with ${script.agent}`
        : "Call ended";

  return (
    <figure className={cn("m-0", className)}>
      <figcaption className="sr-only">{script.summary}</figcaption>
      <ol className="sr-only">
        {script.lines.map((line, index) => (
          <li key={index}>
            {line.from === "caller" ? script.caller : script.agent}: {line.text}
          </li>
        ))}
        <li>
          {script.crm.title}:{" "}
          {script.crm.fields.map((field) => `${field.label}, ${field.value}`).join("; ")}.
        </li>
      </ol>
      <div ref={frame} className="call" aria-hidden="true" data-paused={active ? undefined : ""}>
        <div className="call-head">
          <span className="call-avatar">{initials(script.caller)}</span>
          <div className="min-w-0">
            <div className="font-bold text-ink">{script.caller}</div>
            <div className="text-sm text-muted">{status}</div>
          </div>
          {current.status === "live" ? (
            <span className="call-timer">
              <Phone size={14} strokeWidth={1.75} className="mr-1.5 inline text-ok" />
              {clock(current.seconds)}
            </span>
          ) : null}
        </div>
        <div
          className="call-wave"
          data-speaking={current.speaking ? "" : undefined}
          style={
            {
              "--wave":
                current.speaking === "agent"
                  ? "var(--accent)"
                  : current.speaking
                    ? "var(--c-ai)"
                    : undefined,
            } as CSSProperties
          }
        >
          {Array.from({ length: BARS }, (_, index) => (
            <span key={index} />
          ))}
        </div>
        <div
          className="call-transcript transition-opacity duration-200"
          style={{ opacity: resetting ? 0 : 1 }}
        >
          {script.lines.slice(0, current.lines).map((line, index) => (
            <p key={index} className="call-line chat-in" data-from={line.from}>
              <span className="call-speaker">
                {line.from === "caller" ? script.caller : script.agent}
              </span>
              {line.text}
            </p>
          ))}
          {speakingLine ? (
            <p className="call-line" data-from={speakingLine.from}>
              <span className="call-speaker">
                {speakingLine.from === "caller" ? script.caller : script.agent}
              </span>
              {speakingLine.text.split(" ").slice(0, current.words).join(" ")}
            </p>
          ) : null}
        </div>
        <div
          className="call-crm transition-[opacity,transform] duration-500"
          style={{
            opacity: current.crm ? 1 : 0,
            transform: current.crm ? "none" : "translateY(8px)",
          }}
        >
          <div className="font-bold text-ink">{script.crm.title}</div>
          <dl>
            {script.crm.fields.map((field) => (
              <div key={field.label} className="contents">
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="example-label mt-3">{EXAMPLE_LABEL}</p>
    </figure>
  );
}
