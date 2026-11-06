# GetWithUs design lab

Five website directions for GetWithUs, built as working pages on the existing stack, measured, and scored. You selected D, Modern Engineering, which has been refined into the final homepage and design system, and now runs the live site (section 9 and [ADR 0012](../decisions/0012-design-modern-engineering.md)).

| Page                         | What it is                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/design`                    | The gallery: switch between concepts at desktop, tablet, or phone width, compare any two side by side, read the scorecard, colour systems, and recommendation |
| `/design/midnight-tech`      | A: Midnight Tech                                                                                                                                              |
| `/design/minimal-corporate`  | B: Minimal Corporate                                                                                                                                          |
| `/design/creative-studio`    | C: Creative Digital Studio                                                                                                                                    |
| `/design/modern-engineering` | D: Modern Engineering                                                                                                                                         |
| `/design/hybrid-premium`     | E: Hybrid Premium                                                                                                                                             |
| `/design/final`              | The final homepage: D, Modern Engineering, refined (selected)                                                                                                 |
| `/design/system`             | The selected design system, rendered from the same tokens                                                                                                     |
| `/design/hybrid-final`       | Alternative: E, Hybrid Premium, refined with B (highest score)                                                                                                |
| `/design/hybrid-system`      | The alternative design system                                                                                                                                 |

Run locally with `pnpm dev` and open http://localhost:3000/design. The selected design system is documented in [design-system.md](design-system.md); the alternative in [design-system-hybrid.md](design-system-hybrid.md).

## 1. The existing project

The lab is built on the stack already in the repository, without new dependencies:

- Next.js 16.4 App Router with Cache Components, React 19.3, TypeScript, Turbopack.
- Tailwind CSS 4. The production theme clears Tailwind's colour palette (`--color-*: initial` in `src/styles/tokens.css`), so the lab colours everything through `--lab-*` CSS variables and explicit hex values; `bg-white` and similar palette classes generate nothing here.
- Radix primitives (`radix-ui`), lucide icons, `next/font/google`.
- Routing: production pages live in `src/app/(marketing)` and `src/app/(admin)`; the lab is a separate route group, `src/app/(design)/design`, with its own layout and no shared header or footer.
- Existing components reused: `Icon`, `cn`, the brand glyph from `src/lib/brand.ts`. Everything else for the lab lives in `src/components/design-lab` and `src/content/design-lab`.

## 2. Research

Eight reference sites were captured in Chromium at 1440 px (hero, mid page, lower page) and 390 px, and their computed styles were read from the page (fonts, sizes, colours, navigation, buttons). Locomotive answered with a Cloudflare bot check, which was not bypassed, so its notes come from general knowledge of the studio's work rather than a fresh capture.

| Site       | Canvas                   | Headline type                                    | Navigation            | Primary button              | Notable                                                                         |
| ---------- | ------------------------ | ------------------------------------------------ | --------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| Linear     | `#08090A` near black     | Inter Variable 64 px, weight 510, tracking -2%   | 73 px, fixed, frosted | Light pill, 13 px           | Product interface as the hero, customer logos, numbered technical line drawings |
| Vercel     | `#FAFAFA`                | Geist 64 px, weight 400, tracking -6%            | 64 px, sticky         | Black, 6 px radius          | Monochrome, one geometric mark, product diagrams                                |
| Stripe     | White with a colour wave | Söhne 48 px, weight 300, two-tone sentence       | 76 px                 | Purple, 4 px radius         | Dense, real product interface cards; live volume counter                        |
| Framer     | `#000000`                | GT Walsheim 54 px, weight 500, tracking -4%      | 64 px                 | White pill                  | The product canvas is the hero; one blue glow                                   |
| Webflow    | White                    | WF Visual Sans 80 px, weight 600                 | 67 px                 | Blue `#146EF5`, 8 px radius | Customer results with names and figures                                         |
| Raycast    | `#07080A`                | Inter 64 px, weight 600                          | Floating rounded bar  | Light, 8 px radius          | Centered statement over one dramatic light                                      |
| Resend     | `#000000`                | Domaine serif 96 px, weight 400, with Inter body | 58 px, sticky         | Dark pill                   | Editorial serif on black, code cards                                            |
| Locomotive | (not captured)           | Large editorial type                             | Minimal               | Text links                  | Case-study-first, smooth scrolling made by the studio itself                    |

