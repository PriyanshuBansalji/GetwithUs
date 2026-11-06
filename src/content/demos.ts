/**
 * Scripts for the demos (docs/build-final-prompt.md, section 7.2). Every name,
 * time, and business here is example data, and each demo carries the
 * "Example conversation" label. No emoji, no dashes, no invented numbers.
 */
export const EXAMPLE_LABEL = "Example conversation";

/** The same label on demos that are not conversations. */
export const EXAMPLE_DATA_LABEL = "Example data";

type ChatCard = { title: string; lines: readonly string[] };

export type ChatStep =
  | { from: "customer"; text: string }
  | { from: "bot"; text: string; card?: ChatCard; after?: string; replies?: readonly string[] };

/** What ChatDemo plays. */
export type ChatScript = {
  name: string;
  status: string;
  typing: string;
  handoff: string;
  /** One sentence describing the whole conversation, for screen readers. */
  summary: string;
  steps: readonly ChatStep[];
};

/** A business owner chatting with the GetwithUs WhatsApp bot. */
export const whatsappDemo = {
  name: "GetwithUs",
  status: "AI assistant, online",
  typing: "typing…",
  handoff: "Talk to a person",
  summary:
    "Example conversation: a dental clinic owner asks the GetwithUs WhatsApp bot about an appointments bot, chooses Google Calendar, and books a scoping call for Wednesday 16:30.",
  steps: [
    {
      from: "customer",
      text: "Hi, I run a dental clinic. Can you build a WhatsApp bot for appointments?",
    },
    {
      from: "bot",
      text: "Yes. It would answer common questions, book into your calendar, and hand the chat to your front desk when someone asks for a person. Which calendar do you use?",
      replies: ["Google Calendar", "Something else"],
    },
    { from: "customer", text: "Google Calendar" },
    {
      from: "bot",
      text: "That works. Want a 30-minute scoping call? I can offer Tuesday 11:00 or Wednesday 16:30.",
    },
    { from: "customer", text: "Wednesday 16:30" },
    {
      from: "bot",
      text: "Booked.",
      card: { title: "Scoping call", lines: ["Wednesday 16:30", "with the GetwithUs team"] },
      after: "You will get a confirmation by email.",
    },
  ] satisfies readonly ChatStep[],
} as const;

export type CallLine = { from: "caller" | "agent"; text: string };

/** What CallDemo plays. */
export type CallScript = {
  caller: string;
  callerNote: string;
  agent: string;
  /** One sentence describing the whole call, for screen readers. */
  summary: string;
  lines: readonly CallLine[];
  crm: { title: string; fields: readonly { label: string; value: string }[] };
};

/** A bakery owner calling the GetwithUs calling agent about a website. */
export const callDemo = {
  caller: "Sweet Crumbs Bakery",
  callerNote: "Incoming call",
  agent: "GetwithUs calling agent",
  summary:
    "Example call: a bakery owner asks for a website that takes cake orders before the festive season; the GetwithUs calling agent books a scoping call for Friday 15:00 and writes a summary to the CRM.",
  lines: [
    {
      from: "caller",
      text: "Hi, I run a bakery and I would like a website where people can order cakes.",
    },
    { from: "agent", text: "Happy to help. What should the site do, and by when do you need it?" },
    {
      from: "caller",
      text: "Show our cakes, take orders for pickup, and I would like it live before the festive season.",
    },
    {
      from: "agent",
      text: "Understood. I can book a scoping call with the team on Thursday 10:00 or Friday 15:00. Which suits you?",
    },
    { from: "caller", text: "Friday at three, please." },
    {
      from: "agent",
      text: "Done. Friday 15:00 is booked, and you will get a confirmation by text.",
    },
  ] satisfies readonly CallLine[],
  crm: {
    title: "Summary written to your CRM",
    fields: [
      { label: "Name", value: "Sweet Crumbs Bakery" },
      { label: "Need", value: "Website with cake orders for pickup" },
      { label: "Budget range", value: "Not sure yet" },
      { label: "Next step", value: "Scoping call booked, Friday 15:00" },
    ],
  },
} as const;

/** The agentic automation workflow: each node lights in turn while the log types its line. */
export const workflowDemo = [
  {
    node: "whatsapp",
    label: "New WhatsApp message",
    log: "message received: website enquiry from a bakery",
  },
  {
    node: "agent",
    label: "Agent qualifies the lead",
    log: "lead qualified: bakery website, timeline 1 to 3 months",
  },
  { node: "crm", label: "CRM record created", log: "crm: contact created, stage set to new lead" },
  { node: "calendar", label: "Call booked", log: "calendar: scoping call booked, Friday 15:00" },
  { node: "team", label: "Team notified", log: "notify: summary sent to the team inbox" },
] as const;

/** The custom software deploy log. */
export const deployLog = [
  "$ pnpm build",
  "build: compiled",
  "$ pnpm db:migrate",
  "migrations: applied",
  "$ deploy --env staging",
  "deploy: staging updated",
  "health check passed",
] as const;

/** The digital marketing search demo: a local query and the result that rises. */
export const searchDemo = {
  query: "dental clinic near me",
  result: "Your clinic",
} as const;

/** The web development CMS demo: a heading edited in the CMS and in the live preview. */
export const cmsDemo = {
  field: "Hero heading",
  before: "Book a check-up online",
  after: "Book your check-up in two taps",
} as const;

/** The web development demo: the page that builds itself, its checklist, and its domain. */
export const buildDemo = {
  domain: "yourbusiness.com",
  checks: ["Mobile first", "Accessible", "Indexed by search engines", "Editable by your team"],
  summary:
    "Example: a page for yourbusiness.com is drawn as a wireframe, filled with content, and checked for mobile, accessibility, search, and editing. Then its heading is changed in the CMS and the live page follows.",
} as const;

/** The app development demo: the screens a phone cycles through and the store release steps. */
export const appDemo = {
  screens: ["Sign in", "Choose a time", "Payment received"],
  push: { title: "Booking confirmed", body: "See you on Wednesday at 16:30." },
  stores: ["App Store", "Google Play"],
  statuses: ["Submitted", "In review", "Live"],
  summary:
    "Example: an app signs a customer in, books a time, takes a payment, and sends a push notification. Then the release goes through App Store and Google Play review to live.",
} as const;

/** The digital marketing demo: a local search, the result list, and a dashboard without numbers. */
export const marketingDemo = {
  results: ["A directory listing", "A national chain", "A review site", "Your clinic"],
  chart: { title: "Enquiries from search and ads", from: "Start", to: "Now" },
  legend: ["Search", "Ads"],
  summary:
    'Example: someone searches "dental clinic near me", your clinic rises to the top result, and a dashboard tracks enquiries from search and ads over time. Example data, no numbers.',
} as const;

/** The custom software demo: the systems around your app. */
export const hubDemo = {
  centre: "Your app",
  spokes: ["CRM", "Sheets", "ERP", "Payments", "Email"],
  summary:
    "Example: your app at the centre, connected to your CRM, sheets, ERP, payments, and email, deployed by a pipeline that builds, migrates, deploys to staging, and checks health.",
} as const;
