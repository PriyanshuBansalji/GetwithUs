# GetWithUs: final build master prompt

Paste everything below the line into Claude Code, opened at the root of the `getwithus` repository. Before you start, copy `getwithus-3d-prototype.html` into the repo at `docs/prototype/final-3d.html`.

---

## 0. Your role and the goal

You are finishing the GetWithUs website in this repository. The owner has approved a **final design**: the light, premium, 3D prototype in `docs/prototype/final-3d.html`. Your job is to rebuild every public page of the site in that design, with 3D models and contextual text animation on every page, while keeping all the content, routes, forms, the lead pipeline, and the admin that already exist.

Two sources of truth, and they never swap roles:

| Question                   | Source of truth                                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How does it look and move? | `docs/prototype/final-3d.html` (open it in a browser and read its CSS and JS)                                                                           |
| What does it say?          | `src/content/**` and `src/config/site.ts`. Keep every existing string. New sections get new content files in `src/content/`, written in the same voice. |

Where the prototype and the content disagree, **content wins on facts and structure, the prototype wins on look and motion**. Examples:

- The prototype shows 5 process steps. The content has 4 (Scope, Build, Launch, Run). Build 4.
- The prototype shows 4 service cards. The catalog has 5 lines plus 2 agentic products. Build all of them.

## 1. Before you write any code

1. Read `AGENTS.md`. This is Next.js 16.4 with Cache Components. Read the relevant guides in `node_modules/next/dist/docs/` before touching routing, caching, metadata, or fonts.
2. Read, in full:
   - `README.md`
   - `docs/architecture.md`, `docs/design.md`, `docs/content.md`
   - `docs/decisions/0002`, `0008`, `0009`, `0011`, `0012`
   - `src/config/site.ts`, `src/content/**`
   - `src/components/three/**`, `src/components/motion/**`, `scripts/guard.mjs`
3. Open `docs/prototype/final-3d.html` and study it: tokens, both themes, every section, and every effect.
4. Write a plan as `docs/build-final-plan.md` that lists:
   - every route and the 3D model and text animations it gets
   - every new content file
   - every rule you change, with the reason
   - the order of work
5. **Stop and show me the plan. List any question you have.** Do not implement until I reply. If anything in this prompt conflicts with the codebase in a way I have not covered, ask instead of guessing.

## 2. Things that must not change

- Routes and information architecture:
  - `/`, `/services`, and `/services/[slug]` for web-development, app-development, agentic-automation, digital-marketing and custom-software
  - `/services/agentic-automation/whatsapp-bot` and `/services/agentic-automation/calling-agent`
  - `/process`, `/about`, `/work`, `/work/[slug]`, `/contact`, `/start`, `/privacy`, `/terms`, the 404 page and the error pages
- The lead pipeline: `submitBrief`, `LeadForm`, `BriefWizard` and its five steps, email verification codes, Turnstile, the honeypot, rate limits, notifications, and the `/api/v1/**` endpoints. Restyle them only; never change their behaviour.
- `/admin` and everything under `src/server`, `src/features`, the database schema, and migrations. Admin stays **dark** (force `data-theme="dark"` in the admin layout) and must keep working.
- The `/design` lab routes. Do not delete them. They must still build.
- Content rules:
  - Owner facts stay as `[OWNER: ...]` until supplied, and anything that shows them uses `known()` so a placeholder never renders as a promise.
  - No invented metrics, clients, reviews, or quotes.
  - Case studies render only when `published` and `permission` are true.
- Security headers and the CSP in `next.config.ts`. The CSP already allows inline scripts, so a small inline theme script in `<head>` is fine. Do not add third-party origins.
- Quality gates: `pnpm check` and `pnpm build` must pass at the end of every phase.

## 3. Phase 0: rewrite the design rules (do this first)

The current `docs/design.md` and `scripts/guard.mjs` describe the old dark "Modern Engineering" design and ban most of what the final design uses. Update them before building, so the guard does not fail your work.

