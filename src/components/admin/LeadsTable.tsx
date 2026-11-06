import Timestamp from "@/components/admin/Timestamp";
import Badge from "@/components/ui/Badge";
import Table from "@/components/ui/Table";
import { serviceName } from "@/content/services/catalog";
import { sourceLabels, statusLabels, statusTones } from "@/features/leads/status";
import type { Lead } from "@/features/leads/types";

/** Leads with name, company, source, services, status, and age. Each row opens the lead. */
export default function LeadsTable({ leads, now }: { leads: readonly Lead[]; now: Date }) {
  return (
    <Table
      caption="Leads, newest first"
      rows={leads}
      rowKey={(lead) => lead.id}
      rowHref={(lead) => `/admin/leads/${lead.id}`}
      columns={[
        { key: "name", header: "Name", cell: (lead) => lead.name },
        {
          key: "company",
          header: "Company",
          cell: (lead) => lead.company ?? <span className="text-muted">None</span>,
        },
        { key: "source", header: "Source", cell: (lead) => sourceLabels[lead.source] },
        {
          key: "services",
          header: "Services",
          cell: (lead) =>
            lead.services.map(serviceName).join(", ") || <span className="text-muted">None</span>,
        },
        {
          key: "status",
          header: "Status",
          cell: (lead) => (
            <Badge tone={statusTones[lead.status]}>{statusLabels[lead.status]}</Badge>
          ),
        },
        {
          key: "created",
          header: "Created",
          className: "relative z-10",
          cell: (lead) => <Timestamp value={lead.createdAt} now={now} />,
        },
      ]}
    />
  );
}
