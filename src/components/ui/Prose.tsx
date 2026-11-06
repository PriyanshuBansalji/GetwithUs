import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Long-form text (legal pages): headings, paragraphs, and lists at a readable measure. */
export default function Prose({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-[68ch] text-ink",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:type-h3 [&>h2:first-child]:mt-0 [&>section:first-child>h2]:mt-0",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:type-h4",
        "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5",
        "[&_li]:pl-1 [&_li]:marker:text-muted",
        "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-accent",
        "[&_strong]:font-semibold",
        className,
      )}
      {...props}
    />
  );
}
