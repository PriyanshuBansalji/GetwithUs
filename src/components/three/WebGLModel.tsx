"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useOnScreen } from "@/components/motion/useOnScreen";
import { useQuality } from "@/components/three/hooks/useQuality";
import { STATIC_MODELS, type ModelKey, type ModelProps } from "@/components/three/models/keys";
import SceneErrorBoundary from "@/components/three/SceneErrorBoundary";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

const ModelCanvas = dynamic(() => import("@/components/three/ModelCanvas"), { ssr: false });

/** The first of these anywhere on the page lets the 3D load (docs/build-final-plan.md, decision 6). */
const INTENT = ["scroll", "wheel", "pointermove", "pointerdown", "keydown", "touchstart"] as const;

/**
 * A page's 3D model in a 4:3 panel. It shows `still` (a static SVG drawn on
 * the server) until the visitor first scrolls, moves the pointer, or presses a
 * key and the panel is near the viewport; only then does it probe WebGL and
 * load the 3D chunk, and the canvas fades in over the still once its first
 * frame is drawn. It renders at 30 frames per second while on screen, pauses
 * off screen, holds a still pose under reduced motion, and re-reads the theme
 * colours on toggle. Without WebGL, or after any 3D error, the still stays.
 */
export default function WebGLModel({
  model,
  still,
  label,
  className,
  modelProps,
}: {
  model: ModelKey;
  /** Passed to the model, for example the case study screenshot. */
  modelProps?: ModelProps;
  still: ReactNode;
  /** Describes the model when it carries meaning; otherwise it is decorative. */
  label?: string;
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const [intent, setIntent] = useState(false);
  const [near, setNear] = useState(false);
  const [live, setLive] = useState(false);
  const onScreen = useOnScreen(panel, { threshold: 0 });
  const reduce = useReducedMotion();
  const quality = useQuality(intent && near);

  useEffect(() => {
    function stop() {
      for (const name of INTENT) window.removeEventListener(name, start);
    }
    function start() {
      stop();
      setIntent(true);
    }
    for (const name of INTENT) window.addEventListener(name, start, { passive: true });
    // Scrolled before this script ran: that scroll was the first interaction.
    if (window.scrollY > 0) start();
    return stop;
  }, []);

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setNear(true);
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const ready = intent && near && quality !== null && quality !== "none";

  return (
    <div
      ref={panel}
      className={cn("model-panel", className)}
      data-live={live && ready ? "" : undefined}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <div className="model-still">{still}</div>
      {ready ? (
        <div className="model-canvas">
          <SceneErrorBoundary>
            <ModelCanvas
              model={model}
              quality={quality}
              active={onScreen}
              still={reduce || STATIC_MODELS.has(model)}
              modelProps={modelProps}
              onReady={() => setLive(true)}
            />
          </SceneErrorBoundary>
        </div>
      ) : null}
    </div>
  );
}
