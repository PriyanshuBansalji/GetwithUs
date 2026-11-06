import type { Ref } from "react";

/**
 * A field people never see or reach with the keyboard. Bots that fill every
 * input fill this one, and the server then quietly discards the submission.
 */
export default function Honeypot({ inputRef }: { inputRef: Ref<HTMLInputElement> }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
    >
      <label htmlFor="website">Website</label>
      <input
        ref={inputRef}
        id="website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
