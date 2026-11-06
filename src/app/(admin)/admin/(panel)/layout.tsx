import { Suspense, type ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Skeleton from "@/components/ui/Skeleton";
import { requireAdmin } from "@/features/admin/auth";
import { unreadCount } from "@/features/notifications/service";

/** Verifies the session against the database (behind the cookie check in proxy.ts), then draws the shell. */
async function AdminGate({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  const unread = await unreadCount();
  return (
    <AdminShell email={admin.email} unreadCount={unread.ok ? unread.data : 0}>
      {children}
    </AdminShell>
  );
}

function ShellSkeleton() {
  return (
    <div className="grid min-h-svh md:grid-cols-[220px_minmax(0,1fr)]" aria-busy="true">
      <div className="hidden border-r border-line bg-card md:block" />
      <div className="grid content-start gap-6 px-10 py-24">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

/** Reading the session is request-time work, so it sits inside Suspense (cacheComponents). */
export default function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<ShellSkeleton />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
