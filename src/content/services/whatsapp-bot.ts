import { agenticPricing } from "@/content/services/agentic-automation";
import type { ServiceContent } from "@/content/types";

export const whatsappBot: ServiceContent = {
  slug: "whatsapp-bot",
  seoDescription:
    "A WhatsApp bot on the official Business Platform that answers, qualifies leads, books appointments, and hands chats to a person.",
  lead: "A WhatsApp bot on the official WhatsApp Business Platform that answers questions, qualifies leads, books appointments, and sends order or appointment updates, then hands the chat to a person when it should.",
  summary:
    "A WhatsApp bot on the official Business Platform that answers, qualifies, books, and sends updates. It hands the chat to a person when it should.",
  whatYouGet: [
    "Business Platform setup and number verification through Meta",
    "Message template design and approval",
    "Conversation design in English and Hindi",
    "Integrations with your CRM, calendar, or order system",
    "Handoff to a human inbox with the full transcript",
    "Opt-in and opt-out handling",
    "Usage and outcome reporting from your own account",
  ],
  howWeWork: [
    "Choose the first conversation type",
    "Build and test with your team on a test number",
    "Launch to a segment",
    "Expand",
  ],
  tools: [
    "WhatsApp Business Cloud API (official, no unofficial libraries)",
    "Node.js",
    "Postgres",
    "Your CRM or calendar",
  ],
  note: {
    title: "How WhatsApp works, in plain terms",
    body: "Customers must opt in before you message them. Outside a 24-hour customer-service window, messages must use templates approved by Meta. Meta bills template messages to your WhatsApp Business account. We set all of this up in your account, and the costs stay visible to you.",
    placement: "afterTools",
  },
  pricing: agenticPricing,
  faqs: [
    {
      question: "Do we need a new phone number?",
      answer:
        "You can use an existing number that is not currently registered with the WhatsApp app, or a new one. We walk you through either.",
    },
    {
      question: "Which languages can it handle?",
      answer:
        "It handles English and Hindi, and replies in whichever of them the customer writes in.",
    },
    {
      question: "What if a customer asks for a person?",
      answer:
        "The chat is handed to your team's inbox immediately, with the transcript, and the agent stops responding on that thread.",
    },
    {
      question: "How are messages billed?",
      answer:
        "By Meta, per template message, to your WhatsApp Business account. We do not mark these up.",
    },
  ],
  updated: "2026-10-31",
};
