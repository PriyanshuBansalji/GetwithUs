"use client";

import { useEffect, useRef } from "react";
import { onFrame } from "@/components/motion/frame";

/**
 * A thin accent bar under the header that fills as the legal text is read.
 * It follows scrolling only (no motion of its own), so it stays on under
 * reduced motion. Decorative: the table of contents is the navigation.
 */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stop: (() => void) | null = null;
    const update = () => {
      stop = null;
      const target = document.getElementById(targetId);
      if (!target || !bar.current) return;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
      bar.current.style.setProperty("--progress", progress.toFixed(4));
    };
    const onScroll = () => {
      if (stop) return;
      stop = onFrame(() => {
        stop?.();
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      stop?.();
    };
  }, [targetId]);

  return <div ref={bar} aria-hidden="true" className="reading-progress" />;
}