1. Add `docs/decisions/0014-final-light-3d-design.md`. Say that it supersedes 0012 for the public site, and that it changes 0008 and 0011 where motion is concerned. Record:
   - light by default with a dark toggle
   - new fonts
   - rounded cards
   - CSS 3D and WebGL models on every page
   - text animations
   - marquees, tilt and magnetic buttons
   - the hero orbit
   - brand logos for tools
   - a pricing section with placeholders
   - what stays the same

   Keep 0008: no smooth-scroll library takes over scrolling.

2. Rewrite `docs/design.md` to describe the final system (tokens, type, components, motion inventory, hard rules), in the same style as today.
3. Update `scripts/guard.mjs`:

   **Keep these rules:**
   - em and en dashes
   - emoji
   - template branding
   - placeholder text (`TODO`, lorem ipsum)
   - slop vocabulary
   - custom cursor
   - forbidden motion imports
   - fake social proof (still no testimonials, ratings, or "20+ projects" style claims)
   - the strict `[OWNER:` gate

   **Remove these rules:**
   - the purple-family rule. The final palette has a violet category colour, and brand logos carry their own colours.
   - the coloured-gradient rule. The final design uses soft radial glows behind 3D objects.

   **Add a new rule:** fail on any hand-drawn logo file in `src/` (see section 6).

4. New hard rules to write into `design.md`:
   - **Motion runs only on screen.** Every looping animation pauses when off screen or in a background tab (IntersectionObserver plus `visibilitychange`).
   - **Reduced motion gets a calm site.** `prefers-reduced-motion` gives a complete, still, readable page:
     - no typing: show the final text
     - marquees stop and become horizontally scrollable
     - no orbit or sphere drift: draw a still frame, dragging still works
     - no tilt and no magnetic pull
     - chat and call demos show the full conversation
   - **Animated text stays readable for screen readers.** The full text is always in the DOM. Animated copies are `aria-hidden`, and the real text is visually hidden or in an `aria-label`.
   - **Largest heading:** 80 px on desktop, 44 px on mobile.
   - **Monospace is for code and terminals only.** No more `01 / services` mono indexes on marketing pages.
   - **Logos are always official artwork**, never redrawn.

## 4. Phase 1: tokens, theme, fonts, primitives

### 4.1 Theme: light by default, dark toggle

