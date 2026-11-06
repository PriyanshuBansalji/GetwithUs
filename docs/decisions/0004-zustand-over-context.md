# 0004. Zustand for the two pieces of shared client state

Date: 2026-10-31

Update 2026-11-01: with the home scene removed ([0012](0012-design-modern-engineering.md)), the scene store holds only the quality tier and the reduced-motion preference for the service page panels.

## Context

Two things are shared across client components: the 3D scene's state (scroll progress, active station, quality tier, reduced motion, canvas ready), and the project brief draft that must survive a refresh. Scroll progress changes every frame; the render loop needs it without re-rendering React.

## Decision

Two small typed Zustand stores in `src/stores`:

- `scene.store.ts` with `subscribeWithSelector`, so `useFrame` reads `getState()` and React components subscribe only to the slices they show.
- `brief.store.ts` with `persist` to sessionStorage under `gw-brief-v1`, hydrated manually after mount (`skipHydration`) so server and client render the same HTML, and cleared on success.

Everything else stays where it belongs: server state on the server, URL state in search params, form state in react-hook-form, and local state in `useState`.

## Consequences

- No provider tree and no context re-render cascades; the render loop never triggers React work.
- Persistence is a few lines instead of a custom effect.
- One small dependency (about 1 KB gzipped) shared by both stores.
