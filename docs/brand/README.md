# GetwithUs logo

The final logo, chosen by the owner on 2026-11-05: concept 3A, "Square dot, G icon", from the owner's concept file.

- **The mark:** a G that holds a rounded square, on a rounded tile.
- **The wordmark:** "GetwithUs", with "with" in the accent and its i dotted with the same square.
- **The idea:** the square is the client's project, held inside GetwithUs and repeated in the word "with". It matches the brand line, "we build it with you".

## Name

Write the name as **GetwithUs**: capital G, small "with", capital U, one word. The site, titles, emails and documents use this spelling. `NEXT_PUBLIC_SITE_NAME` defaults to it.

## Files

| File                                                 | Use                                                                                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `logo.svg`, `logo.png`                               | Full logo, for light backgrounds (documents, slides, invoices)                                                        |
| `logo-dark.svg`                                      | Full logo, for dark backgrounds                                                                                       |
| `logo-mono-ink.svg`, `logo-mono-white.svg`           | Full logo in one colour (print, stamps, merchandise)                                                                  |
| `logo-mark.svg`                                      | The mark alone, primary colours                                                                                       |
| `logo-mark-dark.svg`                                 | The mark alone, dark-theme colours                                                                                    |
| `logo-mark-mono-ink.svg`, `logo-mark-mono-white.svg` | The mark in one colour; the G and the square are cut out of the tile                                                  |
| `profile-1024.png`                                   | Profile picture for WhatsApp, LinkedIn and Instagram: the mark filling the square (the platforms crop it to a circle) |

The website draws the logo from `src/lib/brand.ts`:

- `src/components/ui/Logo.tsx` draws the header, footer, menu and admin logo.
- `src/lib/og-image.tsx` draws the link-preview images.

The favicon set comes from the same shapes:

- `src/app/icon.svg`, `icon.png` (32 px) and `apple-icon.png` (180 px).
- `public/icon-192.png`, `icon-512.png` and `icon-maskable-512.png`, used by the manifest.

## Colours

| Part                  | Light (primary) | Dark      |
| --------------------- | --------------- | --------- |
| Tile                  | `#0F1B2D`       | `#161B22` |
| G                     | `#FFFFFF`       | `#E9EEF3` |
| Square, "with", i-dot | `#0E7C86`       | `#22D3EE` |
| "Get", "Us"           | `#0F1B2D`       | `#E9EEF3` |

On the site these are the tokens `--brand-tile`, `--brand-mark`, `--accent` and `--ink`, so the logo follows the theme switch. Favicons and profile pictures cannot switch, so they use the light version.

## Geometry

The mark sits on a 64 x 64 grid:

- **Tile:** corner radius 15.
- **G:** a ring 9 units thick, with a centre-line radius of 14, around (32, 32).
- **G opening:** a radial cut 45 degrees above the right, then round to a flat cut at the right-hand middle.
- **Square:** 11 x 11 at (33, 32), radius 2.5, drawn over the ring.

The wordmark is outlined from Bricolage Grotesque ExtraBold (`src/assets/fonts`, SIL Open Font License), so it never depends on a font loading:

- **Size:** 24 units beside a 36-unit mark, with letter spacing -0.015em. The capitals are centred on the mark.
- **Square dot:** 1.5 times the font's own dot, with a radius of 24 percent of its side, resting on the dot's bottom edge.
- **Gap:** 10 units between the mark and the wordmark.

## Rules

- **Clear space:** keep at least the height of the square (11 units on the 64 grid) clear on every side.
- **Smallest size:** 16 px for the mark, and 24 px tall for the full logo.
- **Shape:** don't recolour, stretch, rotate, outline or add effects. Use a one-colour file when colour isn't available.
- **Small sizes:** the square is the part that disappears first. On a dark tile at 16 px the teal square measures 3.4:1. If tab-size visibility becomes a problem, the fix is the bright `#22D3EE` square in the icon files only.

## Before launch

- **Trademark search:** search India's trademark register and the US trademark office for a G mark of this kind.
- **Designer polish:** optionally, have a designer refine the curves and the square's exact size and position. Any change goes into `src/lib/brand.ts` and these files together.