Principles taken from them, not their looks:

1. One accent, and the neutrals do the work. Every site above uses a single action colour.
2. Headlines are large but light: weights 400 to 600, negative tracking of 1 to 6 percent, never heavy bold.
3. The first screen proves something. Product companies show their product; an agency without published case studies proves itself with clarity about scope, process, and ownership.
4. Navigation is 58 to 76 px, sticky, four to six links, one primary action on the right.
5. Buttons change colour on hover in 150 to 300 ms; none of them move.
6. Sections alternate statement and evidence, inside one consistent container.
7. On phones, primary buttons become full width and the menu collapses into one button.
8. Motion demonstrates the product or answers the visitor; none of these sites use cursor effects.
9. Customer logos and named results carry Linear, Stripe, and Webflow. GetWithUs has none it may show yet, so the lab never fakes them: work is labelled as concept projects and trust comes from commitments.

## 3. The five directions

Every concept renders the same content (`src/content/design-lab/content.ts`) in the same order: navigation, hero, introduction, three practices, services, why GetWithUs, process, selected work, contact call to action, footer. Only design differs. Each has a full colour system with exact hex values (`src/content/design-lab/concepts.ts`); the tables below are generated from that file.

### A: Midnight Tech

A deep navy product-company atmosphere: centered statement hero, a console-style visual of the three practices, one electric blue light source, and quiet surfaces.

| Role       | Name            | Hex       | Use                                            |
| ---------- | --------------- | --------- | ---------------------------------------------- |
| Primary    | Deep navy       | `#0A1230` | Brand colour, raised panels                    |
| Secondary  | Navy surface    | `#121C42` | Cards, tab lists, inputs                       |
| Accent     | Electric blue   | `#2563FF` | Primary buttons, active states, the hero light |
| Background | Midnight        | `#060A18` | Page                                           |
| Background | Midnight raised | `#0A1029` | Alternate sections                             |
| Background | Surface         | `#0D1533` | Cards                                          |
| Text       | Primary text    | `#EEF2FF` | Headings and body                              |
| Text       | Secondary text  | `#A8B3D6` | Leads, descriptions                            |
| Text       | Muted text      | `#7D89B0` | Captions, labels                               |
| Text       | Link blue       | `#7AA2FF` | Text links and accents on dark                 |
| Border     | Border          | `#1C2850` | Card and section edges                         |
| Border     | Border strong   | `#2A3A6E` | Inputs, hover edges                            |

- Typography: Sora 600, tracking -0.03em; Manrope 400 and 500. Scale: Hero 40 to 72 px, H2 30 to 44 px, H3 20 px, body 16 to 17 px, small 14 px.
- Buttons: Pill (999 px radius). Primary electric blue with white label; secondary is a navy surface with a strong border. The arrow nudges 2 px on hover; the button itself never moves.
- Cards: Navy surface, 1 px border, 16 px radius. Hover lifts the border to blue and lights a thin blue rule along the top.
- Navigation: Sticky 68 px bar on midnight with a hairline border. Centered links with scroll spy (active link turns white with a blue dot); primary button on the right; full-screen sheet on mobile.
- Hero: Centered: tagline pill, two-line statement, lead, two buttons, then a wide console panel showing the three practices at work.
- Motion: One soft blue light drifts behind the hero over 24 seconds. Sections rise 16 px as they enter. Hover transitions 180 ms.
- Measured contrast: body on page 17.64:1; secondary on page 9.47:1; muted on surface 5.18:1; link blue on page 7.93:1; button label on electric blue 4.88:1.

### B: Minimal Corporate

Calm, enterprise-ready clarity: white and off-white space, charcoal type, one royal blue, and layouts that read like a well-edited proposal.

| Role       | Name           | Hex       | Use                           |
| ---------- | -------------- | --------- | ----------------------------- |
| Primary    | Charcoal       | `#16191F` | Headings, footer, logo        |
| Secondary  | Off-white      | `#F5F6F8` | Alternate sections, tiles     |
| Accent     | Royal blue     | `#1E4FD8` | Primary buttons, links, icons |
| Background | White          | `#FFFFFF` | Page                          |
| Background | Off-white      | `#F5F6F8` | Alternate sections            |
| Background | Blue tint      | `#EAF0FD` | Icon tiles, highlights        |
| Text       | Primary text   | `#16191F` | Headings and body             |
| Text       | Secondary text | `#444B57` | Leads, descriptions           |
| Text       | Muted text     | `#646B78` | Captions, labels              |
| Border     | Border         | `#E4E7EC` | Dividers, cards               |
| Border     | Border strong  | `#CDD2DA` | Inputs, outlined buttons      |

