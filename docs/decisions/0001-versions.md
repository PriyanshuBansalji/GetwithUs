# 0001. Dependency versions

Date: 2026-10-31

## Context

Section 8 of the build spec asks for the latest stable version of every package that is compatible with React 19.3 and Next 16.4, checked with `npm view` and never pinned from memory. Section 28.12 asks for the results to be recorded here before phase 1.

Every row below comes from `npm view <pkg> version peerDependencies dist-tags --json`, run on 2026-10-31 against the public npm registry.

## Decision

Versions are pinned exactly in `package.json` (no `^` or `~`) so a fresh install reproduces the tested tree. The lockfile is committed.

### Framework (already installed by create-next-app)

| Package                    | Pinned  | Latest on npm | Peer requirements checked    | Notes                                                                                                      |
| -------------------------- | ------- | ------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `next`                     | 16.4.3  | 16.4.3        | react `^18.2.0 \|\| ^19.0.0` | Kept, per spec section 8.1                                                                                 |
| `react`                    | 19.3.0  | 19.3.1        | none                         | Kept at the installed version, per spec section 8.1                                                        |
| `react-dom`                | 19.3.0  | 19.3.1        | react `^19.3.x`              | Kept, matches `react`                                                                                      |
| `tailwindcss`              | 4.3.3   | 4.3.3         | none                         |                                                                                                            |
| `@tailwindcss/turbopack`   | 4.3.3   | 4.3.3         | none                         |                                                                                                            |
| `typescript` (dev)         | 5.9.3   | 7.0.2         | none                         | Spec section 1 fixes TypeScript 5; 5.9.3 is the newest 5.x                                                 |
| `eslint` (dev)             | 9.39.5  | 10.14.0       | none                         | Spec section 1 fixes ESLint 9; 9.39.5 is the newest 9.x. `eslint-config-next` accepts `>=9`                |
| `eslint-config-next` (dev) | 16.4.3  | 16.4.3        | eslint `>=9.0.0`             | Matches `next`                                                                                             |
| `@types/react` (dev)       | 19.3.0  | 19.3.0        | none                         |                                                                                                            |
| `@types/react-dom` (dev)   | 19.3.0  | 19.3.0        | @types/react `^19.3.0`       |                                                                                                            |
| `@types/node` (dev)        | 24.19.2 | 26.6.6        | none                         | Matches the Node 24 runtime. Vitest 5 requires `^22.0.0 \|\| >=24.0.0`, so the starter's `^20` had to move |

### Runtime dependencies

