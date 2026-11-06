import {
  Bot,
  Globe,
  Megaphone,
  MessageCircle,
  Phone,
  Server,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { ServiceSlug } from "@/content/types";

/** The icon for each service, shared by the menus, the orbit, and the service cards. */
export const serviceIcons: Record<ServiceSlug, LucideIcon> = {
  "web-development": Globe,
  "app-development": Smartphone,
  "agentic-automation": Bot,
  "whatsapp-bot": MessageCircle,
  "calling-agent": Phone,
  "digital-marketing": Megaphone,
  "custom-software": Server,
};

/** Each service's category colour (tokens.css), for icon tiles and orbit chips. */
export const serviceColors: Record<ServiceSlug, string> = {
  "web-development": "var(--c-web)",
  "app-development": "var(--c-mob)",
  "agentic-automation": "var(--c-data)",
  "whatsapp-bot": "var(--wa)",
  "calling-agent": "var(--c-ai)",
  "digital-marketing": "var(--c-mkt)",
  "custom-software": "var(--accent)",
};
