# 0012. The live site adopts the Modern Engineering design

Date: 2026-11-01

Status: superseded for the public site by [0014](0014-final-light-3d-design.md) (light, rounded, 3D on every page). Its finding that WebGL above the fold costs the home page about 25 Lighthouse points still shapes 0014.

## Context

The site shipped on the spec's "one light" design: an amber lamp as the only accent, Schibsted Grotesk, rounded cards, headings capped at 44 px, and a scroll-driven 3D scene behind the home page. The design lab (`/design`, [design-lab/README.md](../design-lab/README.md)) explored five directions, scored them, and the owner selected D, Modern Engineering, then asked for it to replace the live design on every page. That changes rules the spec set: the accent colour, the fonts, the heading sizes, the corner radii, scroll reveals, and the home page's 3D scene.

## Decision

- Tokens keep their names where the role is unchanged (`ink`, `fog`, `line`, and steps) and take D's values; the accent token is renamed from `lamp` to `signal` (`#2CD5E6`), with `signal-2` for hover and `signal-tint` for icon tiles. New tokens: `ink-0` (footer), `ink-1` (raised sections), `grid`. Radii drop to 2 px for controls and 0 for panels, which carry corner brackets instead.
- Type is Archivo (headings at 92 percent width, up to 60 px) and JetBrains Mono for small lowercase labels only. The Open Graph images use a static Archivo SemiBold TTF in `src/assets/fonts`.
- The home page drops the WebGL scene. Its hero is the copy beside figure 01, an SVG diagram of the four service lines around the client's business. It first shipped with pulses that ran three passes and stopped; at the owner's request (2026-11-01) it became a live circuit that runs while on screen: current along the wires, packets fired from each service into the core, ripples, and turning rings, paused off screen and in background tabs, and still under reduced motion. It is CSS and SVG animation with a small pause controller (`DiagramLive`). The scroll-driven moment the old scene gave the page moves to figure 02, a blueprint pinned beside the service cards: an isometric line drawing of four slabs, one per service line, that drop into place and turn cyan as their cards pass (scrubbing both ways), with a chart rising on the last slab and an uplink that pulses three times once the stack is complete. It is server-rendered SVG driven by a small scroll controller (`BlueprintFigure`, `BlueprintController`), so it costs 1.3 KB of JavaScript and no WebGL. The service pages keep their 3D station panels, framed in D's bracketed figure and lit in cyan. The scroll-driven camera rig, the scroll progress in the scene store, and the `?no3d=1` test switch are removed.
- Sections may reveal as they enter (`.reveal`), never on a hero, and off under reduced motion. The lab used CSS scroll-driven animation (`animation-timeline: view()`), but that ties opacity to scroll position, so a block resting at the fold of an unscrolled page stays half faded and its text fails contrast (Lighthouse caught it on `/services` and `/about`). The live site uses a small IntersectionObserver instead (`RevealObserver`): blocks on screen at load are never hidden, blocks below the fold fade up once over 600 ms as they enter, and without JavaScript nothing is hidden.
- Content, routes, forms, the admin, and the information architecture are unchanged. The brand name is written GetWithUs, as in the brief, and the tagline "Build with us. Grow with us." appears in the hero and footer.

[design.md](../design.md) is rewritten to describe the result; its hard rules now allow 60 px headings and the section reveals, and add "no endless animation".

## Consequences

- No WebGL code loads on the home page. Its initial JavaScript went from 176.3 to 174.6 KB gzipped (including the reveal observer, the blueprint controller, and the circuit's pause controller), and the three, fiber, and drei chunk now loads on service pages only. A WebGL version of figure 02 was tried first and dropped: even deferred, its 1 x 1 WebGL support probe ran during hydration and started the GPU process, costing the home page about 25 Lighthouse points. The probe now runs only when a service panel is about to mount.
- [0009-scene-mount-timing.md](0009-scene-mount-timing.md) now applies to the service page panels only, and [0008-no-smooth-scroll.md](0008-no-smooth-scroll.md) still holds: the blueprint reads native scroll positions and never takes over scrolling.
- Every surface changed colour at once because components use tokens; the admin, forms, emails, icons, and Open Graph images moved to cyan with no per-component work beyond the rename.
- The visual baselines (`tests/e2e/visual.spec.ts-snapshots`) were regenerated for Windows; the Linux set must be refreshed from the CI artifact before CI's visual job passes again.
- The design lab stays at `/design` (noindex, framed only by itself) as the record of the decision.
