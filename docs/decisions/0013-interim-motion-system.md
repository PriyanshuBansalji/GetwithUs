# 0013. Interim motion system (GSAP, Lenis, Motion), superseded

Date: 2026-11-01

Status: superseded by [0014](0014-final-light-3d-design.md).

## Context

After the Modern Engineering design went live ([0012](0012-design-modern-engineering.md)), the owner supplied a motion prototype for the home page and asked for it to be ported with GSAP (ScrollTrigger for scroll-driven sequences), Motion (UI transitions), and Lenis (smooth scroll). That work was committed as `751e208`, marked work in progress, and the guard and lint rules were relaxed to allow the three libraries, magnetic buttons, and check marks. The guard and lint comments from that commit point to this record.

## Decision (as built)

- `components/motion`: ScrambleText, TiltCard, MagneticButton, GridSpotlight, SmoothScroll (Lenis on GSAP's ticker, synced with ScrollTrigger), a shared frame loop and pointer listener, a lazy GSAP loader, MotionScope, LazyWhenNear.
- Services: an isometric stack driven by a scrubbed ScrollTrigger, a looping WhatsApp demo, five cards. Process: a scroll-filled timeline. Commitments: tilting cards with ghost numbers. Closing section: a terminal form posting to a `submitBrief` server action that only logs.

## Why it was superseded

The owner approved a different final design (light, rounded, 3D on every page) before this work was finished. Measured against the home page budget it was also heavy: mobile Lighthouse 78 to 89, and Lenis contradicts [0008](0008-no-smooth-scroll.md), which the final build keeps.

## Consequences

- Lenis is removed in the first phase of the final build; GSAP and Motion are removed as the components that use them are replaced. The forbidden-import bans return once nothing imports them.
- Pieces that fit the final design are kept and extended: MagneticButton, TiltCard, LazyWhenNear, the shared frame loop and pointer listener, and the `known()` helper for owner facts.
- `submitBrief` stays as it is (it logs and does not deliver) until the owner connects it; see [handoff.md](../handoff.md).
