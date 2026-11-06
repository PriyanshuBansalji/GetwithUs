import MegaMenu from "@/components/layout/MegaMenu";
import MobileMenu from "@/components/layout/MobileMenu";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import { visibleNav } from "@/config/site";
import { serviceLines } from "@/content/services/catalog";
import { getPublishedCaseStudies } from "@/features/case-studies/getPublishedCaseStudies";

/**
 * Sticky header on a blurred, translucent surface: logo, the navigation with
 * the services mega menu, the theme switch, and the primary action.
 */
export default function Header() {
  const links = visibleNav(getPublishedCaseStudies().length > 0);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-hdr backdrop-blur-md">
      <Container className="flex h-[var(--header-h)] items-center justify-between gap-5">
        <Logo />
        <MegaMenu services={serviceLines} links={links} />
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <div className="max-[520px]:hidden">
            <Button href="/start">Start a project</Button>
          </div>
          <MobileMenu services={serviceLines} links={links} />
        </div>
      </Container>
    </header>
  );
}
