"use client";

import { MoveHorizontal } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { onFrame } from "@/components/motion/frame";
import {
  SATELLITES,
  UNITS,
  chipTransform,
  orbitFrame,
  type OrbitFrame,
  type OrbitState,
} from "@/components/motion/orbit-math";
import { useOnScreen } from "@/components/motion/useOnScreen";
import { LogoMark } from "@/components/ui/Logo";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

export type OrbitItem = {
  label: string;
  /** A shorter label for narrow screens; the link keeps the full label as its name. */
  short?: string;
  href: string;
  /** A small icon, drawn white on the chip's colour. */
  icon: ReactNode;
  /** A CSS colour, usually a category token such as var(--c-web). */
  color: string;
};

/** Radians per second the ring turns on its own. */
const BASE_SPEED = 0.18;
/** Pixels of sideways movement before a press becomes a drag (and stops being a click). */
const DRAG_START = 6;
/** Pixel sizes of the SVG dots, converted to viewBox units as the stage resizes. */
const DOT = { halo: 7, packet: 3, satellite: 4.5 };
/** The stage width the server-rendered frame assumes. */
const SERVER_WIDTH = 600;

const INITIAL: OrbitState = { rotation: 0, time: 0, mx: 0, my: 0, radiusFactor: 0.4, still: false };

type Drag = { id: number; startX: number; x: number; t: number; moved: boolean };

function Wires({ frame, side }: { frame: OrbitFrame; side: "back" | "front" }) {
  const unit = UNITS / SERVER_WIDTH;
  const front = side === "front";
  return (
    <>
      <path
        data-ring={`outer-${side}`}
        d={front ? frame.rings.outerFront : frame.rings.outerBack}
        fill="none"
        stroke="var(--accent)"
        strokeOpacity={0.35}
        strokeWidth={1.4}
        strokeDasharray="5 7"
        vectorEffect="non-scaling-stroke"
        suppressHydrationWarning
      />
      <path
        data-ring={`inner-${side}`}
        d={front ? frame.rings.innerFront : frame.rings.innerBack}
        fill="none"
        stroke="var(--line-2)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        suppressHydrationWarning
      />
      {frame.chips.map((chip, index) => (
        <g
          key={index}
          data-wire={`${side}-${index}`}
          opacity={chip.wireOpacity.toFixed(2)}
          display={chip.front === front ? undefined : "none"}
          suppressHydrationWarning
        >
          <path
            d={chip.wire}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity={0.45}
            strokeWidth={1.3}
            strokeDasharray="3 5"
            vectorEffect="non-scaling-stroke"
            suppressHydrationWarning
          />
          <circle
            data-dot="halo"
            r={DOT.halo * unit}
            cx={chip.packetX.toFixed(1)}
            cy={chip.packetY.toFixed(1)}
            fill="var(--accent)"
            fillOpacity={0.22}
            suppressHydrationWarning
          />
          <circle
            data-dot="packet"
            r={DOT.packet * unit}
            cx={chip.packetX.toFixed(1)}
            cy={chip.packetY.toFixed(1)}
            fill="var(--accent)"
            suppressHydrationWarning
          />
        </g>
      ))}
      {frame.satellites.map((satellite, index) => (
        <circle
          key={index}
          data-satellite={`${side}-${index}`}
          data-dot="satellite"
          r={DOT.satellite * unit}
          cx={satellite.x.toFixed(1)}
          cy={satellite.y.toFixed(1)}
          fill="var(--amber)"
          opacity={satellite.opacity.toFixed(2)}
          display={satellite.front === front ? undefined : "none"}
          suppressHydrationWarning
        />
      ))}
    </>
  );
}

/**
 * The home hero's orbit: a CSS 3D cube for "your business" at the centre, the
 * services on a tilted ring around it as real links, curved wires carrying
 * packets to the core, and an inner ring with three satellites. Pointer
 * parallax, drag to spin with inertia, and the ring slows to a stop while a
 * chip is hovered or focused. The first frame is server-rendered in container
 * units, so nothing moves into place. Pauses off screen; under reduced motion
 * it is a still frame that can still be dragged. No WebGL.
 */
