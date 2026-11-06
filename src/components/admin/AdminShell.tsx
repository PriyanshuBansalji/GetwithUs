import { Bell, Inbox, LayoutDashboard, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import AccountMenu from "@/components/admin/AccountMenu";
import UnreadBadge from "@/components/admin/UnreadBadge";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";

const nav: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: Inbox },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
];

type AdminShellProps = { email: string; unreadCount: number; children: ReactNode };

/** The admin frame: left navigation, a header with the unread bell and account menu, and the page. */
export default function AdminShell({ email, unreadCount, children }: AdminShellProps) {
  return (
    <div className="grid min-h-svh md:grid-cols-[220px_minmax(0,1fr)]">
      <aside
        aria-label="Admin sidebar"
        className="border-b border-line bg-card md:border-r md:border-b-0"
      >
        <div className="flex h-16 items-center px-5">
          <Logo size="md" href="/admin" />
        </div>
        <nav aria-label="Admin" className="px-3 pb-4">
          <ul className="flex gap-1 md:grid">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-control px-3 py-2 type-small text-body transition-colors duration-150 ease-out hover:bg-card-2 hover:text-ink"
                >
                  <Icon icon={item.icon} size={16} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-end gap-2 border-b border-line px-6">
          {/* Keyed so a server refresh (after marking read) resets the polled count. */}
          <UnreadBadge key={unreadCount} initialCount={unreadCount} />
          <AccountMenu email={email} />
        </header>
        <main id="content" tabIndex={-1} className="px-6 py-8 outline-none md:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