- Rewrite `src/styles/tokens.css` with semantic tokens. Light values go on `:root`. Dark values go under `:root[data-theme="dark"]` and also under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }`.
- Copy the values from the prototype's `:root` and dark blocks: `--bg`, `--bg-soft`, `--card`, `--card-2`, `--ink`, `--body`, `--muted`, `--line`, `--line-2`, `--accent`, `--accent-ink`, `--accent-soft`, `--glow`, `--dot`, `--hdr`, `--shadow`, `--shadow-lg`, `--chip`, `--face`, `--cta`, `--cta-ink`, `--cta-body`, `--amber`, `--ok`, the five category colours `--c-web`, `--c-mob`, `--c-data`, `--c-ai`, `--c-mkt`, and the editor colours.
- Expose them as Tailwind 4 theme variables so they work as utilities (`bg-card`, `text-body`, `border-line`).
- Keep `--color-*: initial` so no default palette sneaks in.
- Default to **light**, not to the OS setting:
  - Without a stored choice, set `data-theme="light"`.
  - The toggle stores `light` or `dark` in `localStorage` (wrapped in try/catch).
  - A tiny inline script in the root layout `<head>` applies the stored value before first paint, so there is never a flash.
  - The toggle is a real `<button>` in the header, with an `aria-label` that says what it switches to and a sun or moon icon.
- **Recompute the contrast table** for both themes and put it in `design.md`:
  - every text and background pair at or above 4.5:1
  - body text at or above 7:1 where the prototype allows
  - button labels: `--accent-ink` on `--accent` in both themes
- The 3D panels read colours through `getComputedStyle` at mount. Make them re-read on theme change, via a `themechange` event or a store subscription.
- Open Graph images and emails: move them to the light palette, using solid colours only.

### 4.2 Type

- Load these with `next/font/google`, self-hosted (the CSP blocks font hosts):
  - **Bricolage Grotesque** (600, 700, 800) for headings
  - **Figtree** (400, 500, 600, 700) for body and UI
  - **JetBrains Mono** (400, 500) for code and terminals only
- Replace the Archivo setup. For Open Graph images, add a static Bricolage Grotesque TTF and its OFL licence to `src/assets/fonts`.
- New `type-*` utilities:

  | Utility      | Size                       | Line height | Tracking |
  | ------------ | -------------------------- | ----------- | -------- |
  | display (h1) | `clamp(44px, 5.6vw, 78px)` | 1.02        | -0.04em  |
  | h2           | `clamp(34px, 4.4vw, 54px)` | 1.04        | -0.03em  |
  | h3           | 24 to 27 px                |             | -0.02em  |
  | lead         | 18 to 19 px                | 1.6         |          |
  | body         | 16 to 17 px                | 1.6         |          |
  | small        | 14 px                      |             |          |
  | code         | 14 px, mono                |             |          |

  Sentence case everywhere. Body text stays under about 70 characters per line.

### 4.3 Shape and surfaces

- Radii, as in the prototype:
  - buttons and chips: pill
  - cards: 22 to 26 px
  - scenes inside cards: 18 px
  - inputs: 12 px
- Soft shadows from the tokens. Retire the corner `Brackets` and the visible `GridBackdrop` on marketing pages. Use the dotted background (`--dot`, 24 px) on the hero and process sections, and `--bg-soft` bands to alternate sections.
- Floating WhatsApp button, bottom right with a safe-area inset:
  - rendered only when `known(site.contact.phone)` exists
  - links to `https://wa.me/<digits>` with a prefilled message
  - becomes icon-only below 600 px

### 4.4 Motion and 3D primitives

Build these as small, typed, client-only components in `src/components/motion/` and `src/components/three/`. All of them must:

- use `useReducedMotion`
- pause off screen
- render a finished still state under reduced motion
- avoid layout shift by reserving their space

Reuse the existing `MagneticButton`, `TiltCard`, `ScrambleText`, `LazyWhenNear`, `useQuality`, `useSceneMount`, `SceneErrorBoundary` and `Stage` where they fit; extend them rather than duplicating.

