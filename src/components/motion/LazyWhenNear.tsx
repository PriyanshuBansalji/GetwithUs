"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders `placeholder` until the spot comes within `margin` of the viewport,
 * then `children`. Pair it with a next/dynamic component so its code is only
 * fetched then; the placeholder should match its size so nothing shifts.
 */
export default function LazyWhenNear({
  children,
  placeholder,
  margin = "600px",
}: {
  children: ReactNode;
  placeholder: ReactNode;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setNear(true);
      },
      { rootMargin: `${margin} 0px` },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [margin]);

  return <div ref={ref}>{near ? children : placeholder}</div>;
}
