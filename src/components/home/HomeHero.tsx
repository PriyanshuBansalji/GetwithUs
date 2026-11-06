import { Check } from "lucide-react";
import Orbit3D, { type OrbitItem } from "@/components/motion/Orbit3D";
import Typewriter from "@/components/motion/Typewriter";
import { serviceColors, serviceIcons } from "@/components/sections/serviceIcons";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { home } from "@/content/home";
import { homePage } from "@/content/pages";
import { allServices } from "@/content/services/catalog";

/** The orbit's chips: the five service lines and the two agentic products, each a link to its page. */
const orbitItems: OrbitItem[] = allServices.map((service) => {
  const ServiceIcon = serviceIcons[service.slug];
  return {
    label: service.name,
    short: service.slug === "custom-software" ? "Custom software" : undefined,
    href: service.href,
    color: serviceColors[service.slug],
    icon: <ServiceIcon size={17} strokeWidth={1.9} />,
  };
});

/**
 * The home hero on the dotted background: the booking pill (once the month is
 * known), the h1 with its typewriter word, the lead, both actions, and the
 * three proof items; the services orbit on the right. The h1 paints at once
 * with its first word; nothing above the fold waits for JavaScript.
 */
export default function HomeHero() {
  const { hero } = homePage;
  return (
    <section
      aria-labelledby="hero-title"
      className="dots-bg overflow-hidden pt-12 pb-20 md:pt-[70px] md:pb-[90px]"
    >
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          {home.hero.booking ? (
            <p className="mb-[26px] inline-flex items-center gap-2.5 rounded-full border border-line bg-card py-2 pr-4 pl-3 text-sm font-semibold text-body shadow-soft">
              <span className="pulse-dot" aria-hidden="true" />
              {home.hero.booking}
            </p>
          ) : null}
          <h1 id="hero-title" className="type-display text-ink">
            <span className="block">{home.hero.before}</span>
            <span className="block min-h-[1.04em] text-[0.92em] text-accent">
              <Typewriter words={home.hero.words} spoken={home.hero.spoken} />
            </span>
            <span className="block">{home.hero.after}</span>
          </h1>
          <p className="mt-5 max-w-[34em] type-lead text-body">{hero.lead}</p>
          <div className="mt-[34px] flex flex-wrap gap-3.5">
            <Button href={hero.primary.href} size="lg">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary" size="lg">
              {hero.secondary.label}
            </Button>
          </div>
          <ul className="mt-[34px] flex flex-wrap gap-x-[22px] gap-y-3 text-[0.97rem] font-medium text-body">
            {hero.proof.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check size={18} strokeWidth={2.4} className="text-ok" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <Orbit3D items={orbitItems} label="Services" />
      </Container>
    </section>
  );
}
