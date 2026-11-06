"use client";

import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Called once the last digit is filled. */
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  status?: "idle" | "error" | "success";
  autoFocus?: boolean;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

function digitsOnly(text: string): string {
  return text.replace(/\D/g, "");
}

/**
 * Six single-digit boxes that behave as one field: typing advances, Backspace
 * steps back, arrow keys move, and pasting (or one-time-code autofill) fills
 * every box at once. The value stays contiguous, so it is always a prefix of
 * the code the person is typing.
 */
export default function CodeInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  status = "idle",
  autoFocus = false,
  id,
  ...aria
}: CodeInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  // The latest value, updated synchronously: fast typing can outrun the next render.
  const current = useRef(value);
  useEffect(() => {
    current.current = value;
  }, [value]);

  const focusBox = (index: number) => {
    const target = refs.current[Math.max(0, Math.min(length - 1, index))];
    target?.focus();
    target?.select();
  };

  const commit = (next: string, focusIndex: number) => {
    const clean = digitsOnly(next).slice(0, length);
    current.current = clean;
    onChange(clean);
    focusBox(focusIndex);
    if (clean.length === length) onComplete?.(clean);
  };

  const handleInput = (index: number, raw: string) => {
    const value = current.current;
    let digits = digitsOnly(raw);
    if (!digits) return;
    const previous = value[index];
    // Typing next to an existing digit yields two characters; keep the new one.
    if (previous && digits.length === 2 && digits.includes(previous)) {
      digits = digits[0] === previous ? digits.slice(1) : digits.slice(0, 1);
    }
    if (digits.length > 1) {
      // Autofill or a paste into a single box: treat it as the whole code.
      commit(digits, Math.min(digits.length, length - 1));
      return;
    }
    const position = Math.min(index, value.length);
    commit(value.slice(0, position) + digits + value.slice(position + 1), position + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    const value = current.current;
    if (event.key === "Backspace") {
      event.preventDefault();
      if (index < value.length) {
        commit(value.slice(0, index) + value.slice(index + 1), index);
      } else if (index > 0) {
        commit(value.slice(0, index - 1), index - 1);
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(Math.min(index + 1, value.length));
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = digitsOnly(event.clipboardData.getData("text"));
    if (digits) commit(digits, Math.min(digits.length, length - 1));
  };

  return (
    <div className="flex gap-2" role="group" aria-label="Verification code">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          // Focus lands on the first empty box so the value never has gaps.
          onFocus={(event) => {
            if (index > current.current.length) focusBox(current.current.length);
            else event.currentTarget.select();
          }}
          autoFocus={autoFocus && index === 0}
          disabled={disabled}
          value={value[index] ?? ""}
          onChange={(event) => handleInput(index, event.currentTarget.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-describedby={aria["aria-describedby"]}
          aria-invalid={aria["aria-invalid"]}
          className={cn(
            "h-14 w-11 rounded-control border bg-card text-center text-[1.375rem] font-semibold text-ink tabular-nums transition-colors duration-200 ease-out sm:w-12",
            "hover:border-muted disabled:cursor-not-allowed disabled:text-muted",
            status === "error" && "border-err",
            status === "success" && "border-ok",
            status === "idle" && "border-line-2",
          )}
        />
      ))}
    </div>
  );
}
