# Editing content

All copy lives in typed TypeScript files under `src/content` and `src/config/site.ts`. There is no CMS: edit the file, run `pnpm check`, open a pull request, and the change ships with the next deploy. TypeScript catches a missing field; the guard catches banned words, dashes, and emoji.

Before editing copy, read the hard rules in [design.md](design.md#hard-rules-checklist). In short: sentence case, no em or en dashes (use a comma, colon, or "to"), no emoji, no superlatives or invented numbers, buttons say what they do.

## Where things are

| What                                                                                  | File                                                                                          |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Brand name, contact details, legal entity, response time, fix window, social links    | `src/config/site.ts`                                                                          |
| Navigation                                                                            | `src/config/site.ts` (`primaryNav`) and `src/content/services/catalog.ts` (the services menu) |
| Home, services index, process, work, about, contact, and start page copy and metadata | `src/content/pages.ts`                                                                        |
| Home page sections (hero words, headings and leads of every new section)              | `src/content/home.ts`                                                                         |
| Pricing cards and the platform costs line                                             | `src/content/pricing.ts`                                                                      |
| Payment facts under the pricing cards                                                 | `src/config/site.ts` (`payment`)                                                              |
| Home page questions                                                                   | `src/content/faqs.ts`                                                                         |
| Industries (hidden while empty)                                                       | `src/content/industries.ts`                                                                   |
| Tools, their categories, and their official marks                                     | `src/content/tools.ts`                                                                        |
| Demo scripts (WhatsApp, calling agent, workflow, deploy log)                          | `src/content/demos.ts`                                                                        |
| Headings and leads above each service page's demo                                     | `src/content/service-demos.ts`                                                                |
| Code samples in the home page editor                                                  | `src/content/code-samples.ts`                                                                 |
| Process steps                                                                         | `src/content/process.ts`                                                                      |
| Commitments (home and about)                                                          | `src/content/commitments.ts`                                                                  |
| Each service page                                                                     | `src/content/services/<slug>.ts`                                                              |
| Service names, menu descriptions, and order                                           | `src/content/services/catalog.ts`                                                             |
| Project brief options (budget ranges, timelines)                                      | `src/content/brief.ts`                                                                        |
| Form labels, hints, success messages, and error copy                                  | `src/content/forms.ts`                                                                        |
| Privacy policy and terms                                                              | `src/content/legal/privacy.ts`, `src/content/legal/terms.ts`                                  |
| Team                                                                                  | `src/content/team.ts`                                                                         |
| Case studies                                                                          | `src/content/case-studies/index.ts`                                                           |
| Email templates                                                                       | `src/server/email/templates/*.tsx` (preview with `pnpm email:dev`)                            |

Every page's title must stay under 60 characters and its description under 160; `tests/unit/content` checks this along with the other content rules.

## Edit a service page

Open `src/content/services/<slug>.ts`. The `ServiceContent` type in `src/content/types.ts` documents every field: `lead`, `summary`, `highlights`, `whatYouGet`, `howWeWork`, `tools`, `pricing`, `faqs`, an optional `note`, the 3D `station`, and `updated`. Set `updated` to the date of your change (ISO, for example `2026-11-02`); the sitemap uses it.

## Add a service FAQ

Add an object to the page's `faqs` array:

```ts
faqs: [
  // ...existing questions
  {
    question: "Can you work with our existing developers?",
    answer: "Yes. We agree who owns which part in the written scope and share one repository.",
  },
],
```

The accordion on the page and the `FAQPage` structured data both read this array, so they always match. Keep questions to real ones clients ask, and answers to one or two sentences.

## Add a case study

Add a case study only with the client's written permission. Never add sample, invented, or anonymized-beyond-recognition work.

Add an object to `caseStudies` in `src/content/case-studies/index.ts`. The `CaseStudy` type documents the fields. Two flags control what appears:

- `published` and `permission` must both be `true` for the study to appear anywhere. `permission` means you hold the client's written approval to publish; keep that approval on file.
- `metricsApproved` must be `true` for the `metrics` to render. Each metric needs a `source` (where the number comes from, for example "Google Analytics, March to May 2026"). Only numbers the client has approved in writing.

Set `client: null` to show "Confidential [industry] client" instead of a name. Put images under `public/work/<slug>/` with real `alt` text, and list them in `images` with their pixel `width` and `height`.

The first published study turns on the Work link in the header and footer, the home page's selected work section, `/work`, its page at `/work/<slug>`, its Open Graph image, and its sitemap entry. With none published, `/work` shows its empty state and the links stay hidden.

## Add a team member

Add an object to `team` in `src/content/team.ts`:

```ts
export const team: readonly TeamMember[] = [
  {
    name: "Jane Doe",
    role: "Engineering lead",
    bio: "Builds the apps and agents. Ten years of shipping software for small businesses.",
    photo: "/team/jane-doe.jpg",
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/..." }],
  },
];
```

Real people and real photos only. Without `photo`, an initials tile is shown. The Team section on `/about` appears once the list has an entry.

## Owner placeholders

Facts only the owner can supply are written as `[OWNER: what is needed]` in the code and copy. The site builds and runs with them, but launch is blocked until every one is replaced:

```sh
pnpm guard:strict
```

lists each remaining placeholder as `file:line`. [handoff.md](handoff.md) has the full list grouped by topic. Most live in `src/config/site.ts` (so one edit fixes every page and email that uses it), `src/content/legal/*.ts`, `src/content/brief.ts`, and a few service pages.

When a placeholder asks for something you do not offer (for example a starting price), remove the sentence rather than leaving a vague one.

## Legal pages

`src/content/legal/privacy.ts` and `terms.ts` are structured as sections of paragraphs and lists, with an `updated` date shown on the page. They were drafted to match how the site actually handles data (what the forms collect, the verification email, retention, providers). Have a lawyer review both before launch, and update `updated` whenever the text changes.