export default function Orbit3D({
  items,
  label,
  core = ["Your", "business"],
  className,
}: {
  items: readonly OrbitItem[];
  /** Names the list of links, for example "Services". */
  label: string;
  /** The two lines on the cube's front and back faces. */
  core?: readonly [string, string];
  className?: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const active = useOnScreen(stage, { threshold: 0 });
  const state = useRef({
    ...INITIAL,
    velocity: BASE_SPEED,
    tmx: 0,
    tmy: 0,
    hold: false,
    width: SERVER_WIDTH,
  });
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const draw = useRef<() => void>(() => {});

  const first = orbitFrame(INITIAL, items.length);

  // Collects the elements once and builds the function that writes a frame into them.
  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const cube = root.querySelector<HTMLElement>("[data-cube]");
    const chips = Array.from(root.querySelectorAll<HTMLElement>("[data-chip]"));
    const rings = new Map(
      Array.from(root.querySelectorAll<SVGPathElement>("[data-ring]")).map((el) => [
        el.dataset.ring,
        el,
      ]),
    );
    const wires = (side: string) =>
      chips.map((_, index) => {
        const group = root.querySelector<SVGGElement>(`[data-wire="${side}-${index}"]`);
        return {
          group,
          path: group?.querySelector("path") ?? null,
          dots: group ? Array.from(group.querySelectorAll("circle")) : [],
        };
      });
    const back = wires("back");
    const front = wires("front");
    const satellites = (side: string) =>
      Array.from({ length: SATELLITES }, (_, index) =>
        root.querySelector<SVGCircleElement>(`[data-satellite="${side}-${index}"]`),
      );
    const satBack = satellites("back");
    const satFront = satellites("front");

    draw.current = () => {
      const s = state.current;
      const frame = orbitFrame({ ...s, still: reduce }, chips.length);
      if (cube) cube.style.transform = frame.cube;
      rings.get("outer-back")?.setAttribute("d", frame.rings.outerBack);
      rings.get("outer-front")?.setAttribute("d", frame.rings.outerFront);
      rings.get("inner-back")?.setAttribute("d", frame.rings.innerBack);
      rings.get("inner-front")?.setAttribute("d", frame.rings.innerFront);
      frame.chips.forEach((chip, index) => {
        const el = chips[index];
        el.style.transform = chipTransform(chip);
        el.style.opacity = chip.opacity.toFixed(2);
        el.style.zIndex = String(chip.zIndex);
        const shown = chip.front ? front[index] : back[index];
        const hidden = chip.front ? back[index] : front[index];
        hidden.group?.setAttribute("display", "none");
        shown.group?.removeAttribute("display");
        shown.group?.setAttribute("opacity", chip.wireOpacity.toFixed(2));
        shown.path?.setAttribute("d", chip.wire);
        for (const dot of shown.dots) {
          dot.setAttribute("cx", chip.packetX.toFixed(1));
          dot.setAttribute("cy", chip.packetY.toFixed(1));
        }
      });
      frame.satellites.forEach((satellite, index) => {
        const shown = satellite.front ? satFront[index] : satBack[index];
        const hidden = satellite.front ? satBack[index] : satFront[index];
        hidden?.setAttribute("display", "none");
        if (!shown) return;
        shown.removeAttribute("display");
        shown.setAttribute("cx", satellite.x.toFixed(1));
        shown.setAttribute("cy", satellite.y.toFixed(1));
        shown.setAttribute("opacity", satellite.opacity.toFixed(2));
      });
    };

    const resize = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (!width) return;
      state.current.width = width;
      state.current.radiusFactor = width < 500 ? 0.35 : 0.4;
      const unit = UNITS / width;
      for (const dot of root.querySelectorAll<SVGCircleElement>("[data-dot]")) {
        dot.setAttribute("r", String(DOT[dot.dataset.dot as keyof typeof DOT] * unit));
      }
      draw.current();
    });
    resize.observe(root);
    draw.current();
    return () => resize.disconnect();
  }, [reduce]);

  // The loop: only while on screen, never under reduced motion.
  useEffect(() => {
    if (reduce || !active) return;
    let last = performance.now();
    return onFrame((now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state.current;
      s.time += dt;
      s.mx += (s.tmx - s.mx) * 0.06;
      s.my += (s.tmy - s.my) * 0.06;
      if (!drag.current?.moved) {
        s.rotation += s.velocity * dt;
        s.velocity += ((s.hold ? 0 : BASE_SPEED) - s.velocity) * Math.min(1, dt * 1.5);
      }
      draw.current();
    });
  }, [active, reduce]);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const root = event.currentTarget;
    const s = state.current;
    if (!reduce) {
      const rect = root.getBoundingClientRect();
      s.tmx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      s.tmy = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    if (!current.moved) {
      if (Math.abs(event.clientX - current.startX) < DRAG_START) return;
      current.moved = true;
      root.setPointerCapture(event.pointerId);
      root.dataset.dragging = "";
    }
    const now = performance.now();
    const dx = event.clientX - current.x;
    s.rotation += dx * 0.006;
    s.velocity = (dx * 0.006) / Math.max(0.016, (now - current.t) / 1000);
    current.x = event.clientX;
    current.t = now;
    if (reduce) draw.current();
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    if (!current.moved) return;
    delete event.currentTarget.dataset.dragging;
    const s = state.current;
    s.velocity = Math.max(-3, Math.min(3, s.velocity));
    // The click that ends a drag must not open the chip under the pointer.
    suppressClick.current = true;
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 0);
  };

  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const hold = (on: boolean) => {
    state.current.hold = on;
  };

  return (
    <div
      ref={stage}
      className={cn("orbit isolate", className)}
      data-paused={active ? undefined : ""}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        const now = performance.now();
        drag.current = {
          id: event.pointerId,
          startX: event.clientX,
          x: event.clientX,
          t: now,
          moved: false,
        };
      }}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => {
        state.current.tmx = 0;
        state.current.tmy = 0;
      }}
      onClickCapture={onClickCapture}
    >
      <div className="orbit-glow" aria-hidden="true" />
      <svg
        className="orbit-layer"
        style={{ zIndex: 4 }}
        viewBox={`0 0 ${UNITS} ${UNITS}`}
        aria-hidden="true"
        focusable="false"
      >
        <Wires frame={first} side="back" />
      </svg>
      <div className="orbit-core" aria-hidden="true">
        <div
          data-cube=""
          className="orbit-cube"
          style={{ transform: first.cube }}
          suppressHydrationWarning
        >
          <div className="orbit-face">
            {core[0]}
            <br />
            {core[1]}
          </div>
          <div className="orbit-face">
            {core[0]}
            <br />
            {core[1]}
          </div>
          <div className="orbit-face">
            <LogoMark className="orbit-mark" />
          </div>
          <div className="orbit-face">
            <LogoMark className="orbit-mark" />
          </div>
          <div className="orbit-face" />
          <div className="orbit-face" />
        </div>
      </div>
      <svg
        className="orbit-layer"
        style={{ zIndex: 25 }}
        viewBox={`0 0 ${UNITS} ${UNITS}`}
        aria-hidden="true"
        focusable="false"
      >
        <Wires frame={first} side="front" />
      </svg>
      <ul
        aria-label={label}
        className="pointer-events-none absolute inset-0 m-0 list-none p-0"
        onPointerOver={(event) => hold(Boolean((event.target as Element).closest("[data-chip]")))}
        onPointerOut={() => hold(false)}
        onFocus={() => hold(true)}
        onBlur={() => hold(false)}
      >
        {items.map((item, index) => {
          const chip = first.chips[index];
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                data-chip=""
                aria-label={item.short ? item.label : undefined}
                draggable={false}
                className="orbit-chip pointer-events-auto"
                style={
                  {
                    transform: chipTransform(chip),
                    opacity: chip.opacity.toFixed(2),
                    zIndex: chip.zIndex,
                  } as CSSProperties
                }
                suppressHydrationWarning
              >
                <span
                  className="orbit-chip-icon"
                  style={{ background: item.color }}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                {item.short ? (
                  <>
                    <span className="orbit-label-long">{item.label}</span>
                    <span className="orbit-label-short">{item.short}</span>
                  </>
                ) : (
                  item.label
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <span className="stage-tag stage-tag-live" aria-hidden="true">
        live
      </span>
      <span className="stage-tag stage-tag-drag" aria-hidden="true">
        <MoveHorizontal size={15} strokeWidth={1.75} aria-hidden="true" />
        Drag to spin
      </span>
    </div>
  );
}
