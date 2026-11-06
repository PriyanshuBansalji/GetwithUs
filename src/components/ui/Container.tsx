import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Page-width container: 1200 px max, 24 px side padding on mobile, 40 px from 768 px. */
export default function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-6 md:px-10", className)} {...props} />
  );
}