| Package                   | Pinned        | Peer requirements checked                                   | Notes                                                                                                                                            |
| ------------------------- | ------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `clsx`                    | 2.1.1         | none                                                        |                                                                                                                                                  |
| `tailwind-merge`          | 3.7.0         | none                                                        | 3.x line targets Tailwind v4                                                                                                                     |
| `three`                   | 0.182.0       | none                                                        | Latest is 0.187.0; see "three 0.182.0" below. Uses `ColorManagement`; the prototype's r128 `outputEncoding` calls are not ported                 |
| `@react-three/fiber`      | 9.8.2         | react `>=19 <19.4`, react-dom `>=19 <19.4`, three `>=0.156` | v9 line for React 19. React 19.3.0 is inside the range                                                                                           |
| `@react-three/drei`       | 10.7.9        | react `^19`, three `>=0.159`, @react-three/fiber `^9.0.0`   |                                                                                                                                                  |
| `motion`                  | 14.9.0        | react `^18 \|\| ^19`                                        | Imported as `motion/react`                                                                                                                       |
| `radix-ui`                | 1.8.1         | react `^19.0`, @types/react `*`                             | Unified package                                                                                                                                  |
| `sonner`                  | 2.0.8         | react `^19.0.0`                                             |                                                                                                                                                  |
| `lucide-react`            | 1.66.0        | react `^19.0.0`                                             |                                                                                                                                                  |
| `simple-icons`            | 16.36.0       | none                                                        | Official brand marks for TechLogo, pinned exactly; named `si*` imports keep the bundle to the marks used ([0014](0014-final-light-3d-design.md)) |
| `react-hook-form`         | 7.91.0        | react `^19`                                                 |                                                                                                                                                  |
| `@hookform/resolvers`     | 7.0.0         | react-hook-form `^7.55.0`, zod `^3.25.0 \|\| ^4.0.0`        |                                                                                                                                                  |
| `zod`                     | 4.6.7         | none                                                        | Zod 4 idioms (`z.email()`, `z.url()`)                                                                                                            |
| `@t3-oss/env-nextjs`      | 0.13.11       | zod `^3.24.0 \|\| ^4.0.0`, typescript `>=5.0.0`             |                                                                                                                                                  |
| `zustand`                 | 5.0.16        | react `>=18.0.0`                                            |                                                                                                                                                  |
| `drizzle-orm`             | 0.45.4        | postgres `>=3`                                              |                                                                                                                                                  |
| `postgres`                | 3.4.9         | none                                                        | See "postgres 4.0.0" below                                                                                                                       |
| `resend`                  | 6.37.0        | @react-email/render `*`                                     |                                                                                                                                                  |
| `@react-email/render`     | 2.2.0         | react `^19.0`, react-dom `^19.0`                            | Required peer of `resend`; also provides `render()`                                                                                              |
| `@react-email/components` | 1.0.12        | react `^19.0`                                               |                                                                                                                                                  |
| `next-auth`               | 5.0.0-beta.32 | next `^16.0.0`, react `^19.0.0`, nodemailer optional        | `latest` is still 4.24.15; the 5.x line is published under the `beta` tag. Spec section 8.1 names 5.x beta as the supported line                 |
| `@auth/drizzle-adapter`   | 1.11.3        | none (depends on `@auth/core` 0.41.3)                       | Same `@auth/core` 0.41.3 as `next-auth` 5.0.0-beta.32, so the adapter and the framework share one core                                           |

### Dev dependencies

| Package                       | Pinned  | Peer requirements checked                                                  | Notes                                                                     |
| ----------------------------- | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `@types/three`                | 0.182.0 | none                                                                       | Matches `three`                                                           |
| `drizzle-kit`                 | 0.31.11 | none                                                                       |                                                                           |
| `react-email`                 | 6.11.6  | react `^19.0`, react-dom `^19.0`                                           | Preview server for `pnpm email:dev`                                       |
| `@react-email/ui`             | 6.11.6  | none                                                                       | Preview UI that `email dev` loads; must match the `react-email` version   |
| `vitest`                      | 5.0.5   | vite `^6.4.0 \|\| ^7.0.0 \|\| ^8.0.0`, @types/node `^22.0.0 \|\| >=24.0.0` |                                                                           |
| `vite`                        | 8.3.5   | none required                                                              | Vitest 5 moved `vite` to a peer dependency, so it is installed explicitly |
| `@vitest/coverage-v8`         | 5.0.5   | vitest `5.0.5`                                                             |                                                                           |
| `@playwright/test`            | 1.64.1  | none                                                                       | `next` lists `^1.51.1` as an optional peer                                |
| `@axe-core/playwright`        | 4.14.0  | playwright-core `>=1.0.0`                                                  | Section 20 requires axe in the e2e suite                                  |
| `prettier`                    | 3.9.10  | none                                                                       |                                                                           |
| `prettier-plugin-tailwindcss` | 0.8.1   | prettier `^3.0`                                                            |                                                                           |
| `tsx`                         | 4.23.15 | none                                                                       | Runs `scripts/seed.ts`                                                    |
| `knip`                        | 6.44.1  | none                                                                       |                                                                           |
| `sharp`                       | 0.35.5  | none                                                                       | Icon generation only                                                      |
| `cross-env`                   | 10.1.0  | none                                                                       | Section 28.9, so `guard:strict` runs in PowerShell and cmd                |

### Not installed