- Typography: IBM Plex Sans 600, tracking -0.02em; IBM Plex Sans 400 and 500. Scale: Hero 36 to 56 px, H2 28 to 40 px, H3 19 px, body 16 to 17 px, small 14 px.
- Buttons: 6 px radius. Primary royal blue with white label; secondary outlined in strong charcoal border. Darker fill on hover, arrow nudge, no movement.
- Cards: Mostly no cards: hairline dividers and columns. Where used, white with a 1 px border and an 8 px radius.
- Navigation: Sticky 72 px white bar with a bottom border. Links with a royal blue underline that draws from the left; text Contact link plus the primary button.
- Hero: Left-aligned statement and buttons with three commitments beneath; on the right a practice overview panel that doubles as navigation.
- Motion: Restrained: underline draws, colour fades, and gentle section reveals. No background movement.
- Measured contrast: body on page 17.60:1; secondary on off-white 8.13:1; muted on off-white 4.96:1; royal blue link on page 6.63:1; button label on royal blue 6.63:1.

### C: Creative Digital Studio

A confident studio voice: black and paper sections, oversized grotesque type, lime used like a highlighter, and compositions that break the even grid.

| Role       | Name          | Hex       | Use                              |
| ---------- | ------------- | --------- | -------------------------------- |
| Primary    | Studio black  | `#0B0B0A` | Hero, practices, footer          |
| Secondary  | Paper         | `#F1EFE8` | Light sections, text on black    |
| Accent     | Signal lime   | `#C8F53C` | Buttons, highlights, hover fills |
| Background | Studio black  | `#0B0B0A` | Dark sections                    |
| Background | Paper         | `#F1EFE8` | Light sections                   |
| Background | Ink surface   | `#161614` | Cards on black                   |
| Background | Paper shade   | `#E8E5DB` | Cards on paper                   |
| Text       | Paper text    | `#F1EFE8` | Text on black                    |
| Text       | Ash           | `#A9A69D` | Secondary text on black          |
| Text       | Ink           | `#0B0B0A` | Text on paper and lime           |
| Text       | Graphite      | `#55534D` | Secondary text on paper          |
| Border     | Rule on black | `#2B2A27` | Dividers on dark                 |
| Border     | Rule on paper | `#D2CEC2` | Dividers on light                |

- Typography: Bricolage Grotesque 700, tracking -0.04em, optical size 96; Bricolage Grotesque 400 and 500. Scale: Hero 48 to 120 px, H2 36 to 72 px, H3 22 px, body 17 px, small 14 px.
- Buttons: Pill. Lime with ink label; on paper, ink with paper label. Hover swaps to the lighter lime; the arrow turns 45 degrees.
- Cards: Flat blocks with no radius on paper; on hover they invert to black with a lime title. Work cards are large, offset into a staggered grid.
- Navigation: Black bar, wordmark left, links with a lime underline that grows from the centre, lime pill on the right; mobile opens a full-screen black menu with large links.
- Hero: Oversized left-aligned statement with one phrase marked in lime, then the lead and buttons pinned to a two-column grid.
- Motion: The lime marker draws in once on load; rows slide their arrows on hover; sections rise as they enter. Bolder than the others but still brief.
- Measured contrast: paper text on black 17.11:1; ash on black 8.09:1; ink on paper 17.11:1; graphite on paper 6.68:1; ink on lime 15.55:1.

### D: Modern Engineering

The site as a technical drawing: graphite surfaces, a visible layout grid, monospaced labels, schematic diagrams, and cyan as the signal colour.

