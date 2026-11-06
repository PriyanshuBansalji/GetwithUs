# 0014. The final design: light, rounded, 3D on every page

Date: 2026-11-01

## Context

The owner approved a final design, the prototype in `docs/prototype/final-3d.html`, and asked for every public page to be rebuilt in it (`docs/build-final-prompt.md`, plan in `docs/build-final-plan.md`). It replaces the dark Modern Engineering design ([0012](0012-design-modern-engineering.md)) and the interim motion system ([0013](0013-interim-motion-system.md)), and it uses things the old rules banned: a violet category colour, brand logos in their own colours, soft radial glows, marquees, tilt, magnetic buttons, and text animation.

The prototype decides how the site looks and moves. The content files decide what it says: where the two disagree, content wins on facts and structure (four process steps, five service lines plus two agentic products), the prototype on look and motion.

## Decision

This record supersedes 0012 for the public site and changes [0008](0008-no-smooth-scroll.md) and [0011](0011-css-transitions.md) where motion is concerned.

- **Light by default, with a dark toggle.** Semantic tokens with light values on `:root` and dark values under `data-theme="dark"` (and the system dark preference when nothing is stored). The page is light unless the visitor chose dark; a tiny inline script in `<head>` applies the stored choice before first paint, and a header button switches and stores it. The admin stays dark.
- **New fonts.** Bricolage Grotesque for headings, Figtree for body and interface, JetBrains Mono for code and terminals only, all self-hosted through `next/font`.
- **Rounded shapes.** Pill buttons and chips, 22 to 26 px cards, 18 px scenes, 12 px inputs, soft shadows. The corner brackets and the visible layout grid are retired from marketing pages.
- **3D on every page.** The home page uses CSS 3D only (the hero orbit, tilt scenes, the code editor rig, the tool sphere); WebGL above the fold cost the home page about 25 Lighthouse points (0012). Every inner page has one procedural R3F model in its header, shown as a still SVG until the visitor first scrolls, moves the pointer, or presses a key, and never probing WebGL during hydration.
- **Text animation.** A rotating typewriter in the home hero's word slot only; typed lines for search boxes, URL bars, terminals, and chat inputs; headings that rise in line by line, never the above-the-fold `h1`; a typing code editor.
- **Marquees, tilt, and magnetic buttons**, and the hero orbit with drag to spin.
- **Brand logos for tools**, always official artwork from Simple Icons, or a brand's own media kit with its source recorded. A tool without official artwork is shown by name. Logos are never redrawn.
- **A pricing section with placeholders** that never render as promises: a price still marked `[OWNER: ...]` shows "Fixed price after a short scoping call" instead.
- **Motion runs only on screen, reduced motion gets a calm, complete page, and animated text stays readable for screen readers** (the rules are in [design.md](../design.md)).
- **No motion or scroll libraries.** GSAP, Lenis, and Motion from 0013 are removed; motion is small custom components, CSS, and the existing shared frame loop.

## What stays the same

- [0008](0008-no-smooth-scroll.md): native scrolling. No library takes over scrolling.
- Routes, information architecture, all content, the lead pipeline (forms, verification codes, Turnstile, honeypot, rate limits, notifications, `/api/v1/**`), the admin, the database, the security headers and CSP, and the `/design` lab.
- Owner facts stay `[OWNER: ...]` until supplied and render through `known()`; no invented metrics, clients, reviews, or quotes; case studies only with `published` and `permission`.
- `pnpm check` and `pnpm build` gate every phase.

## Consequences

- The guard drops the purple-family and coloured-gradient rules, adds a rule against hand-drawn logo files, and keeps the rest (dashes, emoji, branding, placeholder text, slop vocabulary, custom cursor, forbidden motion imports, fake social proof, the strict owner-placeholder gate).
- Light-theme values from the prototype that fell under 4.5:1 for text are darkened just enough to pass (amber, the success green, the WhatsApp button, the editor's comments and line numbers); the contrast tables are in design.md.
- The visual baselines, Open Graph images, and emails move to the light palette.

## Outcome (2026-11-01)

Built in five phases, each gated by `pnpm check` and `pnpm build`:

1. Rules, this record, and the guard.
2. Tokens for both themes, the theme script and toggle, the fonts, and every primitive, shown on the hidden `/design/final-kit` page.
3. The home page; GSAP and Motion were removed with the components that used them and banned again.
4. The seven service pages, each with a demo and a procedural model.
5. The remaining pages, Open Graph images, and emails.

The service pages' station scene from 0009 (`StationObject`, the four stations, and the seeded world) was retired: every inner page now mounts its own model through `WebGLModel` on the first interaction, which also replaces 0009's settle timer. Measurements are in [handoff.md](../handoff.md).
