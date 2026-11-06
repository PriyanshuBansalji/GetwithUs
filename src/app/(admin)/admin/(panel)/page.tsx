import type { Metadata } from "next";
import Link from "next/link";
import LeadsTable from "@/components/admin/LeadsTable";
import NotificationFeed from "@/components/admin/NotificationFeed";
import EmptyState from "@/components/ui/EmptyState";
import { leadOverview } from "@/features/leads/service";
import { statusLabels } from "@/features/leads/status";
import { LEAD_STATUSES } from "@/features/leads/types";
import { notificationFeed } from "@/features/notifications/service";
import { requireAdmin } from "@/features/admin/auth";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  await requireAdmin("/admin");
  const [overview, unread] = await Promise.all([leadOverview(), notificationFeed(true)]);
  if (!overview.ok) throw overview.error;
  if (!unread.ok) throw unread.error;
  const now = new Date();
  const { counts, recent } = overview.data;

  return (
    <div className="grid gap-10">
      <h1 className="type-h2">Dashboard</h1>
      <section aria-labelledby="counts-title">
        <h2 id="counts-title" className="sr-only">
          Leads by status
        </h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
          {LEAD_STATUSES.map((status) => (
            <div key={status} className="rounded-card border border-line bg-card p-4">
              <dt className="type-small text-body">{statusLabels[status]}</dt>
              <dd className="mt-1 type-h3 tabular-nums">
                <Link
                  href={`/admin/leads?status=${status}`}
                  aria-label={`${statusLabels[status]}: ${counts[status] ?? 0}`}
                  className="hover:text-accent"
                >
                  {counts[status] ?? 0}
                </Link>
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="recent-title" className="grid gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="recent-title" className="type-h4">
            Recent leads
          </h2>
          <Link href="/admin/leads" className="type-small text-accent hover:text-accent">
            All leads
          </Link>
        </div>
        {recent.length ? (
          <LeadsTable leads={recent} now={now} />
        ) : (
          <EmptyState title="No confirmed leads yet">
            Leads appear here once their email is confirmed.
          </EmptyState>
        )}
      </section>
      <section aria-labelledby="unread-title" className="grid gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="unread-title" className="type-h4">
            Unread notifications
          </h2>
          <Link href="/admin/notifications" className="type-small text-accent hover:text-accent">
            All notifications
          </Link>
        </div>
        <NotificationFeed notifications={unread.data.slice(0, 5)} now={now} compact />
      </section>
    </div>
  );
}