| Primitive        | Behaviour (match the prototype)                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Typewriter`     | Types and deletes a rotating list of words. Use it only in the home hero word slot: "We build the [websites, mobile apps, WhatsApp bots, calling agents, software] your business runs on." The rotating words come from content.                                                                                                                                                                                                                                                               |
| `TypedText`      | Types one string once when it enters the screen: search queries, URL bars, terminal lines, chat input.                                                                                                                                                                                                                                                                                                                                                                                         |
| `CodeTypewriter` | The editor from the prototype: tabs, line gutter, a small tokenizer with syntax colours, status bar (language, line and column), a terminal line after each file. Loops through files while on screen; tab clicks switch files.                                                                                                                                                                                                                                                                |
| `RevealText`     | Headings rise in line by line (or word by word for short ones), once, 60 ms stagger, 600 ms. Never on the h1 of a hero above the fold, because that text must paint immediately for LCP.                                                                                                                                                                                                                                                                                                       |
| `Marquee`        | Duplicated track, CSS `translateX(-50%)` loop, edge fade mask, pauses on hover and focus-within, reverse option. Under reduced motion it becomes a static scrollable row.                                                                                                                                                                                                                                                                                                                      |
| `TiltScene`      | Card with pointer tilt (max 9 degrees) whose children are `Layer` items at `translateZ`. On hover the layers lift 1.9 times higher. Pointer-fine devices only.                                                                                                                                                                                                                                                                                                                                 |
| `Orbit3D`        | The hero orbit: the CSS 3D cube "Your business" core, a tilted ring (64 degrees, radius 0.4 of the width, 0.35 below 500 px) with chips depth-sorted (scale and opacity by depth, back chips behind the core). Curved SVG wires from each chip to the core carry glowing packets, plus an inner ring with 3 satellites. Pointer parallax; drag to spin with inertia. Projection maths, z-index layering, and chip scaling on small screens all as in the prototype. Pure CSS/SVG/JS, no WebGL. |
| `TagSphere`      | Fibonacci sphere of tool chips **with logos**. Auto-rotates, drags with inertia, depth scale and opacity. Category buttons highlight their group and dim the rest.                                                                                                                                                                                                                                                                                                                             |
| `ProcessStepper` | Circles on a dashed track, a solid fill up to the active step, and a glowing runner dot. The active circle pulses; it auto-advances every 2.8 s while on screen. Click a step to select it and pause auto-advance for 9 s. The detail card below updates with a fade.                                                                                                                                                                                                                          |
| `FloatingTiles`  | Logo tiles floating at different `translateZ` depths around an object, with a gentle bob.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `RotatingSeal`   | Circular text on an SVG `textPath`, rotating: "shipped weekly · you own the code ·".                                                                                                                                                                                                                                                                                                                                                                                                           |
| `ChatDemo`       | WhatsApp-style chat that plays a script: typing indicator, "typing..." status, bubbles with timestamps and ticks, rich cards (booking, summary), a quick-reply chip row, and a "Talk to a person" handoff chip. Loops while on screen, shows the full script under reduced motion. Scripts live in content files.                                                                                                                                                                              |
| `CallDemo`       | Call screen: caller card, timer, pulsing waveform, a transcript streaming word by word, then a "Summary sent to your CRM" card with fields. Same looping rules.                                                                                                                                                                                                                                                                                                                                |
| `WebGLModel`     | A wrapper around the existing `Stage` that mounts a page's R3F model only when near the viewport (`LazyWhenNear`), at 30 fps, paused off screen. It falls back to a static SVG when WebGL or quality is unavailable and re-reads theme colours on toggle.                                                                                                                                                                                                                                      |

**Performance rule from ADR 0012:** WebGL anywhere above the fold on the home page cost about 25 Lighthouse points. So:

- The home page uses **CSS 3D only** (orbit, tilt scenes, editor, sphere).
- WebGL models live on inner pages and mount only when near the viewport.
- Never run the WebGL support probe during hydration.

## 5. Phase 2: the home page

Section order, with the content source for each:

1. **Header.** Logo, the services mega menu (existing `MegaMenu`, restyled), Process, Work (only when `visibleNav` allows), About, Contact, the theme toggle, and the magnetic primary "Start a project" button, which goes to `/start`. Sticky with a blurred background. Mobile menu restyled.
2. **Hero.**
   - Copy: from `homePage.hero`.
     - Pill: "Now booking projects for [OWNER: month]", rendered only when known.
     - h1 with the `Typewriter` word slot.
     - The lead.
     - Primary and secondary actions.
     - The three `proof` items as green check items.
   - Right column: `Orbit3D`. Its chips are the 5 service lines plus WhatsApp bot and Calling agent from `serviceLines`, each with its service icon and category colour. Clicking a chip opens that service page.
   - Badges: a "live" badge, and a "Drag to spin" hint at the top left.
3. **Tool logo marquee.** Two rows in opposite directions. Caption: "Built on tools any team can maintain after us". Logos from section 6.
4. **Services.**
   - Heading from `homePage.services`, rewritten to the prototype's style only if I approve the new wording in the plan.
   - One `TiltScene` card per service line, with a layered mini scene per service:
     - web: browser
     - app: phone
     - agentic: chat bubbles and a booking card
     - marketing: rising bars
     - custom software: an integration hub with three tool tiles and packets
   - Card text: `summary` and `highlights` from each service file. The agentic card lists its two products as links.
5. **See it working** (new). Tabs: "WhatsApp bot" and "Calling agent".
   - WhatsApp tab: `ChatDemo` with the GetWithUs script in section 7.2.
   - Calling agent tab: `CallDemo`.
   - Beside them, three short points per tab from the product's `whatYouGet`, and a link to the product page.
6. **Real code, in your repo, from week one.**
   - `CodeTypewriter` with four files: `agent.py` (Python), `page.tsx` (TypeScript), `main.dart` (Dart), `schema.sql` (PostgreSQL). Use the prototype's code samples.
   - A language list on the left, using **real logos**.
   - `FloatingTiles` of language logos around the editor, and `RotatingSeal`.
   - The rig tilts with the pointer.
7. **The stack behind your project.** `TagSphere` with logo chips and five category buttons (Web, Mobile, Backend and cloud, AI and automation, Growth and analytics). Tool lists come from section 6.
8. **How a project runs.** `ProcessStepper` with the 4 steps from `processSteps`. The detail card shows `short`, plus "You get" from `youGet`. Link to `/process`.
9. **Pricing** (new, section 8).
10. **What you can hold us to.**
    - The 4 items from `commitments`.
    - Each card gets an icon, a large outlined ghost number at `translateZ(30px)`, and tilt.
    - Card text: `text`, with `expanded` revealed on hover or focus.
11. **Industries we build for** (new). Two marquee rows of icon pills, from `src/content/industries.ts`. Mark the list `[OWNER: confirm industries]` in a comment, and only list industries the owner confirms.
12. **Selected work.** The existing `SelectedWork` logic, restyled as 3D tilt cards. Hidden while there is no published case study.
13. **Questions people ask first** (new). An accordion of general FAQs in `src/content/faqs.ts`, written only from facts already in the content: ownership, fixed price and changes, weekly demos, after launch, and platform costs billed to the client's own accounts.
14. **Closing CTA.**
    - Copy: `closingCta`.
    - Design: the prototype's dark rounded band with the animated rings and a breathing glow.
    - Keep the existing `CtaSection` / `TerminalCta` behaviour wired to `submitBrief`, restyled to match.
15. **Footer.** Restyled. Service links from the catalog without the old indented children, company links, legal links, `site.tagline`, and contact facts shown only when known.

## 6. Logos: real ones only

The owner wants proper logos (the Python logo for Python, the Dart logo for Dart), never a text badge.

1. Add the `simple-icons` npm package, pinned to an exact version and recorded in `decisions/0001-versions.md`. Build one `TechLogo` component that:
   - renders the icon's official SVG path, with a `title` and an `aria-label`
   - takes a `size`
   - uses the brand hex by default
   - switches to `currentColor` in a theme where the brand colour falls under 3:1 contrast against the surface (for example Next.js, Vercel, or GitHub black on the dark theme)
2. Create `src/content/tools.ts`: one entry per tool with name, category, icon slug, and source.
   - **Build the list from the content**: every item in each service file's `tools`, plus the editor languages, plus the marquee and sphere tools from the prototype.
   - Check each slug exists in the installed `simple-icons` version.
   - If a brand is missing there (some companies have asked Simple Icons to remove theirs), download the official SVG from the brand's own press or media kit into `public/logos/`. Record the URL in `source` and follow the brand's usage rules (no recolouring beyond what they allow, no distortion).
   - If you cannot get official artwork for a tool, show its name without a logo and tell me. **Never draw or approximate a logo yourself.**
3. Logos appear in:
   - the tool marquee
   - the stack sphere chips
   - the editor's language list and floating tiles
   - the "Tools" lists on service pages
   - the App Store and Google Play release chips on the app page, using the Apple and Google Play marks from Simple Icons as plain marks, not the official badge artwork
4. The guard fails on any SVG under `src/` whose file name looks like a brand (for example `python.svg`) unless it comes from `simple-icons` or `public/logos/` with a source entry.

## 7. Every page: its 3D model and its text animation

Every page gets one signature 3D piece at the top and contextual text animation in its body.

- **Inner pages:** the signature piece is a WebGL model built procedurally with R3F from primitives and the brand materials, in the existing station style (no downloaded GLB files unless I supply them). It sits in the page header beside the `h1`, at 4:3, with a still SVG fallback.
- **The home page:** CSS 3D only, as described in section 5.

The existing station models (`LatticeSlab`, `Network`, `GlassPane`, `Field`) can be reused or extended.

### 7.1 Per-page plan

| Route                                        | 3D model (header)                                                                                                               | Contextual demo and text animation in the body                                                                                                                                                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/services`                                  | The five service models on a slow turntable, one per line                                                                       | Service cards as `TiltScene`s (same as home), `ProcessStepper`                                                                                                                                                                                                                                                                         |
| `/services/web-development`                  | A browser window made of stacked glass layers that separate and settle (wireframe, layout, content, live)                       | **Browser that builds itself:** the URL bar types a domain (`TypedText`), the wireframe draws in, blocks fill with content, then a checklist ticks: mobile first, accessible, indexed by search engines, editable by your team. Then a **CMS demo**: a cursor edits a heading in an editor panel and the live preview updates with it. |
| `/services/app-development`                  | A phone that turns slowly, its screen cycling sign-in, booking, payment success, and a push notification                        | **Phone flow:** screens slide in, a push notification drops from the top, then release chips with the real Apple and Google Play marks tick "submitted", "in review", "live" (labels only, no dates or numbers).                                                                                                                       |
| `/services/agentic-automation`               | A node graph: a central agent node with tool nodes (WhatsApp, phone, CRM, calendar, sheets) and packets travelling between them | **Workflow run:** trigger "New WhatsApp message", the agent qualifies, a CRM record is created, a call is booked, the team is notified. Each node lights in turn while a log panel types matching lines. Below it, the two product cards link to the WhatsApp bot and Calling agent pages, each with a small preview of its demo.      |
| `/services/agentic-automation/whatsapp-bot`  | A phone with chat bubbles floating out of the screen at different depths                                                        | **`ChatDemo`: a business owner chatting with the GetWithUs WhatsApp bot** (script in 7.2), plus a "How WhatsApp works, in plain terms" panel from the content `note`, with the 24-hour window drawn as an animated timeline.                                                                                                           |
| `/services/agentic-automation/calling-agent` | A handset inside expanding sound rings                                                                                          | **`CallDemo`:** a caller asks about getting a website, the GetWithUs calling agent answers, takes their details, offers a call slot, and the transcript streams word by word. Ends with a "Summary written to your CRM" card (name, need, budget range: not sure yet, next step: scoping call booked).                                 |
| `/services/digital-marketing`                | A 3D funnel with layers for impressions, clicks, enquiries, bookings, and particles flowing down                                | **Search and ads demo:** a search box types a local query (for example "dental clinic near me"), results appear and the client's result rises to the top position, then a campaign dashboard draws its line chart and bars. **No numbers on the charts**: axis labels and shapes only, unless the owner supplies real figures.         |
| `/services/custom-software`                  | A small cloud of server blocks and an integration hub with cables                                                               | **Integration hub:** the client's app in the centre, spokes to CRM, sheets, ERP, payments, and email, with packets moving along them. A terminal types a deploy log (build, migrate, deploy to staging, health check passed).                                                                                                          |
| `/process`                                   | A path of four platforms that light up one by one (scope, build, launch, run)                                                   | A large `ProcessStepper` with `detail`, `needFromYou` and `youGet` per step. **A sample week** strip (Monday plan, Friday demo on staging) animates as it enters. `workingTogether` as three cards.                                                                                                                                    |
| `/about`                                     | The rotating "g" cube from the hero, larger, with the four commitment words orbiting it                                         | Commitments with `expanded` text revealing line by line, "What we believe" with `RevealText`, the team only when `team` has entries, and contact facts only when known.                                                                                                                                                                |
| `/work`                                      | Stacked project folders that fan out                                                                                            | Case study cards as `TiltScene`s. The empty state keeps the existing copy, with the folder model closed.                                                                                                                                                                                                                               |
| `/work/[slug]`                               | The project's own screenshot on a 3D device frame (browser or phone by service)                                                 | Problem, work, outcome with `RevealText`; the stack as logo chips; metrics only when `metricsApproved`.                                                                                                                                                                                                                                |
| `/contact`                                   | A paper plane looping around an envelope                                                                                        | The existing `LeadForm`, restyled; the "Other ways to reach us" details; "Book a call" when the scheduling URL exists.                                                                                                                                                                                                                 |
| `/start`                                     | A cube that assembles one face per completed brief step (5 steps, 5 faces, the sixth when sent)                                 | The existing `BriefWizard`, restyled, with service chips that preselect from `?service=<slug>` (add this if it is missing).                                                                                                                                                                                                            |
| `/privacy`, `/terms`                         | A small, still shield or document model (no loop)                                                                               | Reading progress bar and the table of contents. No other motion on legal text.                                                                                                                                                                                                                                                         |
| 404                                          | The "g" cube drifting away from an empty orbit                                                                                  | Typed line "This page is not in orbit." and links home and to services.                                                                                                                                                                                                                                                                |

