import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

type TableProps<T> = {
  /** Describes the table for screen readers; rendered visually hidden. */
  caption: string;
  columns: readonly Column<T>[];
  rows: readonly T[];
  rowKey: (row: T) => string;
  /** When set, the first column links to this URL and the whole row is clickable. */
  rowHref?: (row: T) => string;
  className?: string;
};

/**
 * A data table. When rows link somewhere, the first cell holds a real link and
 * stretches it over the row, so the row is clickable and still keyboard and
 * screen reader friendly.
 */
export default function Table<T>({
  caption,
  columns,
  rows,
  rowKey,
  rowHref,
  className,
}: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-card border border-line", className)}>
      <table className="w-full border-collapse text-left type-small">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-card">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "border-b border-line px-4 py-3 font-medium whitespace-nowrap text-body",
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const href = rowHref?.(row);
            return (
              <tr
                key={rowKey(row)}
                className={cn(
                  "border-b border-line last:border-b-0",
                  href && "relative transition-colors duration-150 ease-out hover:bg-card",
                )}
              >
                {columns.map((column, index) => (
                  <td
                    key={column.key}
                    className={cn("px-4 py-3 align-top text-ink", column.className)}
                  >
                    {href && index === 0 ? (
                      <Link
                        href={href}
                        className="font-medium text-ink after:absolute after:inset-0 after:content-['']"
                      >
                        {column.cell(row)}
                      </Link>
                    ) : (
                      column.cell(row)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
