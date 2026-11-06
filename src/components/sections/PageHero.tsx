import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type Crumb = { name: string; path: string };

type PageHeroProps = {
  id: string;
  title: string;
  lead?: ReactNode;
  /** Home first, the current page last. */
  crumbs?: readonly Crumb[];
  actions?: ReactNode;
  /** More content under the actions, for example the agentic products. */
  children?: ReactNode;
  /** The page's signature piece on the right, usually a WebGLModel. */
  visual?: ReactNode;
  className?: string;
};

/**
 * The opening of an inner page in the final design, on the dotted
 * background: breadcrumb, the h1 (plain text, so it paints at once), the lead,
 * actions, and the page's 3D model beside it.
 */
export default function PageHero({
  id,
  title,
  lead,
  crumbs,
  actions,
  children,
  visual,
  className,
}: PageHeroProps) {
  return (
    <section
      aria-labelledby={id}
      className={cn("dots-bg border-b border-line pt-10 pb-16 md:pt-14 md:pb-20", className)}
    >
      <Container>
        {crumbs && crumbs.length > 1 ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-muted">
              {/* Each separator leads its item, so a wrapped trail never ends a line on a lone chevron. */}
              {crumbs.slice(0, -1).map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-1.5">
                  {index > 0 ? <ChevronRight size={14} strokeWidth={2} aria-hidden="true" /> : null}
                  <Link
                    href={crumb.path}
                    className="inline-block py-1 transition-colors duration-150 hover:text-ink"
                  >
                    {crumb.name}
                  </Link>
                </li>
              ))}
              <li aria-current="page" className="flex items-center gap-1.5 text-accent">
                <ChevronRight size={14} strokeWidth={2} aria-hidden="true" className="text-muted" />
                {crumbs.at(-1)?.name}
              </li>
            </ol>
          </nav>
        ) : null}
        <div
          className={cn(
            "grid items-center gap-10 lg:gap-14",
            visual && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
          )}
        >
          <div>
            <h1 id={id} className="max-w-[15ch] type-display text-ink">
              {title}
            </h1>
            {lead ? <div className="mt-5 max-w-[36em] type-lead text-body">{lead}</div> : null}
            {actions ? <div className="mt-8 flex flex-wrap gap-3.5">{actions}</div> : null}
            {children}
          </div>
          {visual}
        </div>
      </Container>
    </section>
  );
}
