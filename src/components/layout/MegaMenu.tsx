"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "radix-ui";
import type { CSSProperties } from "react";
import { serviceColors, serviceIcons } from "@/components/sections/serviceIcons";
import Icon from "@/components/ui/Icon";
import type { ServiceSummary } from "@/content/types";
import { cn } from "@/lib/cn";

const navLinkClasses =
  "relative inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[0.98rem] font-medium text-body transition-colors duration-150 ease-out hover:text-ink aria-[current=page]:text-ink data-[state=open]:text-ink aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-3.5 aria-[current=page]:after:bottom-1 aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-full aria-[current=page]:after:bg-accent aria-[current=page]:after:content-['']";

/** The current section: ink text with an accent underline (accent text failed contrast on the frosted header). */
const currentClasses =
  "text-ink after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:rounded-full after:bg-accent after:content-['']";

/** True when the path is the link or a page below it. */
function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type MegaMenuProps = {
  services: readonly ServiceSummary[];
  links: readonly { label: string; href: string }[];
};

/**
 * Desktop navigation. "Services" opens a two-column panel on hover (120 ms
 * intent delay), click, or Enter: each line with its icon tile and one-line
 * description, the agentic products as small links under their line.
 * Escape and moving focus out of the panel close it.
 */
export default function MegaMenu({ services, links }: MegaMenuProps) {
  const pathname = usePathname();
  return (
    <NavigationMenu.Root
      delayDuration={120}
      aria-label="Primary"
      className="relative hidden lg:block"
    >
      <NavigationMenu.List className="flex items-center gap-1">
        <NavigationMenu.Item className="relative">
          <NavigationMenu.Trigger
            className={cn(
              navLinkClasses,
              "group",
              isCurrent(pathname, "/services") && currentClasses,
            )}
          >
            Services
            <Icon
              icon={ChevronDown}
              size={16}
              className="transition-transform duration-150 ease-out group-data-[state=open]:rotate-180"
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-[calc(100%+14px)] left-0 w-[760px] rounded-card border border-line bg-card p-3 shadow-lift data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in">
            <ul className="grid grid-cols-2 gap-1">
              {services.map((service) => {
                const ServiceIcon = serviceIcons[service.slug];
                return (
                  <li key={service.slug}>
                    <NavigationMenu.Link asChild>
                      <Link
                        href={service.href}
                        className="flex gap-3.5 rounded-[16px] p-3 transition-colors duration-150 ease-out hover:bg-bg-soft"
                      >
                        <span
                          aria-hidden="true"
                          className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[color-mix(in_srgb,var(--c)_14%,transparent)] text-[var(--c)]"
                          style={{ "--c": serviceColors[service.slug] } as CSSProperties}
                        >
                          <Icon icon={ServiceIcon} size={20} />
                        </span>
                        <span>
                          <span className="block font-bold text-ink">{service.name}</span>
                          <span className="mt-0.5 block type-small text-body">
                            {service.menuDescription}
                          </span>
                        </span>
                      </Link>
                    </NavigationMenu.Link>
                    {service.children?.length ? (
                      <ul className="flex flex-wrap gap-2 pb-2 pl-[66px]">
                        {service.children.map((child) => (
                          <li key={child.slug}>
                            <NavigationMenu.Link asChild>
                              <Link
                                href={child.href}
                                className="inline-flex rounded-full border border-line bg-bg-soft px-3 py-1 text-[0.8125rem] font-semibold text-body transition-colors duration-150 ease-out hover:border-accent hover:text-ink"
                              >
                                {child.name}
                              </Link>
                            </NavigationMenu.Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <div className="mt-1 border-t border-line px-3 pt-3 pb-1">
              <NavigationMenu.Link asChild>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-1.5 type-small font-semibold text-accent"
                >
                  All services
                  <Icon
                    icon={ArrowRight}
                    size={16}
                    className="transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                  />
                </Link>
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        {links.map((link) => (
          <NavigationMenu.Item key={link.href}>
            <NavigationMenu.Link asChild>
              <Link
                href={link.href}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                className={navLinkClasses}
              >
                {link.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
