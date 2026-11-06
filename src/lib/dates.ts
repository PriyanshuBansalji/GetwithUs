const longDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats an ISO date (or Date) as "31 October 2026". UTC, so server and client agree. */
export function formatDate(value: string | Date): string {
  return longDate.format(typeof value === "string" ? new Date(value) : value);
}

const dateTime = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
});

/** "31 Oct 2026, 14:05 UTC": exact timestamps in the admin area. */
export function formatDateTime(value: Date): string {
  return dateTime.format(value);
}

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const steps: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** "3 hours ago", "yesterday", "now". Rendered per request in the admin, never prerendered. */
export function formatRelative(value: Date, now: Date): string {
  const seconds = Math.round((value.getTime() - now.getTime()) / 1000);
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