### 7.2 Demo scripts (put them in `src/content/demos.ts`)

**WhatsApp bot demo** (home "See it working" tab and the WhatsApp bot page). A customer chats with the GetWithUs bot:

1. Customer: "Hi, I run a dental clinic. Can you build a WhatsApp bot for appointments?"
2. GetWithUs bot: "Yes. It would answer common questions, book into your calendar, and hand the chat to your front desk when someone asks for a person. Which calendar do you use?"
3. Quick replies: "Google Calendar", "Something else". Customer taps "Google Calendar".
4. GetWithUs bot: "That works. Want a 30-minute scoping call? I can offer Tuesday 11:00 or Wednesday 16:30."
5. Customer: "Wednesday 16:30"
6. GetWithUs bot: "Booked." Then a booking card: "Scoping call · Wednesday 16:30 · with the GetWithUs team", and the line "You will get a confirmation by email."
7. A "Talk to a person" chip stays visible throughout.

**Calling agent demo:**

1. The caller asks for a website for their bakery.
2. The agent asks what it needs to do and by when.
3. The caller answers.
4. The agent offers a call slot and confirms it.
5. The summary card appears.

**Agentic workflow, terminal and log lines:** short, plain, present tense (for example "lead qualified: bakery website, timeline 1 to 3 months").

