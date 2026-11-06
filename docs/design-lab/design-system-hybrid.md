# GetWithUs design system: Hybrid Premium (alternative)

Hybrid Premium refined with the structure of Minimal Corporate: the highest-scoring direction, kept as the alternative to the selected Modern Engineering system ([design-system.md](design-system.md)). The live reference is `/design/hybrid-system`; the values below are generated from `src/content/design-lab/hybrid-system.ts`, which is the only source.

## Principles

1. Serif for display and section headings only; every interface label, card title, and button uses the sans.
2. Electric blue is for action: buttons, links, focus. Never for decoration or large fills.
3. Navy marks the statement moments (hero, commitments, call to action); warm white is for reading.
4. One primary button per view. The secondary action is a text link or an outline button.
5. No motion that runs forever. Every animation answers a scroll or a pointer and then stops.
6. Under reduced motion: no reveals, no transitions beyond colour.
7. Every text pairing at 4.5:1 or more; body text at 7:1 or more.

## Tokens

| Navy     | Hex       | Use                                                |
| -------- | --------- | -------------------------------------------------- |
| Navy 950 | `#08112A` | Footer, deepest band                               |
| Navy 900 | `#0B1631` | Primary brand colour: navigation, hero, dark bands |
| Navy 800 | `#12204A` | Raised surfaces on navy                            |
| Navy 700 | `#22305C` | Rules and borders on navy                          |
| Navy 600 | `#33447A` | Strong borders on navy, outline buttons            |

| Paper       | Hex       | Use                                  |
| ----------- | --------- | ------------------------------------ |
| White       | `#FFFFFF` | Cards, alternate sections            |
| Warm white  | `#F7F6F2` | Page background for reading sections |
| Paper shade | `#EFEDE6` | Illustration panels, quiet fills     |

| Ink         | Hex       | Use                        |
| ----------- | --------- | -------------------------- |
| Ink         | `#0F1424` | Text on light              |
| Slate       | `#4A5065` | Secondary text on light    |
| Slate muted | `#5E6478` | Captions and meta on light |
| Navy text   | `#F4F6FB` | Text on navy               |
| Mist        | `#AEB7CE` | Secondary text on navy     |

| Rules       | Hex       | Use                                |
| ----------- | --------- | ---------------------------------- |
| Rule        | `#E3E1DA` | Dividers and card borders on light |
| Rule strong | `#C9C6BC` | Hover borders, inputs on light     |

| Blue     | Hex       | Use                                        |
| -------- | --------- | ------------------------------------------ |
| Blue 600 | `#2052E8` | Accent: primary buttons and links on light |
| Blue 700 | `#1842C4` | Accent hover and pressed                   |
| Blue 300 | `#8EAEFF` | Accent text and focus ring on navy         |

| Status  | Hex       | Use                          |
| ------- | --------- | ---------------------------- |
| Success | `#1F7A4F` | Confirmation text and icons  |
| Error   | `#B42318` | Error text and field borders |

| Role                 | Specification                                                        |
| -------------------- | -------------------------------------------------------------------- |
| Display (H1)         | Instrument Serif 400, 44 to 76 px, line height 1.0, tracking -0.01em |
| Heading 2            | Instrument Serif 400, 36 to 52 px, line height 1.04                  |
| Heading 3, editorial | Instrument Serif 400, 28 px, line height 1.15                        |
| Heading 3, interface | Instrument Sans 600, 18 px, line height 1.35                         |
| Lead                 | Instrument Sans 400, 17 to 19 px, line height 1.6                    |
| Body                 | Instrument Sans 400, 16 px, line height 1.6, measure 68 characters   |
| Small and labels     | Instrument Sans 500, 14 px, line height 1.5                          |
| Button               | Instrument Sans 500, 15 px, line height 1                            |

| Token |  Size | Use                                                      |
| ----- | ----: | -------------------------------------------------------- |
| 1     |  4 px | Icon gaps                                                |
| 2     |  8 px | Inline gaps, badge padding                               |
| 3     | 12 px | List rows                                                |
| 4     | 16 px | Button gaps, small stacks                                |
| 6     | 24 px | Card padding on phones, grid gaps, page gutter on phones |
| 8     | 32 px | Card padding, gaps between groups                        |
| 10    | 40 px | Page gutter from 768 px                                  |
| 12    | 48 px | Heading to content                                       |
| 16    | 64 px | Section padding on phones                                |
| 24    | 96 px | Section padding from 768 px                              |

| Radius  |   Size | Use                         |
| ------- | -----: | --------------------------- |
| Control |   8 px | Buttons, inputs, menu items |
| Card    |  12 px | Cards, panels, frames       |
| Pill    | 999 px | Badges                      |

| Breakpoint |    From | Layout                                                             |
| ---------- | ------: | ------------------------------------------------------------------ |
| Base       |    0 px | One column, 24 px gutters, full-width buttons, menu button         |
| sm         |  640 px | Buttons side by side, two-column grids where items are short       |
| md         |  768 px | Label column beside headings, 40 px gutters, 96 px section padding |
| lg         | 1024 px | Full navigation, three-column practice grid, two-column hero       |
| xl         | 1280 px | Content capped at 1240 px; extra width becomes margin              |

