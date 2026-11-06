"use client";

import { Menu, X } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { serviceColors, serviceIcons } from "@/components/sections/serviceIcons";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import type { ServiceSummary } from "@/content/types";

type MobileMenuProps = {
  services: readonly ServiceSummary[];
  links: readonly { label: string; href: string }[];
};

// The sheet (a dialog with focus trap and scroll lock) is fetched on first use: desktop never needs it.
const loadSheet = () => import("@/components/ui/Sheet");
const Sheet = dynamic(loadSheet, { ssr: false });

const menuButtonClasses =
  "inline-flex h-11 items-center gap-2 rounded-full border border-line-2 bg-card px-4 type-button text-ink transition-colors duration-150 ease-out hover:border-muted";

/** Below 1024 px: a pill menu button that opens a full-height sheet with every link. */
export default function MobileMenu({ services, links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [requested, setRequested] = useState(false);
  const close = () => setOpen(false);
  const warm = () => void loadSheet();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        ref={menuButton}
        type="button"
        className={menuButtonClasses}
        aria-expanded={open}
        onPointerEnter={warm}
        onFocus={warm}
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
      >
        <Icon icon={Menu} size={16} />
        Menu
      </button>
      {requested ? (
        <Sheet open={open} onOpenChange={setOpen} title="Menu" returnFocusRef={menuButton}>
          <div className="flex h-14 items-center justify-between">
            <Logo onClick={close} />
            <button type="button" className={menuButtonClasses} onClick={close}>
              <Icon icon={X} size={16} />
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-8">
            <ul className="border-b border-line">
              <li className="border-t border-line">
                <Link href="/services" onClick={close} className="block py-3.5 type-h4 text-ink">
                  Services
                </Link>
                <ul className="grid gap-1 pb-3">
                  {services.map((service) => {
                    const ServiceIcon = serviceIcons[service.slug];
                    return (
                      <li key={service.slug}>
                        <Link
                          href={service.href}
                          onClick={close}
                          className="flex items-center gap-3 rounded-[14px] py-2 font-semibold text-ink"
                        >
                          <span
                            aria-hidden="true"
                            className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[color-mix(in_srgb,var(--c)_14%,transparent)] text-[var(--c)]"
                            style={{ "--c": serviceColors[service.slug] } as CSSProperties}
                          >
                            <Icon icon={ServiceIcon} size={16} />
                          </span>
                          {service.name}
                        </Link>
                        {service.children?.length ? (
                          <div className="flex flex-wrap gap-2 pb-1 pl-12">
                            {service.children.map((child) => (
                              <Link
                                key={child.slug}
                                href={child.href}
                                onClick={close}
                                className="inline-flex rounded-full border border-line bg-bg-soft px-3 py-1.5 text-sm font-semibold text-body"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </li>
              {links.map((link) => (
                <li key={link.href} className="border-t border-line">
                  <Link href={link.href} onClick={close} className="block py-3.5 type-h4 text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto pt-8">
            <Button href="/start" onClick={close} className="w-full">
              Start a project
            </Button>
          </div>
        </Sheet>
      ) : null}
    </div>
  );
}
