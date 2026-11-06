# Design system

Concept: the final design. A light, premium site with depth: white and soft-grey surfaces, one teal accent, rounded cards with soft shadows, and a small 3D object or scene on every page that shows the work rather than describing it. A dark theme is one click away. The reference is `docs/prototype/final-3d.html`; the decision is [decisions/0014-final-light-3d-design.md](decisions/0014-final-light-3d-design.md).

Principles:

1. Show the work. Each page has one signature 3D piece and demos (a chat, a call, an editor typing code, a browser building itself) instead of claims.
2. Light by default. The dark theme is a choice the visitor makes, remembered on their device.
3. One accent. Teal is for actions, links, focus, and highlights. Category colours mark the five kinds of work and are used for icons and dots, never for text.
4. Motion runs only on screen and only when the visitor allows it; under reduced motion the page is complete and still.
5. The text is always real. Animated copies are decoration; the full text is in the DOM for screen readers and search engines.

## Tokens

Defined once in `src/styles/tokens.css` as semantic CSS variables, exposed to Tailwind 4 as theme variables (`bg-card`, `text-body`, `border-line`). Tailwind's default palette stays cleared (`--color-*: initial`), so no other colour can be used through a class. Light values sit on `:root`; dark values under `:root[data-theme="dark"]`, and under `prefers-color-scheme: dark` for `:root:not([data-theme="light"])`.

| Token                                                 | Light                                                 | Dark                                                  | Use                                               |
| ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------- |
| `--bg`                                                | `#FFFFFF`                                             | `#0E1115`                                             | Page background                                   |
| `--bg-soft`                                           | `#F4F7F9`                                             | `#12161B`                                             | Alternating bands, scene backgrounds              |
| `--card`                                              | `#FFFFFF`                                             | `#161B22`                                             | Cards, panels, inputs                             |
| `--card-2`                                            | `#F7F9FB`                                             | `#1B212A`                                             | Nested surfaces                                   |
| `--ink`                                               | `#0F1B2D`                                             | `#E9EEF3`                                             | Headings and primary text                         |
| `--body`                                              | `#46515F`                                             | `#A9B4C0`                                             | Body text, leads                                  |
| `--muted`                                             | `#5B6673`                                             | `#8E9AA7`                                             | Captions, meta, labels                            |
| `--line`                                              | `#E4E9EE`                                             | `#232B35`                                             | Borders and dividers                              |
| `--line-2`                                            | `#D3DBE2`                                             | `#323C48`                                             | Strong borders, dashed tracks                     |
| `--accent`                                            | `#0E7C86`                                             | `#22D3EE`                                             | Primary buttons, links, focus, highlights         |
| `--accent-ink`                                        | `#FFFFFF`                                             | `#06222A`                                             | Text on the accent                                |
| `--accent-soft`                                       | teal at 10%                                           | cyan at 12%                                           | Tints behind accent elements                      |
| `--glow`                                              | teal at 30%                                           | cyan at 38%                                           | Shadows and radial glows behind 3D                |
| `--dot`                                               | `#D6DFE6`                                             | `#222A33`                                             | The 24 px dotted background                       |
| `--hdr`                                               | white at 86%                                          | ink at 86%                                            | Header background, blurred                        |
| `--shadow`, `--shadow-lg`                             | soft navy                                             | soft black                                            | Card elevation                                    |
| `--chip`, `--face`                                    | white                                                 | `#1A2029`, card at 94%                                | Chips, 3D faces                                   |
| `--cta`, `--cta-ink`, `--cta-body`                    | `#0F1B2D`, white, `#C3CDD8`                           | `#151B23`, `#E9EEF3`, `#A9B4C0`                       | The dark closing band                             |
| `--amber`                                             | `#A05F00`                                             | `#F5B54A`                                             | Live indicators only                              |
| `--ok`                                                | `#127A43`                                             | `#3EE08A`                                             | Success and check marks                           |
| `--c-web`, `--c-mob`, `--c-data`, `--c-ai`, `--c-mkt` | `#2563EB`, `#7C3AED`, `#0E7C86`, `#D9480F`, `#BE185D` | `#6B9BFF`, `#A78BFA`, `#22D3EE`, `#FF9F5A`, `#F472B6` | Category icons and dots (3:1 or more, never text) |
| `--ed-bg`, `--ed-bar`, `--ed-line`                    | `#0F1B2D`, `#0B1524`, `#1D2B40`                       | `#0B0F14`, `#080B0F`, `#18212C`                       | The code editor, dark in both themes              |

