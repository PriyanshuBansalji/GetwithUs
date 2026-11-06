"use client";

import { CheckCheck, UserRound } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { sleep } from "@/components/motion/sleep";
import { useOnScreen } from "@/components/motion/useOnScreen";
import { LogoMark } from "@/components/ui/Logo";
import { EXAMPLE_LABEL, type ChatScript } from "@/content/demos";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

type View = {
  /** How many script steps are on screen. */
  shown: number;
  typing: boolean;
  /** What the customer is typing into the input bar. */
  draft: string;
  picked: string | null;
  /** The bot's follow-up line under the last card. */
  after: boolean;
};

/** The quick reply the customer chose: their message right after a bot step offering it. */
function pickedReply(script: ChatScript): string | null {
  for (let index = 1; index < script.steps.length; index++) {
    const previous = script.steps[index - 1];
    const step = script.steps[index];
    if (previous.from === "bot" && previous.replies?.includes(step.text)) return step.text;
  }
  return null;
}

/** Example clock times for the bubbles, two messages a minute. */
function stamp(index: number): string {
  return `10:${String(2 + Math.floor(index / 2)).padStart(2, "0")}`;
}

/**
 * A WhatsApp-style chat that plays a script: the bot's typing indicator and
 * "typing…" status, bubbles with times and read ticks, rich cards, a quick
 * reply row, and a "Talk to a person" chip that is always there. It renders
 * the finished conversation first (that is also what reduced motion and
 * screen readers get), then replays it while on screen, looping. Screen
 * readers get the full transcript as a list.
 */
export default function ChatDemo({
  script,
  className,
}: {
  script: ChatScript;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const active = useOnScreen(frame, { threshold: 0.35 });
  const full: View = {
    shown: script.steps.length,
    typing: false,
    draft: "",
    picked: pickedReply(script),
    after: true,
  };
  const [view, setView] = useState<View>(full);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (reduce || !active) return;
    const controller = new AbortController();
    const { signal } = controller;
    const set = (patch: Partial<View>) => setView((current) => ({ ...current, ...patch }));
    const play = async () => {
      for (;;) {
        await sleep(300, signal);
        setResetting(true);
        await sleep(260, signal);
        setView({ shown: 0, typing: false, draft: "", picked: null, after: false });
        setResetting(false);
        await sleep(600, signal);
        for (let index = 0; index < script.steps.length; index++) {
          const step = script.steps[index];
          if (step.from === "customer") {
            const previous = script.steps[index - 1];
            const quick = previous?.from === "bot" && previous.replies?.includes(step.text);
            if (quick) {
              await sleep(1100, signal);
              set({ picked: step.text });
              await sleep(450, signal);
            } else {
              for (let length = 1; length <= step.text.length; length++) {
                set({ draft: step.text.slice(0, length) });
                await sleep(26 + Math.random() * 30, signal);
              }
              await sleep(350, signal);
            }
            set({ draft: "", shown: index + 1 });
            await sleep(900, signal);
          } else {
            set({ typing: true });
            await sleep(900 + Math.min(step.text.length * 10, 1100), signal);
            set({ typing: false, shown: index + 1 });
            if (step.after) {
              await sleep(1100, signal);
              set({ after: true });
            }
            await sleep(1000, signal);
          }
        }
        await sleep(5000, signal);
      }
    };
    play().catch(() => {
      // Off screen or unmounted: the next run starts the conversation again.
    });
    return () => controller.abort();
  }, [active, reduce, script]);

  const current = reduce ? full : view;

  return (
    <figure className={cn("m-0", className)}>
      <figcaption className="sr-only">{script.summary}</figcaption>
      <ol className="sr-only">
        {script.steps.map((step, index) => (
          <li key={index}>
            {step.from === "customer" ? "Customer" : `${script.name} bot`}: {step.text}
            {step.from === "bot" && step.card
              ? ` ${step.card.title}, ${step.card.lines.join(", ")}.`
              : null}
            {step.from === "bot" && step.after ? ` ${step.after}` : null}
          </li>
        ))}
      </ol>
      <div ref={frame} className="chat" aria-hidden="true" data-paused={active ? undefined : ""}>
        <div className="chat-head">
          <span className="chat-avatar">
            <LogoMark />
          </span>
          <div>
            <div className="font-bold">{script.name}</div>
            <div className="chat-status">{current.typing ? script.typing : script.status}</div>
          </div>
        </div>
        <div
          className="chat-body transition-opacity duration-200"
          style={{ opacity: resetting ? 0 : 1 }}
        >
          {script.steps.slice(0, current.shown).map((step, index) => (
            <Fragment key={index}>
              <div className="chat-bubble chat-in" data-from={step.from}>
                {step.text}
                {step.from === "bot" && step.card ? (
                  <div className="chat-card">
                    <div className="font-bold">{step.card.title}</div>
                    {step.card.lines.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                ) : null}
                <span className="chat-meta">
                  {stamp(index)}
                  {step.from === "customer" ? (
                    <CheckCheck size={14} className="chat-ticks" />
                  ) : null}
                </span>
              </div>
              {step.from === "bot" && step.replies ? (
                <div className="chat-replies chat-in">
                  {step.replies.map((reply) => (
                    <span
                      key={reply}
                      className="chat-reply"
                      data-picked={current.picked === reply ? "" : undefined}
                    >
                      {reply}
                    </span>
                  ))}
                </div>
              ) : null}
              {step.from === "bot" && step.after && current.after ? (
                <div className="chat-bubble chat-in" data-from="bot">
                  {step.after}
                  <span className="chat-meta">{stamp(index)}</span>
                </div>
              ) : null}
            </Fragment>
          ))}
          {current.typing ? (
            <div className="chat-typing chat-in">
              <span />
              <span />
              <span />
            </div>
          ) : null}
        </div>
        <div className="chat-foot">
          <span className="chat-handoff">
            <UserRound size={14} strokeWidth={1.75} />
            {script.handoff}
          </span>
          <div className="chat-input">
            {current.draft ? (
              <span>
                {current.draft}
                <span className="typed-caret" />
              </span>
            ) : (
              <span className="chat-placeholder">Message</span>
            )}
          </div>
        </div>
      </div>
      <p className="example-label mt-3">{EXAMPLE_LABEL}</p>
    </figure>
  );
}
