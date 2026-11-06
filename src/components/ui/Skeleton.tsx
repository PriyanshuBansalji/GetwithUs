import { cn } from "@/lib/cn";

/** Loading placeholder. Size it with utility classes where it is used. */
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("animate-pulse rounded-control bg-card-2", className)} />
  );
}
