"use client";

import { MoveHorizontal } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { onFrame } from "@/components/motion/frame";
import { useOnScreen } from "@/components/motion/useOnScreen";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

export type SphereTool = {
  name: string;
  category: string;
  /** The official mark (TechLogo, rendered on the server), or null to show a category dot. */
  logo: ReactNode | null;
};

export type SphereCategory = {
  key: string;
  label: string;
  /** A CSS colour, usually a category token such as var(--c-web). */
  color: string;
  icon: ReactNode;
};

const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const REST_X = -0.25;
const SPIN = 0.28;
/** Sphere radius and centre, in container units (cqw). */
const RADIUS = 38;
const CENTRE = 50;

type Point = { x: number; y: number; z: number };

/** Evenly spread points on a unit sphere (a Fibonacci lattice). */
export function fibonacciSphere(count: number): Point[] {
  return Array.from({ length: count }, (_, index) => {
    const y = count > 1 ? 1 - (index / (count - 1)) * 2 : 0;
    const ring = Math.sqrt(1 - y * y);
    const phi = index * GOLDEN;
    return { x: Math.cos(phi) * ring, y, z: Math.sin(phi) * ring };
  });
}

type Placement = { transform: string; opacity: string; zIndex: number; highlight: boolean };

function place(point: Point, ax: number, ay: number, dim: boolean | null): Placement {
  const cy = Math.cos(ay);
  const sy = Math.sin(ay);
  const cx = Math.cos(ax);
  const sx = Math.sin(ax);
  const x1 = point.x * cy + point.z * sy;
  const z1 = -point.x * sy + point.z * cy;
  const y2 = point.y * cx - z1 * sx;
  const z2 = point.y * sx + z1 * cx;
  const depth = (z2 + 1) / 2;
  const scale = 0.62 + 0.5 * depth;
  const lit = dim === false;
  return {
    transform: `translate(${(CENTRE + x1 * RADIUS).toFixed(2)}cqw, ${(CENTRE + y2 * RADIUS).toFixed(2)}cqw) translate(-50%, -50%) scale(${scale.toFixed(3)})`,
    opacity: ((0.22 + 0.78 * depth) * (dim ? 0.22 : 1)).toFixed(2),
    zIndex: Math.round(depth * 100) + (lit ? 100 : 0),
    highlight: lit,
  };
}

/**
 * The stack sphere: tool chips with their official logos on a Fibonacci
 * sphere that turns slowly, drags with inertia, and scales and fades with
 * depth. The category buttons beside it light up their group and dim the
 * rest; each button also lists its tools in text, so the sphere itself is
 * decorative. Pauses off screen; under reduced motion it holds a still frame
 * that can still be dragged.
 */
