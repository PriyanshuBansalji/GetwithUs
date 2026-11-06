import Tooltip from "@/components/ui/Tooltip";
import { formatDateTime, formatRelative } from "@/lib/dates";

/** A relative time ("2 days ago") with the exact UTC timestamp on hover or focus. */
export default function Timestamp({ value, now }: { value: Date; now: Date }) {
  const exact = formatDateTime(value);
  return (
    <Tooltip content={exact}>
      <time dateTime={value.toISOString()} tabIndex={0} className="rounded-tag whitespace-nowrap">
        {formatRelative(value, now)}
      </time>
    </Tooltip>
  );
}
