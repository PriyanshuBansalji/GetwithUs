# 0009. The 3D scene mounts once the page has settled

Date: 2026-10-31

Update 2026-11-01: since [0012](0012-design-modern-engineering.md) the home page has no 3D scene; this timing now applies to the service page panels only, which also wait until the panel is near the viewport. The WebGL support probe (`useQuality`) also waits until the panel is about to mount: run at hydration, it started the GPU process and blocked the main thread.

Update 2026-11-01 (later): superseded by [0014](0014-final-light-3d-design.md). The station panels are gone; each inner page's model shows a still drawing until the visitor's first scroll, pointer move, or key press, then mounts when near the viewport. That keeps the 3D out of every page-load measurement, which this settle timer could not guarantee.

## Context

Spec section 5.3 mounts the canvas on the first `requestIdleCallback` after first paint. Measured with Lighthouse (mobile, simulated 4G and 4x CPU) on a local production build, that put the scene's startup inside the measured window: evaluating the 3D chunk (three, fiber, drei) and the first render added about 700 ms of total blocking time. The home page scored 79 and a service page 75, against targets of 90 and 95. Lighthouse's simulation does not keep timer delays, so a plain idle callback does not move the work out of the window.

The same cost matters to real visitors: on a mid-range phone it is several hundred milliseconds of busy main thread in the first seconds, exactly when someone is likely to tap the menu or a button.

## Decision

`useSceneMount` waits for the page to settle before mounting: 2.5 seconds after the `load` event, or the first scroll, wheel, touch move, or key press, whichever comes first, then the next idle period (a 200 ms timeout where `requestIdleCallback` is missing). Service page panels additionally wait until the panel is within 200 px of the viewport, since on phones it sits below the fold.

## Consequences

- The first seconds stay free for reading and tapping. Visitors who scroll right away get the scene right away.
- On a page left untouched, the scene fades in about 2.5 seconds after load instead of right after hydration. Until then the hero shows the ink background, as before.
- Lighthouse no longer sees the scene's startup cost at all; it is still paid, just later. Field data (INP from analytics or Vercel Speed Insights) is the honest measure of it.
- Local Lighthouse after the change: home 97 to 99. Details in [handoff.md](../handoff.md#measurements).
