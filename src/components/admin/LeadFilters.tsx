import Button from "@/components/ui/Button";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { sourceLabels, statusLabels } from "@/features/leads/status";
import { LEAD_STATUSES } from "@/features/leads/types";

type LeadFiltersProps = { status?: string; source?: string; q?: string };

const statusOptions = LEAD_STATUSES.map((status) => ({
  value: status,
  label: statusLabels[status],
}));
const sourceOptions = Object.entries(sourceLabels).map(([value, label]) => ({ value, label }));

/**
 * Filters and search for the leads table. A plain GET form: the filters live in
 * the URL, so they survive refresh and can be shared, and work without JavaScript.
 */
export default function LeadFilters({ status, source, q }: LeadFiltersProps) {
  return (
    <form
      method="get"
      action="/admin/leads"
      className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_200px_200px_auto]"
    >
      <Field label="Search name, email, or company">
        {(control) => <Input {...control} name="q" type="search" defaultValue={q} />}
      </Field>
      <Field label="Status">
        {(control) => (
          <Select
            {...control}
            name="status"
            options={statusOptions}
            placeholder="All confirmed"
            defaultValue={status ?? ""}
          />
        )}
      </Field>
      <Field label="Source">
        {(control) => (
          <Select
            {...control}
            name="source"
            options={sourceOptions}
            placeholder="All sources"
            defaultValue={source ?? ""}
          />
        )}
      </Field>
      <div className="pb-[22px]">
        <Button type="submit" variant="secondary">
          Apply filters
        </Button>
      </div>
    </form>
  );
}