| Role       | Name           | Hex       | Use                                    |
| ---------- | -------------- | --------- | -------------------------------------- |
| Primary    | Graphite       | `#1A1D21` | Panels, navigation                     |
| Secondary  | Steel          | `#2A3037` | Tabs, diagram nodes                    |
| Accent     | Signal cyan    | `#2CD5E6` | Buttons, active states, diagram pulses |
| Background | Carbon         | `#0F1113` | Page                                   |
| Background | Carbon raised  | `#13161A` | Alternate sections                     |
| Background | Panel          | `#171A1E` | Cards                                  |
| Text       | Primary text   | `#E6E9EC` | Headings and body                      |
| Text       | Secondary text | `#A0A8B2` | Leads, descriptions                    |
| Text       | Muted text     | `#848D98` | Mono labels, captions                  |
| Border     | Grid line      | `#1B1F24` | Background layout grid                 |
| Border     | Border         | `#262B31` | Card and table edges                   |
| Border     | Border strong  | `#353C44` | Inputs, hover edges                    |

- Typography: Archivo 600, width 92, tracking -0.02em; Archivo 400 and 500; JetBrains Mono 400 and 500 for labels, steps, and specifications. Scale: Hero 40 to 64 px, H2 28 to 40 px, H3 18 px, body 16 px, mono labels 12 to 13 px.
- Buttons: Square (2 px radius). Primary cyan with dark label; secondary outlined steel. Hover brightens the fill and extends the arrow.
- Cards: Panels with corner brackets instead of rounded corners; hover turns the brackets and border cyan. Lists read like specification tables.
- Navigation: Graphite bar with a hairline border; links with a cyan underline and scroll spy; a mono status tag beside the logo.
- Hero: Split: statement, buttons, and a mono specification on the left; a live system diagram of the three practices on the right.
- Motion: Data pulses travel along the diagram lines in a slow loop; panels reveal as they enter; tab changes cross-fade in 160 ms.
- Measured contrast: body on page 15.53:1; secondary on panel 7.26:1; muted on page 5.63:1; cyan on page 10.60:1; button label on cyan 10.50:1.

### E: Hybrid Premium

Editorial confidence: navy bands for the statement moments, warm off-white pages for reading, a serif display face, minimal cards, and electric blue reserved for action.

| Role       | Name          | Hex       | Use                                  |
| ---------- | ------------- | --------- | ------------------------------------ |
| Primary    | Navy          | `#0B1631` | Hero, navigation, dark bands, footer |
| Secondary  | Warm white    | `#F7F6F2` | Reading sections                     |
| Accent     | Electric blue | `#2052E8` | Primary buttons and links on light   |
| Background | Navy          | `#0B1631` | Dark bands                           |
| Background | Navy raised   | `#12204A` | Cards on navy                        |
| Background | Warm white    | `#F7F6F2` | Light sections                       |
| Background | White         | `#FFFFFF` | Cards on light                       |
| Text       | Ink           | `#0F1424` | Text on light                        |
| Text       | Slate         | `#4A5065` | Secondary text on light              |
| Text       | Navy text     | `#F4F6FB` | Text on navy                         |
| Text       | Mist          | `#AEB7CE` | Secondary text on navy               |
| Text       | Light blue    | `#8EAEFF` | Links and accents on navy            |
| Border     | Rule on light | `#E3E1DA` | Dividers and cards                   |
| Border     | Rule on navy  | `#22305C` | Dividers on dark                     |

- Typography: Instrument Serif 400 for headlines, tracking -0.01em; Instrument Sans 400, 500, and 600 for text and interface. Scale: Hero 44 to 84 px, H2 34 to 56 px, H3 22 px, body 16 to 17 px, small 14 px.
- Buttons: 8 px radius. Electric blue with white label on light, white with navy label on navy; secondary is a text link with a drawn underline.
- Cards: White with a hairline rule and no shadow; hover darkens the rule and draws a blue line across the top. Work uses an asymmetric editorial grid.
- Navigation: Sticky navy bar across every section; quiet links with underline and scroll spy; white primary button.
- Hero: Navy band with a large serif statement left, the lead and buttons right, and a three-part practice index along the bottom edge.
- Motion: A faint light sweeps the hero grid every 14 seconds; sections reveal gently; underlines draw in 220 ms.
- Measured contrast: ink on warm white 16.95:1; slate on warm white 7.39:1; text on navy 16.55:1; mist on navy 8.92:1; button label on blue 6.12:1.

## 4. Interaction and experience

Implemented in all five, with shared, accessible building blocks:

- In-page links scroll smoothly (native `scroll-behavior`, off under reduced motion) and land below the sticky header.
- The navigation marks the section in view (scroll spy) and draws an underline on hover and focus.
- Scroll-triggered reveals use CSS scroll-driven animations. Content is visible by default and only supporting browsers add the rise, so nothing is hidden if scripts fail and the largest paint is never delayed.
- Buttons: the arrow moves 3 px or turns 45 degrees; the button itself never moves.
- Service cards respond on hover (border, fill, or full inversion in C); the practice tabs in A and D work with arrow keys.
- Portfolio cards scale their schematic slightly and change border or title colour on hover.
- The phone menu is a Radix dialog: focus is trapped, Escape closes it, focus returns to the menu button, and choosing a link closes it.
- Background movement: A (drifting light), D (pulses along diagram lines), E (light sweep). B and C have none.

Checked on every concept at 1440, 834, and 390 px in a production build: no console errors or warnings, no horizontal overflow, zero axe violations (WCAG 2.2 AA), keyboard order from the skip link through the navigation, menu behaviour, and scroll spy.

Avoided, as the brief asked: cursor effects, fake 3D, glass panels, AI imagery, stock photography, invented clients, logos, statistics, and quotes. Portfolio images are hand-drawn SVG interface schematics.

## 5. Weighted evaluation

Scores are design judgement anchored to measurements from a local production build: Lighthouse mobile (median of six runs over two rounds on a laptop whose results vary from run to run), initial JavaScript, axe, and the contrast of every declared text pairing. The SEO category reads 63 on every concept only because the lab is deliberately `noindex`.

| Criterion                      | Weight |             A |             B |             C |             D |             E |
| ------------------------------ | -----: | ------------: | ------------: | ------------: | ------------: | ------------: |
| Professional appearance        |    20% |            88 |            90 |            76 |            84 |            92 |
| Brand identity                 |    15% |            72 |            62 |            90 |            80 |            86 |
| UI/UX quality                  |    15% |            86 |            90 |            74 |            80 |            86 |
| Trust and credibility          |    15% |            82 |            90 |            68 |            84 |            92 |
| Visual consistency             |    10% |            88 |            90 |            84 |            88 |            86 |
| Conversion potential           |    10% |            84 |            88 |            76 |            78 |            84 |
| Responsiveness                 |    10% |            88 |            90 |            82 |            84 |            88 |
| Performance and accessibility  |     5% |            86 |            96 |            92 |            82 |            83 |
| **Weighted score**             |   100% |      **83.9** |      **85.9** |      **78.8** |      **82.5** |      **88.0** |
| Lighthouse mobile, median of 6 |        |          97.5 |            99 |            99 |          95.5 |          92.5 |
| Total blocking time            |        | 180 to 270 ms | 110 to 120 ms | 140 to 150 ms | 210 to 380 ms | 170 to 480 ms |
| Initial JavaScript             |        |      196.2 KB |      190.9 KB |      190.9 KB |      196.2 KB |      190.9 KB |
| axe violations                 |        |             0 |             0 |             0 |             0 |             0 |
| Lowest text contrast           |        |        4.88:1 |        4.96:1 |        6.68:1 |        5.20:1 |        6.12:1 |
| Endless animation              |        |           yes |            no |            no |           yes |           yes |

### Evaluation of each direction

#### A: Midnight Tech (83.9)

Strengths:

- The most polished first screen: a centered statement with a console panel that shows all three practices working at once.
- Tabbed services and a horizontal timeline keep a long page compact.
- Dark navy with one light source feels premium without extra decoration.

Weaknesses:

- Navy plus electric blue is the default look of developer tools and SaaS products, so it says less about GetWithUs in particular.
- The console rows are illustrative; some visitors may read them as live client activity.
- The drifting hero light runs forever and costs main-thread time on phones.

Fit for GetWithUs: Strong for engineering and AI buyers; less natural for the Digital Growth practice, where marketing and brand clients expect warmth.

International clients: Familiar to international product teams, which helps credibility but blends in with many SaaS and agency sites.

Conflicts with the current build spec:

- Headings above the 44 px cap in section 2.1 of the build spec
- Scroll-driven section reveals, which section 2.1 rules out for production
- A new accent colour in place of the lamp brand token
- A coloured radial glow, where section 2.1 permits only transparent-to-background fades

#### B: Minimal Corporate (85.9)

Strengths:

- The clearest page: the hero's practice panel doubles as navigation, and the services read like a well-edited proposal.
- Reads as established and low-risk, which procurement and enterprise buyers reward.
- Fastest of the five: no background motion, nothing heavy.

Weaknesses:

- Royal blue on white with IBM Plex is the look of countless IT services firms; it is easy to forget which site you were on.
- Little visual tension, so the brand line has to carry all the personality.

Fit for GetWithUs: Excellent for enterprise and procurement-led buyers; undersells the AI and growth work to founders and startups.

International clients: Very safe internationally: legible, conventional, accessible. The risk is anonymity, not doubt.

Conflicts with the current build spec:

- Headings above the 44 px cap in section 2.1 of the build spec
- Scroll-driven section reveals, which section 2.1 rules out for production
- A new accent colour in place of the lamp brand token
- Light backgrounds, where section 2.2 requires a dark theme

#### C: Creative Digital Studio (78.8)

Strengths:

- The most memorable direction: oversized type, a lime highlighter, and compositions nobody would mistake for a template.
- Service cards that invert on hover make a long list feel lively.
- The lime closing band is the most decisive call to action of the five.

Weaknesses:

- Reads as a design studio more than an engineering partner; CTOs and enterprise buyers may doubt the technical depth.
- Huge type lowers scannability and pushes the lead and buttons down, especially on phones.
- Needed fixes for narrow phones and tablets, a sign the type scale is fragile.

Fit for GetWithUs: Great for brand and growth clients and for founders who value boldness; a weak fit for enterprise software and AI work.

International clients: Distinctive, but a lime and black studio look can feel informal to conservative buyers in some markets.

Conflicts with the current build spec:

- Headings above the 44 px cap in section 2.1 of the build spec
- Scroll-driven section reveals, which section 2.1 rules out for production
- A new accent colour in place of the lamp brand token
- Numbered markers on practices, which are not a sequence

#### D: Modern Engineering (82.5)

Strengths:

- Signals engineering competence on sight: the system diagram, specification tables, and step pipeline feel exact.
- An ownable identity among agencies, with structure that scales to many services.
- Monospaced labels give every section a clear index.

Weaknesses:

- Monospaced, lowercase service names are slower to read than sentence-case text.
- Cold for the Digital Growth practice; the terminal prompt in the closing section is a gimmick.
- The endless pulse animation on the diagram repaints every frame.

Fit for GetWithUs: Ideal for engineering-led and technical buyers; less inviting for marketing, brand, and non-technical founders.

International clients: Respected by technical audiences everywhere; non-technical decision makers may find it intimidating.

Conflicts with the current build spec:

- Headings above the 44 px cap in section 2.1 of the build spec
- Scroll-driven section reveals, which section 2.1 rules out for production
- A new accent colour in place of the lamp brand token

#### E: Hybrid Premium (88.0)

Strengths:

- Feels like a senior consultancy that also ships software: navy authority, warm reading pages, and a serif voice.
- The editorial label column makes long sections easy to scan, and the hero's practice index gives three clear entry points.
- Serves all three practices equally: technical enough for engineering, warm enough for growth, calm enough for AI.

Weaknesses:

- The endless light sweep in the hero added up to 300 ms of blocking time on a simulated phone, the most variable result of the five.
- Some sections leave too much empty space, and the practice cards repeat the service list shown again below.
- A single-weight serif needs discipline: it works for headlines, not for interface labels.

Fit for GetWithUs: The best fit across startups, growing businesses, and enterprises, and across all three practices.

International clients: Reads as premium and established in any market without depending on a trend; the strongest choice for international clients.

Conflicts with the current build spec:

- Headings above the 44 px cap in section 2.1 of the build spec
- Scroll-driven section reveals, which section 2.1 rules out for production
- A new accent colour in place of the lamp brand token
- Light reading sections, where section 2.2 requires a dark theme

## 6. Recommendation and selection

### What the scorecard recommended

Hybrid Premium scored highest (88.0) because it is the only direction that is at once credible to enterprise buyers, warm enough for Digital Growth clients, and distinctive among development agencies. Minimal Corporate came second (85.9) for the opposite reasons: the clearest structure and the fastest page, but the least memorable. A refined version combining the two was built and remains available at `/design/hybrid-final`, with its system at `/design/hybrid-system` and in [design-system-hybrid.md](design-system-hybrid.md).