All demo copy follows the content rules:

- no emoji
- no dashes
- no invented numbers
- slots and names are clearly example data
- a small "Example conversation" label on each demo

## 8. Pricing section (new, placeholders for now)

Create `src/content/pricing.ts` and a `Pricing` section on the home page; reuse it on `/services`. The owner will fill in the prices later. Until then everything renders safely through `known()`.

- **One card per service line**, using the existing `pricing` sentence from each service file as the model text:

  | Card                      | Price shown                                                                 | Model text                                                                                                       |
  | ------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
  | Website                   | "from [OWNER: starting price for a website]"                                | "Fixed price for a defined scope. Retainer for ongoing changes."                                                 |
  | Mobile app                | "from [OWNER: starting price for an app]"                                   | same as Website                                                                                                  |
  | WhatsApp or calling agent | "setup from [OWNER: setup price]" and "then [OWNER: monthly fee] per month" | plus `agenticPricing`                                                                                            |
  | Digital marketing         | "[OWNER: monthly retainer] per month"                                       | plus "Ad spend goes from your card to the platforms; we never hold your budget."                                 |
  | Custom software           |                                                                             | "Fixed price for defined scopes. Time and materials, with a weekly cap you set, for audits and open-ended work." |

- Each card also has:
  - three included items from that service's `highlights` or `whatYouGet`
  - a typical timeline as `[OWNER: typical timeline]`
  - a button "Get a quote for this", linking to `/start?service=<slug>`
