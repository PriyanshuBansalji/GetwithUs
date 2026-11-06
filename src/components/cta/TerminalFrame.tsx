import type { ReactNode, Ref } from "react";

/**
 * The terminal window, in the editor's colours on the dark closing band: title
 * bar and a body at least 340 px tall that announces new lines politely.
 * Rendered empty as the placeholder until the terminal loads, at the same size.
 */
export default function TerminalFrame({
  ref,
  children,
}: {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}) {
  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-scene border border-white/10 bg-ed-bar font-mono text-[#d6deeb] shadow-[0_40px_80px_rgb(0_0_0/0.35)]"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        {["#f26b5b", "#f5b54a", "#3ec27a"].map((color) => (
          <span
            key={color}
            aria-hidden="true"
            className="size-[11px] rounded-full"
            style={{ background: color }}
          />
        ))}
        <span className="ml-2.5 truncate text-[0.8125rem] text-[#8b9ab0]">
          GetwithUs: new brief
        </span>
      </div>
      <div aria-live="polite" className="min-h-[340px] px-6 pt-[22px] pb-[26px] text-[0.9375rem]">
        {children}
      </div>
    </div>
  );
}