### What was selected

On 1 November 2026 you chose D, Modern Engineering, to finalize. It is a sound choice for an agency that wants to lead with technical credibility: it shows engineering competence on sight, it is ownable among agency sites, and it keeps the dark theme the build spec asks for. The scorecard above is left as measured; the refinement below targets every weakness that cost D points.

The measurements also taught one rule that shaped both refinements: the three directions with endless background animation (A, D, E) were the three slowest, while B, C, and both refined pages, which have none, scored highest.

## 7. The final homepage: D refined

`/design/final`, built only from the engineering design system in `src/components/design-lab/engineering`. The system is documented in [design-system.md](design-system.md) and rendered at `/design/system`.

| Refinement                | What changed                                                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reading                   | Service names, practice titles, and every paragraph moved from lowercase monospace to sentence-case Archivo. Monospace stays for 11 to 13 px labels, ids, and specifications only.               |
| Service clarity           | The tabs are gone: all eighteen services are visible, grouped in specification tables with an anchor per practice. Practice cards link to their group instead of repeating it.                   |
| Conversion                | The three commitments sit under the hero buttons, a "not sure which practice" prompt follows the practices, and the closing panel drops the fake terminal command for a heading and two actions. |
| Warmth for growth clients | Plain-language summaries lead every practice card and the hero practice index; the diagram gives Digital Growth and AI the same weight as engineering.                                           |
| Typography hierarchy      | H1 40 to 60 px, section headings 30 to 40 px, all Archivo at width 92; one rhythm of 64 px section padding on phones and 96 px from 768 px.                                                      |
| Motion                    | Diagram pulses run three passes when the page opens, then stop. Nothing else moves on its own.                                                                                                   |
| Phones and tablets        | Below 640 px a readable practice list replaces the diagram and buttons go full width; diagram labels are 16 px sans so they stay legible on tablets.                                             |
| Performance               | The phone menu's dialog loads on first use and the tabs are gone.                                                                                                                                |
| Accessibility             | Dismissing the phone menu returns focus to the Menu button. The same bug was found on the live site and fixed there too (`Sheet` and `MobileMenu`).                                              |
| Consistent tokens         | Every value comes from `src/content/design-lab/engineering-system.ts`.                                                                                                                           |

Measured on the same production build in the same session:

|                                          | D as explored        | D refined               |
| ---------------------------------------- | -------------------- | ----------------------- |
| Lighthouse mobile performance            | 98 (runs 97, 98, 98) | 100 (runs 99, 100, 100) |
| Total blocking time                      | 180 ms               | 80 ms                   |
| Initial JavaScript, gzipped              | 195.8 KB             | 177.0 KB (budget 180)   |
| axe violations (WCAG 2.2 AA)             | 0                    | 0                       |
| Horizontal overflow at 390, 834, 1440 px | none                 | none                    |
| Animation that never stops               | yes, diagram pulses  | no, three passes        |
| Focus after closing the phone menu       | Menu button          | Menu button             |

## 8. Technical implementation

- Routes: `src/app/(design)/design/**`, a separate route group with its own layout. Every page is static (`ensureStatic`), `noindex` in metadata and in an `X-Robots-Tag` header, disallowed in `robots.txt`, absent from the sitemap, and not linked from the production site.
- Headers: `next.config.ts` gives `/design` and `/design/*` a CSP with `frame-ancestors 'self'` and `frame-src 'self'`, and `X-Frame-Options: SAMEORIGIN`, so the gallery can frame its own pages. Every other route keeps `frame-ancestors 'none'` and `DENY`.
- Shared building blocks: `LabPage` (CSS variables, fonts, canvas colour, smooth scrolling), `ScrollSpyLinks`, `LabMobileMenu`, `PracticeTabs`, `ProjectArt`, `PracticeIcon`, `LabMark`, and `src/styles/design-lab.css` (reveals, underline, arrow motion, keyframes, reduced motion), all scoped to `[data-lab]` or `lab-` classes.
- Concepts: one component per direction in `src/components/design-lab/concepts`, each loading its own fonts with `next/font`, so a concept's fonts are preloaded only on its own page.
- Selected system (D): tokens in `src/content/design-lab/engineering-system.ts`; components in `src/components/design-lab/engineering` (`EngButton`, `Brackets`, `EngSection`, `EngSectionHeading`, `EngHeader` with `EngMobileMenu` and `EngMenuPanel`, `SystemDiagram`, `EngPracticeCard`, `EngWorkCard`, `EngFooter`, `GridBackdrop`); pages `EngineeringFinal` and `EngineeringSystemReference`.
- Alternative system (E): tokens in `src/content/design-lab/hybrid-system.ts`; components in `src/components/design-lab/hybrid`; pages `HybridFinal` and `HybridSystemReference`.
- Evaluation data: `src/content/design-lab/evaluation.ts` (with `selectedSlug`); contrast maths in `src/lib/color.ts`, with unit tests that fail the build if any declared text pairing in any concept drops below WCAG AA.
- Production: untouched except the phone menu focus fix (`src/components/ui/Sheet.tsx` gained a `returnFocusRef` prop, passed by `src/components/layout/MobileMenu.tsx`). `pnpm check`, `pnpm build`, and the end-to-end suite pass.

