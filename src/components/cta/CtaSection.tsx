import TerminalCtaLazy from "@/components/cta/TerminalCtaLazy";
import ClosingCta from "@/components/sections/ClosingCta";
import { RESPONSE_TIME } from "@/config/site";

/**
 * The home page's closing band: "Tell us what you need" with the terminal in its
 * right column. The terminal starts a brief and hands it to /start, where it is
 * finished and confirmed through the lead pipeline like any other.
 */
export default function CtaSection() {
  // The FAQ above has a tinted background, so the band needs its own space above it, as on /process.
  return (
    <ClosingCta
      className="pt-20 md:pt-24"
      terminal={<TerminalCtaLazy responseTime={RESPONSE_TIME} />}
    />
  );
}
