import { Inbox } from "lucide-react";
import type { Metadata } from "next";
import LeadFilters from "@/components/admin/LeadFilters";
import LeadsTable from "@/components/admin/LeadsTable";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { leadFiltersSchema } from "@/features/admin/schema";
import { listLeadsPage } from "@/features/leads/service";
import { requireAdmin } from "@/features/admin/auth";

export const instant = false;

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  await requireAdmin("/admin/leads");
  const filters = leadFiltersSchema.parse(await searchParams);
  const result = await listLeadsPage(filters);
  if (!result.ok) throw result.error;
  const { leads, total, page, pageCount } = result.data;
  const filtered = Boolean(filters.status || filters.source || filters.q);

  return (
    <div className="grid gap-8">
      <h1 className="type-h2">Leads</h1>
      <LeadFilters status={filters.status} source={filters.source} q={filters.q} />
      {leads.length ? (
        <>
          <LeadsTable leads={leads} now={new Date()} />
          <Pagination
            page={page}
            pageCount={pageCount}
            total={total}
            params={{ status: filters.status, source: filters.source, q: filters.q }}
          />
        </>
      ) : (
        <EmptyState
          icon={Inbox}
          title={filtered ? "No leads match these filters" : "No confirmed leads yet"}
        >
          {filtered
            ? "Clear the search or choose another status or source."
            : "Leads appear here once their email is confirmed. Share the contact page or the project brief to get the first one."}
        </EmptyState>
      )}
    </div>
  );
}
