export const LEAD_STATUSES = [
  "pending_verification",
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
  "spam",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Statuses a team member can choose. "Awaiting verification" is set only by the system. */
export const ASSIGNABLE_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
  "spam",
] as const satisfies readonly LeadStatus[];
export type LeadSource = "contact" | "brief" | "api";
export type LeadEventType =
  | "created"
  | "verification_sent"
  | "verified"
  | "status_changed"
  | "note_added"
  | "notification_sent"
  | "notification_failed";

/** Technical context stored with a lead. The IP is only ever stored as a salted hash. */
export type LeadMeta = {
  ipHash?: string;
  userAgent?: string;
  locale?: string;
  utm?: Record<string, string>;
  turnstile?: boolean;
  /** The integration that created an API lead, for example "whatsapp-bot". */
  integration?: string;
};

export type Lead = {
  id: string;
  source: LeadSource;
  status: LeadStatus;
  name: string;
  email: string;
  emailVerifiedAt: Date | null;
  company: string | null;
  phone: string | null;
  services: string[];
  message: string | null;
  budgetRange: string | null;
  timeline: string | null;
  existingUrl: string | null;
  referral: string | null;
  meta: LeadMeta;
  createdAt: Date;
  updatedAt: Date;
};

/** The fields a new lead is created with. */
export type NewLead = Pick<Lead, "source" | "name" | "email"> &
  Partial<
    Pick<
      Lead,
      | "company"
      | "phone"
      | "services"
      | "message"
      | "budgetRange"
      | "timeline"
      | "existingUrl"
      | "referral"
      | "meta"
    >
  >;

export type LeadEvent = {
  id: string;
  leadId: string;
  type: LeadEventType;
  /** "client", "system", or the email of the admin who acted. */
  actor: string;
  data: Record<string, unknown>;
  createdAt: Date;
};

/** The newest unconsumed verification code for a lead. */
export type ActiveVerification = {
  id: string;
  leadId: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
};
