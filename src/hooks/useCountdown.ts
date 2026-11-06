"use client";

import { useEffect, useState } from "react";

/** Whole seconds left until `until` (an ISO date), ticking once a second; 0 once it has passed. */
export function useCountdown(until: string | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!until) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [until]);

  if (!until) return 0;
  return Math.max(0, Math.ceil((new Date(until).getTime() - now) / 1000));
}