- The card the owner marks `featured` uses the dark card style from the prototype's pricing.
- **When a price is still a placeholder**, the card shows "Fixed price after a short scoping call" instead of the number. Never render a raw `[OWNER: ...]` string.
- Below the cards, a **"How payment works"** strip:
  - payment schedule `[OWNER: for example a deposit at signing and the rest at milestones]`
  - currency `[OWNER: INR, USD]`
  - tax note `[OWNER: prices exclude GST]`
  - accepted methods `[OWNER: bank transfer, UPI, card]`
  - "Platform costs (WhatsApp conversations, telephony minutes, model usage, ad spend) are billed to your own accounts at cost."

  Hide each line that is still a placeholder.

- No online checkout. This section is information only.
- Add the pricing placeholders to `docs/content.md` and to the owner checklist in `docs/handoff.md`.

## 9. Service page layout (all seven)

Rebuild `ServicePageLayout` in the final style:

- **Header:** `h1`, lead, primary "Start a project" button (to `/start?service=<slug>`), and the page's 3D model.
- **Products list** for agentic automation.
- **Contextual demo** from section 7.1.
- **What you get:** a 2-column checklist with check icons that tick in as the section enters.
- **The content `note`,** where its `placement` says.
- **How we work:** a mini stepper from `howWeWork`.
- **Tools:** logo chips from `tools.ts`.
- **Pricing:** that service's card from `pricing.ts`, plus the `pricing` sentence.
- **FAQs:** accordion.
- **Related services, then the closing CTA.**