| Motion         | Duration                           | Easing                           | Use                                                                    |
| -------------- | ---------------------------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Hover colour   | 180 ms                             | `ease-out`                       | Links, buttons, borders                                                |
| Underline draw | 220 ms                             | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Navigation and text links                                              |
| Arrow nudge    | 200 ms                             | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Arrow inside a button moves 3 px; the button never moves               |
| Card rule      | 300 ms                             | `ease-out`                       | Blue line draws across the top of a hovered card                       |
| Menu open      | 220 ms                             | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Phone menu fades and drops 8 px                                        |
| Section reveal | Tied to scroll, first 32% of entry | `linear`                         | Content rises 18 px as it enters; CSS only, content visible without it |

## Section backgrounds

| Tone       | Background | Text      | Secondary text | Rules     | Accent text and focus | Use                               |
| ---------- | ---------- | --------- | -------------- | --------- | --------------------- | --------------------------------- |
| Navy       | `#0B1631`  | `#F4F6FB` | `#AEB7CE`      | `#22305C` | `#8EAEFF`             | Hero, commitments, call to action |
| Navy 950   | `#08112A`  | `#F4F6FB` | `#AEB7CE`      | `#22305C` | `#8EAEFF`             | Footer                            |
| Warm white | `#F7F6F2`  | `#0F1424` | `#4A5065`      | `#E3E1DA` | `#2052E8`             | Reading sections                  |
| White      | `#FFFFFF`  | `#0F1424` | `#4A5065`      | `#E3E1DA` | `#2052E8`             | Practices and work                |

Navy sections redefine the `--lab-*` variables (`navyTone` in `src/components/design-lab/hybrid/tones.ts`), so every component placed inside them adapts without props.

## Components

| Component       | File                                        | Notes                                                                                                                                                                                                                                            |
| --------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button          | `SystemButton.tsx`                          | Variants: primary (blue, white label), inverse (white, navy label; the primary on navy), outline, text (drawn underline). Sizes md (48 px) and sm (40 px). Hover darkens the fill and moves the arrow 3 px; the button never moves. 8 px radius. |
| Section         | `SystemSection.tsx`                         | Tones: paper, white, navy, navy-deep. 64 px vertical padding on phones, 96 px from 768 px; 1240 px container with 24 or 40 px gutters.                                                                                                           |
| Section heading | `SectionHeading.tsx`                        | Rule, quiet label in a 200 px column from 768 px, serif H2 (36 to 52 px), optional lead (60 characters).                                                                                                                                         |
| Navigation      | `SystemHeader.tsx`                          | Sticky navy bar, 72 px. Wordmark, in-page links with scroll spy and a 220 ms underline, inverse primary button, phone menu below 1024 px.                                                                                                        |
| Phone menu      | `LazyMobileMenu.tsx`, `MobileMenuPanel.tsx` | The dialog code loads on first use (warmed on hover or focus). Focus trap, Escape to close, focus returns to the button, serif links, full-width primary action.                                                                                 |
| Practice card   | `PracticeCard.tsx`                          | Icon tile, serif title, summary, detail, one link to the practice's services. Hover darkens the border and draws a blue rule along the top in 300 ms. 12 px radius.                                                                              |
| Work card       | `WorkCard.tsx`                              | Schematic on a paper-shade panel, a "Concept project" badge until real case studies exist, serif title, summary, scope. Hover scales the schematic to 103 percent.                                                                               |
| Footer          | `SystemFooter.tsx`                          | Navy 950, brand line, three link columns, legal links.                                                                                                                                                                                           |

## Hover and focus states

| Element                  | Rest           | Hover                                        | Focus                                                |
| ------------------------ | -------------- | -------------------------------------------- | ---------------------------------------------------- |
| Primary button           | Blue `#2052E8` | Blue `#1842C4`, arrow moves 3 px             | 2 px ring in the section's focus colour, 3 px offset |
| Inverse button           | White          | `#E6ECFF`, arrow moves 3 px                  | Ring in `#8EAEFF`                                    |
| Text link and navigation | No underline   | Underline draws from the left in 220 ms      | Underline plus ring                                  |
| Card                     | Rule border    | Strong border, blue top rule draws in 300 ms | Ring on the card's link                              |
| Service row              | Rule below     | Arrow fades in beside the title              | Not focusable (content only)                         |

## Using the system

- Wrap a page in `LabPage` with `systemPage` and `systemFonts`.
- Build sections with `SystemSection` and `SectionHeading`; never set colours directly, use the `--lab-*` variables (`bg-(--lab-bg)`, `text-(--lab-text-2)`), which change with the section tone.
- Add `lab-reveal` to blocks that should rise as they enter; never to the hero.
- New colours go into `systemColors` first, with a contrast check (see `tests/unit/lib/color.test.ts`).