## 9. Moving D into production

Done on 2026-11-01, recorded in [ADR 0012](../decisions/0012-design-modern-engineering.md) and described in [design.md](../design.md). Every marketing page, the forms, the admin, the emails, the icons, and the Open Graph images moved to D; content and routes are unchanged; the 3D scene was retired from the home page and kept for the service page panels (step 4 below), and the home page's scroll-driven moment became figure 02, an isometric blueprint that assembles beside the service cards. One change from the lab: section reveals play once on entry (IntersectionObserver) instead of following scroll position, because scroll-linked fades left text at the fold below contrast. The spec in `docs/build-prompt.md` is left as written; the rule changes below are listed as deviations in [handoff.md](../handoff.md). Step 6 remains open on the launch checklist.

D keeps the dark theme, so it changes fewer rules in `docs/build-prompt.md` than E would, but these change:

| Spec rule                                         | D refined                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| Largest heading 44 px desktop, 32 px mobile (2.1) | H1 40 to 60 px, section headings 30 to 40 px                       |
| Accent is the lamp colour `#F0B35A` (4.2)         | Signal cyan `#2CD5E6` on carbon `#0F1113`                          |
| Ink `#0B0E13` and fog greys (4.2)                 | Carbon and graphite scale with cool greys (see design-system.md)   |
| Schibsted Grotesk only (4.3)                      | Archivo for text, JetBrains Mono for small labels                  |
| Radii 4, 6, 10, 16 px (4.4)                       | 2 px controls; square panels marked by corner brackets             |
| No per-section entrances (2.1)                    | Scroll-linked reveals, CSS only, off under reduced motion          |
| The 3D scene is the homepage's visual centre (5)  | The system diagram is the hero visual; no 3D scene on the homepage |

Suggested path once approved:

1. Move the tokens from `engineering-system.ts` into `src/styles/tokens.css` (replacing the lamp palette) and the fonts into the root layout.
2. Port the engineering components into `src/components/ui` and `src/components/sections`, and the header and footer into `src/components/layout`.
3. Rebuild the marketing pages on them: home, the seven service pages, process, about, work, contact, the project brief, and the legal pages. The forms and admin keep their logic and adopt the new tokens.
4. Decide what happens to the 3D scene: retire it, or keep it for the service pages only.
5. Update `docs/build-prompt.md` rules 2.1, 4.2 to 4.4, and 5, `docs/design.md`, the e2e visual snapshots, and the Open Graph images.
6. Delete `src/app/(design)` and its header rules before launch.

## 10. Recommendations for later

1. Replace the concept projects with real case studies as soon as clients give written permission; the work section is the weakest trust signal today.
2. Design a proper GetWithUs logo. The lab reuses the existing "g" mark in cyan; the engineering direction deserves a wordmark of its own.
3. Test the final design with five to eight people from the target segments (an Indian startup founder, an SME owner, an international operations lead), paying attention to whether marketing-focused visitors find it approachable.
4. Commission real team photography for the About page; graphite surfaces suit honest, desaturated portraits.
5. Re-measure on the deployed preview, on a real mid-range Android phone, and with field data (INP and LCP) after launch.
6. Run a screen reader pass (NVDA and VoiceOver) on the final page and the menu.
7. Keep the lab until the build-out is done, then remove `/design` from the repository before launch.