export default function TagSphere({
  tools,
  categories,
  children,
  className,
}: {
  tools: readonly SphereTool[];
  categories: readonly SphereCategory[];
  /** The heading and intro beside the sphere. */
  children?: ReactNode;
  className?: string;
}) {
  const sphere = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const active = useOnScreen(sphere, { threshold: 0 });
  const [category, setCategory] = useState<string | null>(null);
  const points = useMemo(() => fibonacciSphere(tools.length), [tools.length]);
  const motion = useRef({ ax: REST_X, ay: 0, vx: 0, vy: SPIN });
  const drag = useRef<{ id: number; x: number; y: number; t: number } | null>(null);
  const draw = useRef<() => void>(() => {});

  useEffect(() => {
    const root = sphere.current;
    if (!root) return;
    const chips = Array.from(root.querySelectorAll<HTMLElement>("[data-tool]"));
    draw.current = () => {
      const { ax, ay } = motion.current;
      chips.forEach((chip, index) => {
        const dim = category === null ? null : chip.dataset.category !== category;
        const placement = place(points[index], ax, ay, dim);
        chip.style.transform = placement.transform;
        chip.style.opacity = placement.opacity;
        chip.style.zIndex = String(placement.zIndex);
        chip.toggleAttribute("data-highlight", placement.highlight);
      });
    };
    draw.current();
  }, [category, points]);

  useEffect(() => {
    if (reduce || !active) return;
    let last = performance.now();
    return onFrame((now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const m = motion.current;
      if (!drag.current) {
        m.ay += m.vy * dt;
        m.ax += m.vx * dt;
        m.vy += (SPIN - m.vy) * Math.min(1, dt * 1.2);
        m.vx += (0 - m.vx) * Math.min(1, dt * 1.2);
        m.ax += (REST_X - m.ax) * Math.min(1, dt * 0.4);
      }
      draw.current();
    });
  }, [active, reduce]);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const now = performance.now();
    const dt = Math.max(0.016, (now - current.t) / 1000);
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    const m = motion.current;
    m.ay += dx * 0.006;
    m.ax -= dy * 0.006;
    m.vy = (dx * 0.006) / dt;
    m.vx = (-dy * 0.006) / dt;
    drag.current = { id: current.id, x: event.clientX, y: event.clientY, t: now };
    if (reduce) draw.current();
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    drag.current = null;
    delete event.currentTarget.dataset.dragging;
    const m = motion.current;
    m.vy = Math.max(-3, Math.min(3, m.vy));
    m.vx = Math.max(-3, Math.min(3, m.vx));
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:grid-rows-[1fr_auto_1fr]",
        className,
      )}
    >
      <div
        ref={sphere}
        aria-hidden="true"
        data-decorative=""
        data-paused={active ? undefined : ""}
        className="sphere isolate lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:self-center"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          drag.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            t: performance.now(),
          };
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.dataset.dragging = "";
        }}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="sphere-halo" />
        <div className="sphere-ring sphere-ring-outer">
          <span className="sphere-sat" style={{ background: "var(--c-ai)" }} />
        </div>
        <div className="sphere-ring sphere-ring-inner">
          <span className="sphere-sat" style={{ background: "var(--c-web)" }} />
        </div>
        {tools.map((tool, index) => {
          const color = categories.find((entry) => entry.key === tool.category)?.color;
          const placement = place(points[index], REST_X, 0, null);
          return (
            <span
              key={tool.name}
              data-tool=""
              data-category={tool.category}
              className="sphere-chip"
              style={
                {
                  "--c": color,
                  transform: placement.transform,
                  opacity: placement.opacity,
                  zIndex: placement.zIndex,
                } as CSSProperties
              }
              suppressHydrationWarning
            >
              {tool.logo ?? <span className="sphere-chip-dot" />}
              {tool.name}
            </span>
          );
        })}
        <span className="stage-tag stage-tag-drag">
          <MoveHorizontal size={15} strokeWidth={1.75} aria-hidden="true" />
          Drag to spin
        </span>
      </div>
      {children ? (
        <div className="order-first lg:order-none lg:col-start-2 lg:row-start-1 lg:self-end">
          {children}
        </div>
      ) : null}
      <div className="lg:col-start-2 lg:row-start-2">
        <div role="group" aria-label="Tool groups" className="flex flex-col gap-3">
          {categories.map((entry) => {
            const names = tools
              .filter((tool) => tool.category === entry.key)
              .map((tool) => tool.name);
            return (
              <button
                key={entry.key}
                type="button"
                className="category-button"
                aria-pressed={category === entry.key}
                style={{ "--c": entry.color } as CSSProperties}
                onMouseEnter={() => fine && setCategory(entry.key)}
                onMouseLeave={() => fine && setCategory(null)}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible")) setCategory(entry.key);
                }}
                onClick={() =>
                  setCategory((current) => (current === entry.key && !fine ? null : entry.key))
                }
              >
                <span className="category-icon" aria-hidden="true">
                  {entry.icon}
                </span>
                <span>
                  <span className="block text-[1.03rem] font-bold text-ink">{entry.label}</span>
                  <span className="block text-sm text-muted">{names.join(", ")}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
