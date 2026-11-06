# 28. Prototype learnings (overrides section 5 of docs/build-prompt.md where numbers differ)

A browser prototype of the home page was built and tuned before this build. Its source is at docs/prototype/home.html. Use its numbers as the starting point for section 5 and change them only after measuring on a real screen. Port its logic, not its API calls: it uses three r128 UMD (outputEncoding, sRGBEncoding, convertSRGBToLinear), which the installed three replaces with ColorManagement.

## 28.1 Framing

Copy sits in the left column, so every lookAt target points left of the scene origin and the objects land in the right two thirds. Scale the lookAt x offset by min(1, aspect / 1.6) each frame so that on phones the object sits near the center behind the copy instead of off screen.

Keyframes (position, lookAt), one per station, in scene units:

| Station | Camera position | LookAt target |
| --- | --- | --- |
| hero | (2.6, 0.5, 7.4) | (-1.6, 0.0, 0) |
| web | (3.8, 1.2, 5.9) | (-1.9, 0.1, 0) |
| app | (4.6, 0.8, 4.8) | (-1.3, 0.0, 0) |
| automation | (2.8, 1.5, 6.6) | (-2.2, 0.2, 0) |
| marketing | (3.4, 4.8, 10.5) | (-2.0, 0.6, 0) |
| close | (2.0, 0.3, 8.0) | (-1.6, 0.0, 0) |

Camera fov 38, near 0.1, far 60, both curves CatmullRomCurve3 centripetal. Damp camera position and lookAt separately with THREE.MathUtils.damp at lambda 6; damp the scroll progress itself at lambda 5 and compute every station t from the damped value so the transitions scrub smoothly.

## 28.2 Light

One SpotLight in lamp color: intensity 1.5 (three r16x units; retune if the installed three uses physical units), angle 0.55 rad, penumbra 0.6, decay 1, no shadows. Position lerps from (-3.5, 4.2, 4.0) to (0.6, 1.6, 6.5) with the close station's t. HemisphereLight sky ink-3, ground ink, intensity 1.3. Renderer: ACES Filmic tone mapping, exposure 1.15. Anything stronger than this made the cubes read as solid orange.

## 28.3 Slab

24 x 14 cubes of 0.1 units at 0.115 spacing (slab 2.76 x 1.61). Cloud positions: seeded sphere with radius 0.8 + 2.0 * cbrt(u), y scaled 0.7, z scaled 0.8. Drift 0.02 rad/s times (1 - t0). Cubes fade out with 1 - smoothstep(0.25, 0.7, t1) while the pane fades in, not later, or the thinning cubes z-fight the pane.

## 28.4 Pane and phone

Pane depth lerps 0.1 to 0.006 over t1; dimensions lerp from the slab to 1.05 x 2.275 x 0.07 over t2; rotation 12 degrees about Y times t2; back rectangle offset (0.3, -0.16, -0.38) times t2 at 60 percent opacity. Glass: transmission 0.9 with the drei Environment in place; without an environment map the pane reads black, so the environment is not optional. The surface grid (12 x 8) is a LineSegments child of the pane at local z 0.503 with renderOrder above the pane, or the pane's own transparency hides it. Draw rule in the shader: discard when vT * 0.7 + lineOrder * 0.3 > drawProgress.

## 28.5 Network

48 nodes seeded inside an ellipsoid of radii 2.6 x 1.3 x 0.9. Edges: each node to its two nearest neighbours, deduplicated, then random pairs until 70. Pulse band: smoothstep(0.09, 0.0, abs(vT - fract(time / 1.6 + edgeSeed))). The two end nodes are the min-x and max-x nodes at 1.6x scale; per-instance color lerps base to lamp by max(0, sin(1.6 t)) and max(0, -sin(1.6 t)) respectively. Nodes scale by t3 * (1 - t4); edge opacity by 1 - t4.

## 28.6 Field

Start positions are node positions with 0.3 jitter; end positions use r = u * 5.5 (density highest at the center), y = 0.085 r^2 - 0.7, z scaled 0.65. Position = mix(mix(start, end, t4), slabSlot, t5). Point size = size * dpr * 26 / depth with size in [1, 2.4]. Alpha = smoothstep(0, 0.2, t4) * (1 - smoothstep(0.75, 1, t5)); the slab cubes scale back in with t5 so the two cross-fade.

## 28.7 Progress mapping

Replace the section 5.3 formula with progress = clamp(scrollY / (processSectionTop - 0.6 * innerHeight)). With scrollHeight the close station would play behind the solid process section where the canvas is already faded out. Place the 160 px fade (transparent to ink) between the "Also:" line and the process section; the process section and everything after it carry a solid ink background.

## 28.8 Render loop

frameloop never when document.visibilityState is not visible, and when abs(dampedProgress - progress) < 0.0005 while progress >= 0.999. Wake on scroll, resize and visibilitychange. The whole scene including three, fiber and drei must still meet the 450 KB gzipped budget in section 5.4.

## 28.9 Windows

Add cross-env as a dev dependency and write guard:strict as `cross-env GUARD_STRICT=1 node scripts/guard.mjs` so it runs in PowerShell and cmd.

## 28.10 Heading levels

Section 19 says levels never skip; section 6.2 puts H4 step titles under an H2. Render the process step titles as h3 elements with the H4 type style, and footer column titles as h2 elements with the small type style.

## 28.11 Guard vocabulary

The guard scans src/, so never use these words in code identifiers, comments or copy under src/: testimonial, harness (write evaluation set), unlock, elevate, leverage. Name the Vitest helper folder tests/unit, not harness.

## 28.12 Versions

Before phase 1, run `npm view <pkg> version peerDependencies` for every dependency in section 8.1 and record the results in docs/decisions/0001-versions.md. Pin from those results, never from memory.
