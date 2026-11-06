import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

type PaginationProps = {
  page: number;
  pageCount: number;
  total: number;
  /** The current query string without `page`, so filters carry across pages. */
  params: Record<string, string | undefined>;
};

const linkClasses =
  "inline-flex h-9 items-center gap-1.5 rounded-control border border-line-2 px-3 type-small text-ink transition-colors duration-150 ease-out hover:border-muted";

function hrefFor(params: PaginationProps["params"], page: number): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
  if (page > 1) query.set("page", String(page));
  const search = query.toString();
  return `/admin/leads${search ? `?${search}` : ""}`;
}

/** Previous and next links with the position, 25 leads per page. */
export default function Pagination({ page, pageCount, total, params }: PaginationProps) {
  return (
    <nav aria-label="Pages" className="flex flex-wrap items-center justify-between gap-4">
      <p className="type-small text-body">
        Page {page} of {pageCount}, {total} {total === 1 ? "lead" : "leads"}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={hrefFor(params, page - 1)} className={linkClasses}>
            <Icon icon={ChevronLeft} size={16} />
            Previous page
          </Link>
        ) : null}
        {page < pageCount ? (
          <Link href={hrefFor(params, page + 1)} className={linkClasses}>
            Next page
            <Icon icon={ChevronRight} size={16} />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
