# GetWithUs design system: Modern Engineering (selected)

The selected direction, D, refined. The live reference is `/design/system`; every value below is generated from `src/content/design-lab/engineering-system.ts`, the only source.

## Principles

1. Monospace only for labels, indices, and specifications at 11 to 13 px. Everything people read at length is sans, in sentence case.
2. Cyan is the signal: actions, active states, focus, and data in diagrams. Never large fills or body text.
3. Panels are square, marked by corner brackets; brackets and borders turn cyan on hover.
4. The layout grid is always visible behind the content and never competes with it.
5. One primary button per view. The secondary action is an outline button or a text link.
6. No motion that runs forever: the diagram pulses three times and stops; everything else answers the visitor.
7. Body text at 7:1 or more; muted labels at 4.5:1 or more on every surface.

## Colour

| Carbon       | Hex       |                  Contrast | Use                          |
| ------------ | --------- | ------------------------: | ---------------------------- |
| Carbon 950   | `#0B0D0F` | 15.97:1 with primary text | Footer, deepest surface      |
| Carbon 900   | `#0F1113` | 15.53:1 with primary text | Page background              |
| Carbon 850   | `#13161A` | 14.89:1 with primary text | Raised sections              |
| Panel        | `#171A1E` | 14.32:1 with primary text | Cards, diagram nodes, tables |
| Panel raised | `#1D2126` | 13.28:1 with primary text | Hovered rows and panels      |

| Lines         | Hex       |                  Contrast | Use                                     |
| ------------- | --------- | ------------------------: | --------------------------------------- |
| Grid          | `#1B1F24` | 13.59:1 with primary text | The layout grid behind every page       |
| Border        | `#262B31` | 11.70:1 with primary text | Panel and table edges, dividers         |
| Border strong | `#353C44` |  9.16:1 with primary text | Outline buttons, timelines, hover edges |

| Text           | Hex       |              Contrast | Use                               |
| -------------- | --------- | --------------------: | --------------------------------- |
| Text           | `#E6E9EC` | 15.53:1 on carbon 900 | Headings and body                 |
| Text secondary | `#A0A8B2` |  7.87:1 on carbon 900 | Leads, descriptions               |
| Text muted     | `#848D98` |  5.63:1 on carbon 900 | Monospaced labels, captions, meta |

| Signal      | Hex       |                  Contrast | Use                                                 |
| ----------- | --------- | ------------------------: | --------------------------------------------------- |
| Signal cyan | `#2CD5E6` |     10.60:1 on carbon 900 | Primary buttons, active states, focus, diagram data |
| Cyan bright | `#5FE2EF` |     12.26:1 on carbon 900 | Primary button hover                                |
| On cyan     | `#061417` | 15.38:1 with primary text | Text on cyan                                        |
| Cyan tint   | `#0E2A2E` | 12.40:1 with primary text | Icon tiles and badges behind cyan                   |

| Status  | Hex       |              Contrast | Use                      |
| ------- | --------- | --------------------: | ------------------------ |
| Success | `#3DD68C` | 10.09:1 on carbon 900 | Confirmations            |
| Error   | `#FF7A70` |  7.45:1 on carbon 900 | Errors and field borders |

Key pairings: body text `#E6E9EC` on carbon 900 is 15.53:1; secondary `#A0A8B2` on panels 7.26:1; muted labels `#848D98` on panels 5.19:1; button label `#061417` on cyan 10.50:1.

## Typography

| Role         | Specification                                                               |
| ------------ | --------------------------------------------------------------------------- |
| Display (H1) | Archivo 600, width 92, 40 to 60 px, line height 1.04, tracking -0.02em      |
| Heading 2    | Archivo 600, width 92, 30 to 40 px, line height 1.1                         |
| Heading 3    | Archivo 600, 20 px, line height 1.3                                         |
| Lead         | Archivo 400, 17 to 18 px, line height 1.6                                   |
| Body         | Archivo 400, 16 px, line height 1.6, measure 68 characters                  |
| Interface    | Archivo 500, 14 to 15 px, sentence case                                     |
| Label (mono) | JetBrains Mono 400, 12 px, lowercase; indices, ids, and specifications only |
| Button       | Archivo 500, 15 px, line height 1                                           |

## Spacing

| Token |  Size | Use                                                       |
| ----- | ----: | --------------------------------------------------------- |
| 1     |  4 px | Icon gaps                                                 |
| 2     |  8 px | Inline gaps                                               |
| 3     | 12 px | Corner bracket length, table rows                         |
| 4     | 16 px | Button gaps, small stacks                                 |
| 6     | 24 px | Panel padding on phones, grid gaps, page gutter on phones |
| 7     | 28 px | Panel padding                                             |
| 10    | 40 px | Page gutter from 768 px                                   |
| 12    | 48 px | Heading to content                                        |
| 16    | 64 px | Section padding on phones                                 |
| 24    | 96 px | Section padding from 768 px                               |

## Radii

| Radius  | Size | Use                                               |
| ------- | ---: | ------------------------------------------------- |
| Control | 2 px | Buttons, inputs, badges                           |
| Panel   | 0 px | Cards and tables, marked by 12 px corner brackets |

## Responsive breakpoints

