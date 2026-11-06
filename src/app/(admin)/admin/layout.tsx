import type { Metadata } from "next";
import ForceDarkTheme from "@/components/admin/ForceDarkTheme";

/** The admin area is for the team only: never indexed, never followed. */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false, nocache: true },
};

/** The admin is always dark (docs/design.md, Theme). */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <ForceDarkTheme />
      {children}
    </>
  );
}
