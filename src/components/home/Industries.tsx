import {
  Briefcase,
  Car,
  Coffee,
  Dumbbell,
  Factory,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Plane,
  Scissors,
  ShoppingBag,
  Truck,
  type LucideIcon,
} from "lucide-react";
import Marquee from "@/components/motion/Marquee";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SectionIntro from "@/components/ui/SectionIntro";
import { home } from "@/content/home";
import { industries, type IndustryIcon } from "@/content/industries";

const ICONS: Record<IndustryIcon, LucideIcon> = {
  clinic: HeartPulse,
  salon: Scissors,
  home: Home,
  education: GraduationCap,
  restaurant: Coffee,
  retail: ShoppingBag,
  logistics: Truck,
  factory: Factory,
  briefcase: Briefcase,
  travel: Plane,
  car: Car,
  bank: Landmark,
  fitness: Dumbbell,
};

function Pill({ name, icon }: { name: string; icon: IndustryIcon }) {
  return (
    <span className="flex h-[76px] items-center gap-3.5 rounded-full border border-line bg-card pr-7 pl-3 text-[1.0625rem] font-bold whitespace-nowrap text-ink shadow-soft">
      <span className="grid size-[52px] place-items-center rounded-full border-[1.5px] border-accent text-accent">
        <Icon icon={ICONS[icon]} size={24} />
      </span>
      {name}
    </span>
  );
}

/** "Industries we build for": two marquee rows of icon pills. Hidden until the owner confirms the list. */
export default function Industries() {
  if (industries.length === 0) return null;
  const half = Math.ceil(industries.length / 2);
  return (
    <section aria-labelledby="industries-title" className="py-20 md:py-[120px]">
      <Container>
        <SectionIntro
          id="industries-title"
          title={home.industries.title}
          lead={home.industries.lead}
        />
      </Container>
      <div className="mt-14">
        <Marquee label="Industries, first row" duration={70}>
          {industries.slice(0, half).map((industry) => (
            <Pill key={industry.name} {...industry} />
          ))}
        </Marquee>
        <Marquee label="Industries, second row" duration={75} reverse>
          {industries.slice(half).map((industry) => (
            <Pill key={industry.name} {...industry} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
