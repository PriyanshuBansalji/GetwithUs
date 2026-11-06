# 0005. Content in typed files instead of a CMS

Date: 2026-10-31

## Context

The site has about a dozen pages of copy, seven service pages, two legal documents, and (later) case studies. The team is small and technical; copy changes are infrequent and benefit from review.

## Decision

All copy lives in TypeScript files under `src/content` and `src/config/site.ts`, typed by `src/content/types.ts`. Pages render from these files at build time, and the marketing layout is required to be static (`ensureStatic`).

## Consequences

- Every change is reviewed in a pull request, checked by TypeScript, the content unit tests, and the guard (banned words, dashes, emoji, placeholders).
- No extra service, account, or API at runtime; pages are static HTML at the edge.
- Editing needs a developer workflow (or the GitHub web editor). If non-technical editors need to change copy often, a headless CMS can feed the same types later without touching the components.
- Rules like "case studies need written permission" are enforced in code (`published` and `permission` flags, `metricsApproved`), not by convention.
