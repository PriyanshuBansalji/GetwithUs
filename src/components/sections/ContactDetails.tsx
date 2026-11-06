import { CalendarDays, Globe, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { known, site } from "@/config/site";
import { contactPage } from "@/content/pages";
import { siteContent } from "@/content/site";

type Detail = { label: string; icon: LucideIcon; value: ReactNode };

/** The contact facts the owner has filled in, with nothing shown for the rest. */
function details(): Detail[] {
  const email = known(site.contact.email);
  const phone = known(site.contact.phone);
  const address = known(site.contact.address) ?? known(site.contact.city);
  const list: Detail[] = [];
  if (email) {
    list.push({
      label: "Email",
      icon: Mail,
      value: (
        <a href={`mailto:${email}`} className="text-ink transition-colors hover:text-accent">
          {email}
        </a>
      ),
    });
  }
  list.push({
    label: "Website",
    icon: Globe,
    value: (
      <a
        href={siteContent.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink transition-colors hover:text-accent"
      >
        {siteContent.url.replace(/^https?:\/\//, "")}
      </a>
    ),
  });
  if (phone) list.push({ label: "Phone or WhatsApp", icon: Phone, value: phone });
  if (address) list.push({ label: "Office", icon: MapPin, value: address });
  return list;
}

/** True when there is anything to show: a known contact fact or the scheduling link. */
export function hasContactDetails(showBooking = false): boolean {
  return details().length > 0 || (showBooking && Boolean(site.schedulingUrl));
}

/** Email, phone and WhatsApp, and office, each only once known; and "Book a call" when the scheduling link is set. */
export default function ContactDetails({ showBooking = false }: { showBooking?: boolean }) {
  return (
    <address className="grid gap-5 not-italic">
      {details().map((detail) => (
        <div key={detail.label} className="flex gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-accent-soft text-accent">
            <Icon icon={detail.icon} size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-muted">{detail.label}</p>
            <p className="text-ink">{detail.value}</p>
          </div>
        </div>
      ))}
      {showBooking && site.schedulingUrl ? (
        <div>
          <Button
            href={site.schedulingUrl}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={CalendarDays} size={16} />
            {contactPage.bookCall}
          </Button>
        </div>
      ) : null}
    </address>
  );
}