Four light values differ from the prototype so text passes 4.5:1: `--amber` (was `#B86E00`), `--ok` (was `#16864B`), the WhatsApp button green `#15803D` (was `#1F9D55`), and the editor's comment `#7F8FA6` and line-number `#76859C` colours.

### Contrast

Light:

| Text       | on `--bg` | on `--bg-soft` | on `--card` | on `--card-2` |
| ---------- | --------: | -------------: | ----------: | ------------: |
| `--ink`    |     17.28 |          16.07 |       17.28 |         16.38 |
| `--body`   |      8.07 |           7.50 |        8.07 |          7.65 |
| `--muted`  |      5.84 |           5.43 |        5.84 |          5.54 |
| `--accent` |      4.95 |           4.60 |        4.95 |          4.69 |
| `--amber`  |      5.08 |           4.72 |        5.08 |          4.82 |
| `--ok`     |      5.40 |           5.02 |        5.40 |          5.11 |

Dark:

| Text       | on `--bg` | on `--bg-soft` | on `--card` | on `--card-2` |
| ---------- | --------: | -------------: | ----------: | ------------: |
| `--ink`    |     16.21 |          15.56 |       14.82 |         13.86 |
| `--body`   |      8.99 |           8.63 |        8.22 |          7.69 |
| `--muted`  |      6.61 |           6.34 |        6.04 |          5.65 |
| `--accent` |     10.47 |          10.05 |        9.57 |          8.96 |
| `--amber`  |     10.45 |          10.02 |        9.55 |          8.93 |
| `--ok`     |     11.02 |          10.58 |       10.08 |          9.43 |

Other pairs: `--accent-ink` on `--accent` 4.95 (light) and 9.15 (dark); `--cta-ink` on `--cta` 17.28 and 14.83; `--cta-body` on `--cta` 10.74 and 8.23; editor text `#D6DEEB` 12.76 and 14.19, comments 5.25 and 5.84, line numbers 4.61 and 5.13; the status bar `#E8FBFD` on `#0E7C86` 4.63; white on the WhatsApp button 5.02. Every text pair is at or above 4.5:1 and body text at or above 7:1. Check contrast after any change to a token.

## Theme

- The page is light unless the visitor chose dark. Without a stored choice the inline script in the root layout's `<head>` sets `data-theme="light"`; with one, it applies it before first paint, so there is never a flash. `<html>` carries `suppressHydrationWarning`.
- The toggle is a `<button>` in the header with a sun or moon icon and an `aria-label` naming the theme it switches to. It stores `light` or `dark` in `localStorage` (inside try/catch) and dispatches a `themechange` event; 3D panels re-read their colours on it.
- The admin is always dark (`data-theme="dark"` in its layout).

## Type

Bricolage Grotesque (600, 700, 800) for headings, Figtree (400 to 700) for body and interface, JetBrains Mono (400, 500) for code and terminals only, all through `next/font`, self-hosted. Use the `type-*` utilities from `src/styles/globals.css`, never raw sizes:

| Utility             | Size                       | Line height | Tracking |
| ------------------- | -------------------------- | ----------- | -------- |
| `type-display` (h1) | `clamp(44px, 5.6vw, 78px)` | 1.02        | -0.04em  |
| `type-h2`           | `clamp(34px, 4.4vw, 54px)` | 1.04        | -0.03em  |
| `type-h3`           | 24 to 27 px                | 1.15        | -0.02em  |
| `type-lead`         | 18 to 19 px                | 1.6         | 0        |
| `type-body`         | 16 to 17 px                | 1.6         | 0        |
| `type-small`        | 14 px                      | 1.5         | 0        |
| `type-code`         | 14 px, mono                | 1.75        | 0        |

Sentence case everywhere. Body text stays under about 70 characters a line. Heading levels never skip; when a design calls for a smaller look, keep the level and change the utility.

## Shape and surfaces

- Radii: buttons and chips are pills; cards 22 to 26 px; scenes inside cards 18 px; inputs 12 px.
- Elevation comes from `--shadow` and `--shadow-lg`, never borders alone.
- The hero and process sections sit on the dotted background (`--dot`, 24 px); other sections alternate between `--bg` and `--bg-soft` bands.
- Soft radial glows (`--glow`) sit behind 3D objects; they are the only gradients.
- The WhatsApp button floats bottom right with a safe-area inset, only when the phone number is known; it is icon-only below 600 px.

## Components

