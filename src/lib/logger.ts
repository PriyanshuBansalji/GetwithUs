import { publicEnv } from "@/config/public-env";

type Level = "info" | "warn" | "error";

type LogFields = { requestId?: string } & Record<string, unknown>;

function serialize(value: unknown): unknown {
  if (value instanceof Error) {
    const base: Record<string, unknown> = { name: value.name, message: value.message };
    if ("code" in value) base.code = value.code;
    if (publicEnv.nodeEnv !== "production" && value.stack) base.stack = value.stack;
    if (value.cause !== undefined) base.cause = serialize(value.cause);
    return base;
  }
  return value;
}

function write(level: Level, message: string, fields?: LogFields): void {
  const entries = Object.entries(fields ?? {}).map(
    ([key, value]) => [key, serialize(value)] as const,
  );

  if (publicEnv.nodeEnv === "production") {
    const line = JSON.stringify({
      level,
      time: new Date().toISOString(),
      message,
      ...Object.fromEntries(entries),
    });
    console[level](line);
    return;
  }

  const suffix = entries.length
    ? " " +
      entries
        .map(
          ([key, value]) => `${key}=${typeof value === "string" ? value : JSON.stringify(value)}`,
        )
        .join(" ")
    : "";
  console[level](`[${level}] ${message}${suffix}`);
}

/**
 * Structured logger. JSON lines in production, readable lines in development.
 * Never pass verification codes, tokens, request bodies, or unmasked client emails.
 */
export const logger = {
  info: (message: string, fields?: LogFields) => write("info", message, fields),
  warn: (message: string, fields?: LogFields) => write("warn", message, fields),
  error: (message: string, fields?: LogFields) => write("error", message, fields),
};

/** Masks an email for logs: `jane@example.com` becomes `j***@example.com`. */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 1) return "***";
  return `${email[0]}***${email.slice(at)}`;
}
