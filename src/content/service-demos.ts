import type { ServiceSlug } from "@/content/types";

/** The heading and lead above each service page's demo, and the points beside the agent demos. */
export const serviceDemos: Record<
  ServiceSlug,
  { title: string; lead: string; points?: readonly string[] }
> = {
  "web-development": {
    title: "Watch a page come together",
    lead: "A page drawn as a wireframe, filled with content, and checked before launch. Then your team changes the heading in the CMS and the live page follows.",
  },
  "app-development": {
    title: "From the first screen to the stores",
    lead: "Sign-in, booking, payment, and a push notification, then the release through Apple and Google review.",
  },
  "agentic-automation": {
    title: "One enquiry, five steps, nobody copying data",
    lead: "A WhatsApp message comes in. The agent qualifies it, writes it to your CRM, books a call, and tells your team. Every step is logged.",
  },
  "whatsapp-bot": {
    title: "See the bot book a call",
    lead: "An example conversation on WhatsApp, from the first question to a booked call.",
    points: [
      "Answers the question in plain language",
      "Offers choices as quick replies",
      "Books into your calendar",
      "Keeps a person one tap away",
    ],
  },
  "calling-agent": {
    title: "Hear how a call goes",
    lead: "An example call, transcribed as it happens, ending with a summary in your CRM.",
    points: [
      "Picks up and asks what the caller needs",
      "Takes the details and offers a slot",
      "Confirms the booking on the call",
      "Writes the summary to your CRM",
    ],
  },
  "digital-marketing": {
    title: "Found, clicked, measured",
    lead: "A local search, your result rising to the top, and a dashboard that tracks what happens next.",
  },
  "custom-software": {
    title: "Your systems, talking to each other",
    lead: "Your app at the centre, connected to the tools you already use, and deployed by a pipeline you can read.",
  },
};