`src/components/ui` holds the kit (Button, Field, Input, Select, Checkbox, RadioGroup, ChipGroup, CodeInput, Dialog, Sheet, DropdownMenu, Tooltip, Tabs, Accordion, Badge, Table, Skeleton, EmptyState, ErrorState, Toast, Container, Section, Prose, Logo, Icon), restyled to the tokens above. `Logo` draws the brand mark and the outlined wordmark from `src/lib/brand.ts` in the theme tokens `--brand-tile`, `--brand-mark`, `--ink`, and `--accent`; the logo itself, its colours, files, and rules are in [brand/README.md](brand/README.md). `TechLogo` renders a tool's official mark from Simple Icons (or `public/logos/` with a recorded source), with a title and label, in the brand colour or `currentColor` where the brand colour falls under 3:1 on the surface.

Motion and 3D primitives (`src/components/motion`, `src/components/three`), all client-only, each reserving its space, pausing off screen, and drawing a finished still state under reduced motion:

| Primitive                       | What it does                                                                                                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Typewriter`                    | Types and deletes a rotating list of words; the home hero's word slot only                                                                                                               |
| `TypedText`                     | Types one string once when it enters the screen: search queries, URL bars, terminal lines, chat input                                                                                    |
| `CodeTypewriter`                | The editor: tabs, gutter, a small tokenizer with syntax colours, status bar, a terminal line after each file; loops while on screen                                                      |
| `RevealText`                    | Headings rise in line by line (word by word when short), once, 60 ms apart, 600 ms; never the above-the-fold `h1`                                                                        |
| `Marquee`                       | A duplicated track looping by translateX, edge fade, pauses on hover and focus, reversible                                                                                               |
| `TiltScene`                     | A card tilting toward the pointer (up to 9 degrees) whose `Layer` children sit at different depths and lift further on hover                                                             |
| `Orbit3D`                       | The hero: a CSS 3D cube, a tilted ring of service chips sorted by depth, wires with travelling packets, an inner ring with satellites, parallax, drag to spin                            |
| `TagSphere`                     | Tool chips with logos on a sphere; auto-rotates, drags with inertia, category buttons highlight a group                                                                                  |
| `ProcessStepper`                | Circles on a dashed track with a fill and a glowing runner; auto-advances every 2.8 s on screen, pauses 9 s after a click                                                                |
| `FloatingTiles`, `RotatingSeal` | Logo tiles bobbing at different depths; circular text turning on a path                                                                                                                  |
| `ChatDemo`, `CallDemo`          | A WhatsApp-style chat and a call screen playing scripts from `src/content/demos.ts`                                                                                                      |
| `WebGLModel`                    | An inner page's R3F model in its header: a still SVG until the first scroll, pointer move, or key press, then the scene at 30 fps, paused off screen, re-reading colours on theme change |
| `TiltCard`, `LazyWhenNear`      | Kept from earlier work: pointer tilt, and loading below-the-fold code when it comes near. Buttons never move toward the pointer (the magnetic pull was removed at the owner's request)   |

Service page demos (`src/components/services/demos`), each rendering its finished state first (what screen readers and reduced motion get, with a visually hidden summary), then replaying while on screen through `useDemoLoop`, and labelled "Example data" or "Example conversation":

| Demo           | Page               | What it shows                                                                                                       |
| -------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `WebBuildDemo` | Web development    | The URL types, the wireframe draws, content fills, the checklist ticks, then a CMS edit updates the live heading    |
| `AppFlowDemo`  | App development    | Sign-in, booking, and payment screens slide, a push drops in, then the App Store and Google Play release chips tick |
| `WorkflowDemo` | Agentic automation | Five workflow nodes light in turn while the log types each line                                                     |
| `SearchDemo`   | Digital marketing  | A local search types, the client's result rises to the top, a dashboard draws without numbers                       |
| `HubDemo`      | Custom software    | The client's app with spokes to five systems and data flowing, beside a typing deploy log                           |

The WhatsApp bot and calling agent pages use `ChatDemo` and `CallDemo`; the WhatsApp page's note adds `WhatsAppWindow`, the 24-hour window as a timeline.

Page models (`src/components/three/models`, procedural, in the theme's colours, each with a still drawing in `ModelStill`): a glass browser (web), a phone cycling screens (app), an agent node graph (agentic), a phone with floating bubbles (WhatsApp), a handset in sound rings (calling), a funnel with falling particles (marketing), server blocks and a hub (custom software), the five on a turntable (`/services`), four platforms lighting in turn (`/process`), the cube with the commitment words orbiting (`/about`), folders that fan out (`/work`, closed while empty), a device frame with the screenshot (case studies), a paper plane around an envelope (`/contact`), a cube gaining a face per brief step (`/start`), a still shield and document (legal), and the cube drifting from an empty orbit (404).

## Motion

Allowed, and only in these places:

1. The home hero's word slot (`Typewriter`) and the hero orbit (`Orbit3D`).
2. Typed lines in demos and interfaces (`TypedText`, `CodeTypewriter`), and the chat and call demos.
3. Heading reveals (`RevealText`), once, never on the above-the-fold `h1`.
4. Marquees of tool logos and industries.
5. Tilt on cards and scenes, and the editor rig following the pointer (fine pointers only). Buttons stay still under the pointer; the primary button's glow grows on hover.
6. The tag sphere, the process stepper, floating tiles, the rotating seal, and the closing band's rings and glow.
7. Each inner page's WebGL model.
8. Transitions that answer an action (menus, accordion, dialog, sheet, toast, tabs, theme switch), 150 to 300 ms, ease-out, and loading states.

No library takes over scrolling ([decisions/0008-no-smooth-scroll.md](decisions/0008-no-smooth-scroll.md)), and there is no motion package ([decisions/0011-css-transitions.md](decisions/0011-css-transitions.md)): motion is CSS plus small components on one shared frame loop.

## Hard rules checklist

Run `pnpm guard` (part of `pnpm check` and `pnpm build`); it enforces the mechanical ones under `src/`. The rest need a person.

- [ ] **Motion runs only on screen.** Every looping animation pauses when off screen or in a background tab (IntersectionObserver plus `visibilitychange`).
- [ ] **Reduced motion gets a calm site.** `prefers-reduced-motion` gives a complete, still, readable page: no typing (show the final text); marquees stop and become horizontally scrollable; no orbit or sphere drift (draw a still frame; dragging still works); no tilt; chat and call demos show the full conversation.
- [ ] **Decorative text is marked as such.** Pieces that are pure decoration and hidden from assistive technology (the stack sphere, whose chips fade with depth) carry `data-decorative`; the axe suite leaves them out of the contrast check, as WCAG 1.4.3 exempts pure decoration. Everything they show is also real text elsewhere on the page. Text on the accent tint (`--accent-soft`) is ink, not accent: accent on its own tint is 4.3:1.
- [ ] **Animated text stays readable for screen readers.** The full text is always in the DOM. Animated copies are `aria-hidden`; the real text is visually hidden or in an `aria-label`. Demos carry a full transcript in a visually hidden list.
- [ ] **Largest heading:** 80 px on desktop, 44 px on mobile.
- [ ] **Monospace is for code and terminals only.** No monospaced indexes or labels on marketing pages.
- [ ] **Logos are always official artwork,** from Simple Icons or the brand's own media kit with the source recorded in `src/content/tools.ts`; never drawn or approximated. A tool without official artwork is shown by name.
- [ ] **WebGL never above the fold on the home page,** and never probed during hydration; inner-page models mount on the first interaction.
- [ ] No fake social proof: no reviews, testimonials, client logos, star ratings, "trusted by" strips, or quotes. Tool logos are the tools we build with, not clients.
- [ ] No metrics or statistics unless the owner supplies the figure and its source in a content file. Demo charts have axes and shapes, no numbers.
- [ ] No emoji anywhere, including docs and commit messages. Interface icons from lucide; the check and cross marks are typographic and allowed.
- [ ] No em dashes or en dashes in copy, comments, emails, or docs. Use a comma, period, colon, or "to" for ranges.
- [ ] No stock photography or AI imagery. Only 3D scenes, hand-made SVG scenes, official logos, and real photos or screenshots with permission.
- [ ] No banned vocabulary (the guard lists it, for example "seamless", "cutting-edge", "unlock", "leverage", "elevate", "harness").
- [ ] No custom cursors or cursor effects. Magnetic buttons are allowed.
- [ ] No template or tool branding ("Built with", "Powered by", Next.js or Vercel badges).
- [ ] No lorem ipsum, `TODO`, `FIXME`, commented-out code, or unused exports.
- [ ] Sentence case for every heading, label, and button.
- [ ] Every call to action names what happens ("Send and verify", "Get a quote for this"), never "Submit" or "Learn more".
- [ ] Every page has a unique title (under 60 characters) and description (under 160), a canonical URL, an Open Graph image, and JSON-LD where relevant.
- [ ] Every field has a visible label, an associated error, and works by keyboard; every interactive element shows the accent focus ring (2 px, 3 px offset).
- [ ] Everything that can fail has a failure state the user can act on, with a reference ID where useful.
- [ ] Owner facts are written as `[OWNER: ...]` until supplied and shown through `known()`, so a placeholder never renders as a promise.
