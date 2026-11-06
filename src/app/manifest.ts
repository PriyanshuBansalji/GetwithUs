import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// The light theme's page colour, so an installed app opens on the same white as the site.
const BG = "#FFFFFF";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.footerDescription,
    start_url: "/",
    display: "standalone",
    background_color: BG,
    theme_color: BG,
    // The brand mark (docs/brand/README.md). The maskable icon fills the whole square,
    // so Android can crop it to any shape; the G sits well inside the safe zone.
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon.png", sizes: "32x32", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
