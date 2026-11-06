import Skeleton from "@/components/ui/Skeleton";

/** Shown inside the admin shell while a page loads its data. */
export default function AdminLoading() {
  return (
    <div className="grid gap-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