Keep the JSON-LD, metadata, Open Graph image routes, and sitemap entries.

## 10. Quality bar

- **Lighthouse on mobile:**
  - home at or above 90 for performance
  - every page at or above 95 for accessibility, best practices, and SEO
  - inner pages at or above 85 for performance, with WebGL deferred
- **Size and stability:**
  - report initial JavaScript per route before and after
  - the home page loads no three.js chunk
  - no layout shift from animations: CLS under 0.05
- **Accessibility:**
  - every interactive element is reachable by keyboard and shows the focus ring
  - axe passes on all public pages
  - demos have an accessible text alternative (the full transcript in a visually hidden list)
- **Both themes:** check every page in light and dark at 1440 px and 390 px, and reduced motion at both sizes.
- **Tests:**
  - update `tests/e2e` for new sections and the theme toggle
  - regenerate the visual baselines for both themes
  - add unit tests for the tokenizer, `known()` handling in pricing, the tools list (every tool has a logo source or an explicit no-logo flag), and the theme script

## 11. Order of work and check-ins

Work in this order. **After each phase:**

- run `pnpm check` and `pnpm build`
- commit with a plain message (no emoji)
- take Playwright screenshots of the changed pages in both themes at 1440 and 390 px
- stop and show me a summary, then wait for "continue"

1. Phase 0: rules, ADR, guard
2. Phase 1: tokens, theme toggle, fonts, primitives (with a hidden `/design/final-kit` page showing every primitive)
3. Phase 2: home page, including pricing, industries, FAQ, demos, logos
4. Phase 3: the seven service pages and their 3D models and demos
5. Phase 4: process, about, work, case study, contact, start, legal, 404, error, and the admin theme lock
6. Phase 5: tests, baselines, Lighthouse report, docs (`design.md`, `content.md`, `handoff.md`, README), and a final list of every `[OWNER: ...]` placeholder still open

If a step forces a trade-off (performance against an effect, a missing logo, a content gap), stop and ask me rather than picking silently.
