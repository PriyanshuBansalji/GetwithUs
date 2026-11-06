# 0011. CSS keyframes for the reveal and transitions, no motion package

Date: 2026-10-31

Update 2026-11-01: the final design ([0014](0014-final-light-3d-design.md)) adds text animation, marquees, tilt, magnetic buttons, demos, and 3D, built as small custom components on CSS and one shared frame loop. The decision stands: no motion package (the interim GSAP and Motion of [0013](0013-interim-motion-system.md) are removed).

## Context

Section 4.6 of the spec names the `motion` package for the hero reveal and for transitions that answer an action (menus, accordion, dialog, toast). Every marketing route must ship under 180 KB of gzipped initial JavaScript, and the pages measured between 172 and 178 KB without it.

## Decision

The reveal and every transition are CSS keyframes defined in `src/styles/globals.css` and applied through Tailwind utilities (`animate-reveal`, `animate-menu-in`, `animate-dialog-in`, `animate-accordion-down`, and the rest). Radix exposes `data-state` attributes, so open and close animations need no JavaScript. The hero reveal plays on the first page load only (not on client-side navigation back to home), through the `data-reveal` attribute set by `RevealOnce`. `prefers-reduced-motion` disables all of them in CSS. `motion` was recorded in [0001-versions.md](0001-versions.md) but never installed.

## Consequences

- Zero JavaScript for motion; the budget stays met.
- The same timings and easing as the spec (150 to 250 ms ease-out, the 500 ms reveal with a 60 ms stagger).
- Spring physics or layout animations would need the package later; nothing in the current design uses them.
