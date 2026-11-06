import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import SkipLink from "@/components/layout/SkipLink";
import Toast from "@/components/ui/Toast";
import { site } from "@/config/site";
import { THEME_SCRIPT } from "@/lib/theme";
import "@/styles/globals.css";

// Headings: Bricolage Grotesque, variable, with its optical-size axis.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bricolage",
});

// Body and interface: Figtree, variable.
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

// Code and terminals only, all well below the first screen: not preloaded, so it does
// not compete with the heading and body fonts (and no unused-preload warning).
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: software your business runs on`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // [OWNER: change lang if the primary language of the site is not English]
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${bricolage.variable} ${figtree.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Applies the stored theme before first paint (src/lib/theme.ts); the CSP allows inline scripts. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <SkipLink />
        {children}
        <Toast />
      </body>
    </html>
  );
}
