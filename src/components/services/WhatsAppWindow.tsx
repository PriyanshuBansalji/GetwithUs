import OnScreen from "@/components/motion/OnScreen";

/**
 * The 24-hour customer-service window from the WhatsApp page's note, drawn as
 * a timeline: from the customer's message, free-form replies for 24 hours,
 * then approved templates only. A marker sweeps along it while on screen; it
 * is a still, complete diagram under reduced motion. The note's text says the
 * same in words, so the drawing is decorative.
 */
export default function WhatsAppWindow() {
  return (
    <OnScreen aria-hidden className="mt-8">
      <div className="grid grid-cols-[2fr_1fr] text-sm font-semibold">
        <span className="text-ok">Free-form replies</span>
        <span className="text-right text-amber">Approved templates only</span>
      </div>
      <div className="relative mt-3 h-3 rounded-full bg-bg-soft">
        <span className="absolute inset-y-0 left-0 w-2/3 rounded-l-full bg-[color-mix(in_srgb,var(--ok)_24%,transparent)]" />
        <span className="absolute inset-y-0 right-0 w-1/3 rounded-r-full bg-[repeating-linear-gradient(135deg,color-mix(in_srgb,var(--amber)_26%,transparent)_0_6px,transparent_6px_12px)]" />
        <span className="wa-window-marker absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-card bg-ok shadow-soft" />
        <span className="absolute top-[-6px] left-2/3 h-6 w-0.5 bg-ink" />
      </div>
      <div className="mt-3 grid grid-cols-[2fr_1fr] text-sm text-body">
        {/* The second label is centred on the 24-hour tick, so it reaches half its width into the first column: the first label leaves that room. */}
        <span className="pr-16">The customer messages you</span>
        <span className="-translate-x-1/2 text-center whitespace-nowrap">24 hours later</span>
      </div>
    </OnScreen>
  );
}
