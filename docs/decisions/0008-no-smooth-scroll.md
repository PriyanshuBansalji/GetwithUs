# 0008. Native scrolling, no smooth scroll library

Date: 2026-10-31

Update 2026-11-01: the home page's scroll-driven scene was removed in [0012](0012-design-modern-engineering.md), and with it `useScrollProgress` and the camera rig. The decision stands: scrolling is native. The section reveals are one-time CSS animations started by an IntersectionObserver, and the home page blueprint (figure 02) reads card positions on passive scroll events, once per frame, to place its slabs.

Update 2026-11-01, later: the interim motion system ([0013](0013-interim-motion-system.md)) briefly added Lenis; the final design ([0014](0014-final-light-3d-design.md)) keeps this decision and removes it again. Scrolling is native.

## Context

Scroll-driven 3D sites often add Lenis, Locomotive, or GSAP ScrollTrigger to smooth the scroll and sync animation. Those take over the browser's scrolling, add JavaScript to every page, and tend to break keyboard scrolling, find in page, anchor links, and assistive technology.

## Decision

Native scrolling only. `useScrollProgress` reads `scrollY` on passive scroll events and writes progress to the scene store at most once per frame. The camera rig smooths the result itself with frame-rate independent damping (`MathUtils.damp`). No animation library is installed for scrolling.

## Consequences

- Scrolling behaves exactly as the visitor's browser and settings expect, including reduced motion.
- The smoothness lives in the 3D layer only, where it is needed, at no cost to pages without a scene.
- There is no scroll hijacking to tune or debug across browsers.
