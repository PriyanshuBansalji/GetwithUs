import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "signal" | "ok" | "err";

type BadgeProps = { tone?: Tone; className?: string; children: ReactNode };

const tones: Record<Tone, string> = {
  neutral: "border-line-2 text-body",
  signal: "border-accent/40 text-accent",
  ok: "border-ok/40 text-ok",
  err: "border-err/40 text-err",
};

/** A small label. Always carries text, so color is never the only signal. */
export default function Badge({ tone = "neutral", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-tag border bg-card px-2 py-0.5 type-small font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