| Breakpoint |    From | Layout                                                                                     |
| ---------- | ------: | ------------------------------------------------------------------------------------------ |
| Base       |    0 px | One column, 24 px gutters, full-width buttons, practice list instead of the diagram        |
| sm         |  640 px | Buttons side by side; the system diagram appears below the hero text                       |
| md         |  768 px | Section index column beside headings, 40 px gutters, 96 px section padding, 12-column grid |
| lg         | 1024 px | Full navigation, diagram beside the hero, three-column practices, six-step pipeline        |
| xl         | 1280 px | Content capped at 1200 px; the grid continues to the edges                                 |

## Motion

| Motion         | Duration                           | Easing                           | Use                                                                    |
| -------------- | ---------------------------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Hover colour   | 180 ms                             | `ease-out`                       | Links, buttons, borders                                                |
| Underline draw | 220 ms                             | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Navigation and text links                                              |
| Arrow extend   | 200 ms                             | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Arrow inside a button moves 3 px; the button never moves               |
| Bracket signal | 200 ms                             | `ease-out`                       | Corner brackets and borders of a hovered panel turn cyan               |
| Diagram pulses | 3.2 s per pass, 3 passes           | `linear`                         | Data travels between practices when the page opens, then stops         |
| Section reveal | Tied to scroll, first 32% of entry | `linear`                         | Content rises 18 px as it enters; CSS only, content visible without it |

## Section backgrounds

| Tone   | Background                  | Use                                                                  |
| ------ | --------------------------- | -------------------------------------------------------------------- |
| Base   | Carbon 900 `#0F1113`        | Hero, about, services, process, call to action; the grid shows fully |
| Raised | Carbon 850 `#13161A` at 80% | Practices, commitments, work; the grid shows faintly                 |
| Footer | Carbon 950 `#0B0D0F`        | Footer                                                               |
| Panel  | `#171A1E`, hover `#1D2126`  | Cards, specification tables, the diagram                             |

The layout grid (`GridBackdrop`) is fixed behind the page: 4 columns on phones, 12 from 768 px, aligned to the 1200 px container, drawn in `#1B1F24`.

## Components

| Component           | File                                    | Notes                                                                                                                                                                                           |
| ------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Button              | `EngButton.tsx`                         | Primary (cyan, dark label), secondary (panel with strong border), text (drawn underline). Sizes 48 px and 40 px. 2 px radius. Hover brightens or turns the border cyan; the arrow extends 3 px. |
| Corner brackets     | `Brackets.tsx`                          | 12 px brackets on a panel's corners instead of rounded corners; muted at rest, cyan on hover, or always cyan for the call-to-action panel.                                                      |
| Section             | `EngSection.tsx`                        | Base or raised tone; 64 px padding on phones, 96 px from 768 px; 1200 px container with 24 or 40 px gutters.                                                                                    |
| Section heading     | `EngSectionHeading.tsx`                 | Monospaced index ("02 / services") in a 200 px column from 768 px, Archivo H2, optional lead.                                                                                                   |
| Navigation          | `EngHeader.tsx`                         | Sticky 64 px bar; wordmark, in-page links with scroll spy (active link cyan) and a 220 ms underline, primary button, phone menu below 1024 px.                                                  |
| Phone menu          | `EngMobileMenu.tsx`, `EngMenuPanel.tsx` | Dialog code loads on first use. Focus trap, Escape to close, focus returns to the Menu button; choosing a link closes it and leaves focus with the destination.                                 |
| System diagram      | `SystemDiagram.tsx`                     | Figure 01: the three practices around the client's business. Pulses run three passes on load. Hidden below 640 px, where the practice list carries the same facts.                              |
| Practice card       | `EngPracticeCard.tsx`                   | Mono id, icon tile, Archivo title, plain summary, detail, one link to the practice's services.                                                                                                  |
| Specification table | in `EngineeringFinal.tsx`               | Services in a hairline grid; hover raises the row and draws a cyan rule down its left edge.                                                                                                     |
| Work card           | `EngWorkCard.tsx`                       | Schematic, title, summary, and a status, practice, and scope table. Status reads "Concept project" until real case studies exist.                                                               |
| Footer              | `EngFooter.tsx`                         | Carbon 950, brand line, three link columns with mono titles, legal links.                                                                                                                       |

## Hover and focus states

| Element             | Rest                    | Hover                                | Focus                                     |
| ------------------- | ----------------------- | ------------------------------------ | ----------------------------------------- |
| Primary button      | Cyan `#2CD5E6`          | `#5FE2EF`, arrow extends 3 px        | 2 px cyan ring, 3 px offset               |
| Secondary button    | Panel, `#353C44` border | Cyan border, arrow extends           | Cyan ring                                 |
| Navigation link     | `#A0A8B2`               | `#E6E9EC`, underline draws in 220 ms | Underline plus ring; current section cyan |
| Panel with brackets | Muted brackets          | Brackets and border cyan in 200 ms   | Ring on the panel's link                  |
| Specification row   | Panel                   | Raised panel, cyan left rule         | Not focusable (content only)              |

## Using the system

- Wrap a page in `LabPage` with `engineeringPage`, `engineeringFonts`, and `className="isolate"`, and render `GridBackdrop` first.
- Build sections with `EngSection` and `EngSectionHeading`; use the `--lab-*` variables (`bg-(--lab-surface)`, `text-(--lab-text-2)`) rather than raw colours.
- Monospace (`mono` from `tones.ts`) only for labels, ids, and specifications. Never for anything people read at length.
- Add `lab-reveal` to blocks that should rise as they enter; never to the hero.
- New colours go into `engineeringColors` first, with a contrast check.
