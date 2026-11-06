"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { apiRequest } from "@/lib/api-client";

const POLL_MS = 30_000;

/** The header bell with the unread count, refreshed every 30 seconds while the tab is visible. */
export default function UnreadBadge({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const poll = async () => {
      if (document.visibilityState !== "visible") return;
      const result = await apiRequest<{ count: number }>(
        "/api/v1/admin/notifications/unread-count",
      );
      if (result.ok) setCount(result.data.count);
    };
    const timer = window.setInterval(() => void poll(), POLL_MS);
    return () => window.clearInterval(timer);
  }, []);

  const label = count === 1 ? "1 unread notification" : `${count} unread notifications`;
  return (
    <Link
      href="/admin/notifications"
      aria-label={label}
      className="relative inline-flex h-9 items-center gap-2 rounded-control px-2.5 text-body transition-colors duration-150 ease-out hover:bg-card-2"
    >
      <Icon icon={Bell} size={20} />
      {count > 0 ? (
        <span className="min-w-5 rounded-tag bg-accent px-1.5 text-center type-small font-semibold text-accent-ink tabular-nums">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
