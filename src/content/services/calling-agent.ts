import { agenticPricing } from "@/content/services/agentic-automation";
import type { ServiceContent } from "@/content/types";

export const callingAgent: ServiceContent = {
  slug: "calling-agent",
  seoDescription:
    "A calling agent that answers or places calls, follows your rules, transfers to a person when asked, and writes a summary to your CRM.",
  lead: "A calling agent that answers inbound calls or places outbound ones, follows your script and rules, books or qualifies, transfers to a person when asked, and writes a summary into your CRM after every call.",
  summary:
    "A calling agent that answers or places calls and follows your script and rules. It transfers to a person when asked and writes a summary to your CRM.",
  whatYouGet: [
    "Telephony setup on your own provider account",
    "Voice, persona, and script designed with your team",
    "Guardrails: what it may and may not say or do",
    "Calendar and CRM integration",
    "Recordings, transcripts, and summaries in your systems",
    "Transfer to a human during the call",
    "Reporting on call outcomes from your account",
  ],
  howWeWork: [
    "Pick one call type",
    "Build and test on an internal number",
    "Launch on overflow or after-hours first",
    "Expand to full coverage",
  ],
  tools: [
    "Twilio, Vonage, or Plivo for telephony",
    "Speech-to-text and text-to-speech providers",
    "Language models from OpenAI, Anthropic, and Google",
    "Node.js",
    "Postgres",
  ],
  note: {
    title: "Consent and recording",
    body: "Call recording and automated calling are regulated differently in each country and state. We configure disclosures, consent prompts, and do-not-call handling to your counsel's instructions, and the agent announces that it is automated when the law or your policy requires it.",
    placement: "afterTools",
  },
  pricing: agenticPricing,
  faqs: [
    {
      question: "How fast does it respond?",
      answer:
        "Fast enough for a natural conversation on a good connection; we measure and report latency during the pilot rather than quote a number here.",
    },
    {
      question: "Can it handle interruptions?",
      answer: "Yes. It stops speaking when the caller starts and picks up from what was said.",
    },
    {
      question: "What if the caller wants a human?",
      answer:
        "It transfers the call to a number you define and sends the transcript so far to the person picking up.",
    },
    {
      question: "Which languages?",
      answer: "English and Hindi. Other languages on request.",
    },
  ],
  updated: "2026-10-31",
};