- `nodemailer`: an optional peer of `next-auth`. The magic link is sent through the project's own email client (Resend over HTTP, or the console transport in development), so it is not needed.
- `@react-three/postprocessing`, GSAP, Lenis, `framer-motion`, AOS, Locomotive, Prisma, Redux, axios, moment, lodash: excluded by spec section 8.1.

## postgres 4.0.0

`npm view postgres version` returns 4.0.0, published 2026-10-29, two days before this build. `drizzle-orm` 0.45.4 was published 2026-10-08, before that major release existed, so its postgres.js driver has not been released against 4.x. The peer range `postgres >=3` is open-ended and does not prove compatibility. The build pins `postgres` 3.4.9 (published 2026-04-05), the newest 3.x release. Revisit when a `drizzle-orm` release notes support for postgres.js 4.

## three 0.182.0

Three r183 deprecated `THREE.Clock` and logs a console warning when one is constructed. `@react-three/fiber` 9.8.2, the newest release, still creates a `THREE.Clock` for every canvas, so three 0.183.0 to 0.187.0 print that warning on every page with a scene. Spec section 26.2 allows no console warnings on public pages. The build pins `three` 0.182.0, the last release before the deprecation, which is inside the peer ranges of both fiber (`>=0.156`) and drei (`>=0.159`). Move to the newest three once a fiber release switches to `THREE.Timer`.

## Consequences

- Upgrades are deliberate: bump a pin, run `pnpm check && pnpm build`, update this file.
- `next-auth` is a beta. Its API is stable enough for the magic-link flow used here, but read its changelog before every bump.
- When `@react-three/fiber` widens its React range beyond `<19.4`, React can move to 19.4; until then React stays on 19.3.

## Installation order

Every version above was verified before phase 1. Packages are installed in the phase that first imports them, at exactly these pins, because `pnpm check` runs `knip`, which fails on installed dependencies that nothing uses yet.

pnpm 12 applies a minimum release age to new versions. `knip` 6.44.1 was published less than a day before installation, so pnpm added it to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`. The exclusion is pinned to that exact version.

`knip` runs with `KNIP_DISABLE_RAW_TRANSFER=1` (set through `cross-env` in the `knip` script). Its parser otherwise reserves 6 GiB of virtual memory up front, which fails on Windows machines with a smaller commit limit. The flag only switches the parser to its standard transfer mode.

The same pnpm policy later added `lucide-react` 1.66.0 and `@types/three` 0.187.0 to `minimumReleaseAgeExclude` when they were installed. `@types/three` has since moved to 0.182.0 and its exclusion was removed.

## Not installed

`motion` 14.9.0 is listed above because section 8.1 names it, but it was never installed: the hero reveal and all transitions are CSS keyframes, which keeps every marketing route under the initial JavaScript budget. See [0011-css-transitions.md](0011-css-transitions.md).

Update 2026-11-01: GSAP 3.15.0, Lenis 1.3.27, and `motion` 14.9.0 were installed for the interim motion system ([0013-interim-motion-system.md](0013-interim-motion-system.md)). Lenis was removed again in phase 0 (0008), and GSAP and `motion` in phase 2, once the final design had replaced every component that used them ([0014-final-light-3d-design.md](0014-final-light-3d-design.md)). The guard and ESLint ban all three again.

## Test tooling

`@playwright/test` 1.64.1 and `@axe-core/playwright` 4.14.0 were installed in phase 8 at the pins above. The suite runs Chromium only. Firefox and WebKit builds from the same Playwright release were used by hand to check pages for console problems (see [handoff.md](../handoff.md)); they are not part of `pnpm test:e2e`.

## GitHub Actions

The actions in `.github/workflows/ci.yml` (`actions/checkout`, `actions/setup-node`, `pnpm/action-setup`, `actions/upload-artifact`) were written at v4 and, unlike the npm packages above, not checked against their latest releases before phase 1. Dependabot's first scan on 2026-10-31 found `actions/checkout`, `actions/setup-node`, and `actions/upload-artifact` at v7 and `pnpm/action-setup` at v6, and opened update pull requests. Accept them once their CI runs pass.
