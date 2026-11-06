"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type TerminalCta from "@/components/cta/TerminalCta";
import TerminalFrame from "@/components/cta/TerminalFrame";
import LazyWhenNear from "@/components/motion/LazyWhenNear";

const Terminal = dynamic(() => import("@/components/cta/TerminalCta"), {
  ssr: false,
  loading: () => <TerminalFrame />,
});

/** The terminal, fetched only when the section comes near; until then its empty frame holds the space. */
export default function TerminalCtaLazy(props: ComponentProps<typeof TerminalCta>) {
  return (
    <LazyWhenNear placeholder={<TerminalFrame />}>
      <Terminal {...props} />
    </LazyWhenNear>
  );
}
