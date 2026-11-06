import { Bell, Check, PenLine, Search, Server, Smartphone, TrendingUp } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import OnScreen from "@/components/motion/OnScreen";
import { Layer } from "@/components/motion/TiltScene";
import TechLogo from "@/components/ui/TechLogo";
import type { ServiceSlug } from "@/content/types";

/*
 * The small 3D scenes inside the home page service cards. Each is a set of
 * Layers at different depths inside a TiltScene's Scene; the cards' text says
 * the same things, so the scenes are decorative.
 */

function Chip({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <>
      {icon}
      {children}
    </>
  );
}

const ICON = { size: 16, strokeWidth: 1.9, "aria-hidden": true } as const;

function WebScene() {
  return (
    <>
      <Layer
        z={10}
        className="inset-x-[9%] top-[30px] bottom-[-1px] rounded-t-[14px] border border-line bg-card shadow-soft"
      >
        <div className="flex h-[30px] items-center gap-1.5 border-b border-line px-3">
          <span className="size-2 rounded-full bg-[#f26b5b]" />
          <span className="size-2 rounded-full bg-[#f5b54a]" />
          <span className="size-2 rounded-full bg-[#3ec27a]" />
          <span className="ml-2.5 h-3.5 flex-1 rounded-md bg-bg-soft" />
        </div>
        <div className="flex gap-4 p-[18px]">
          <div className="flex flex-1 flex-col gap-[9px]">
            <span className="h-[13px] w-[88%] rounded-[5px] bg-ink" />
            <span className="h-[13px] w-[62%] rounded-[5px] bg-ink" />
            <span className="mt-1 h-[7px] w-[92%] rounded-[5px] bg-line" />
            <span className="h-[7px] w-[72%] rounded-[5px] bg-line" />
            <span className="mt-1.5 h-[26px] w-24 rounded-full bg-accent" />
          </div>
          <div className="flex-1 rounded-[12px] bg-accent-soft" />
        </div>
      </Layer>
      <Layer z={60} className="float-chip bottom-[26px] left-[5%]">
        <Chip icon={<Smartphone {...ICON} className="text-c-web" />}>Mobile first</Chip>
      </Layer>
      <Layer z={85} className="float-chip top-4 right-[5%]">
        <Chip icon={<Check {...ICON} className="text-ok" />}>Search-ready</Chip>
      </Layer>
      {/* Above "Mobile first", not beside it: on narrow cards the two chips met and this one lost its icon. */}
      <Layer z={45} className="float-chip right-[12%] bottom-[74px] max-sm:hidden">
        <Chip icon={<PenLine {...ICON} className="text-accent" />}>Your team edits it</Chip>
      </Layer>
    </>
  );
}

function AppScene() {
  return (
    <>
      <Layer
        z={20}
        className="top-6 left-[calc(50%-60px)] h-[210px] w-[120px] rounded-[24px] bg-ink p-2"
      >
        <div className="flex h-full flex-col gap-2 rounded-[17px] bg-card px-3 py-4">
          <span className="h-[62px] rounded-[10px] bg-[color-mix(in_srgb,var(--c-mob)_22%,transparent)]" />
          <span className="h-2 w-[80%] rounded-[5px] bg-ink" />
          <span className="h-1.5 w-[60%] rounded-[5px] bg-line" />
          <span className="h-1.5 w-[70%] rounded-[5px] bg-line" />
          <span className="mt-auto h-[26px] rounded-full bg-accent" />
        </div>
      </Layer>
      <Layer z={90} className="float-chip top-10 left-[6%]">
        <Chip icon={<Check {...ICON} className="text-ok" />}>Payment received</Chip>
      </Layer>
      <Layer z={70} className="float-chip top-24 right-[6%]">
        <Chip icon={<Bell {...ICON} className="text-c-mob" />}>Order shipped</Chip>
      </Layer>
      <Layer z={50} className="float-chip right-[10%] bottom-5 max-sm:hidden">
        <Chip>iOS and Android, one codebase</Chip>
      </Layer>
    </>
  );
}

function Bubble({ children, me = false }: { children: ReactNode; me?: boolean }) {
  return (
    <span
      className={
        me
          ? "block rounded-[14px] bg-accent px-3 py-2 text-[0.8125rem] leading-snug text-accent-ink shadow-soft"
          : "block rounded-[14px] border border-line bg-chip px-3 py-2 text-[0.8125rem] leading-snug text-ink shadow-soft"
      }
    >
      {children}
    </span>
  );
}

function AgenticScene() {
  return (
    <>
      <Layer z={20} className="top-6 left-[6%] max-w-[62%]">
        <Bubble>Can I book a call this week?</Bubble>
      </Layer>
      <Layer z={40} className="top-[82px] right-[6%] max-w-[62%]">
        <Bubble me>Sure. Tuesday 11:00 or Wednesday 16:30?</Bubble>
      </Layer>
      <Layer z={55} className="top-[146px] left-[10%] max-w-[62%]">
        <Bubble>Wednesday, please</Bubble>
      </Layer>
      <Layer z={95} className="float-chip right-[8%] bottom-[22px]">
        <Chip icon={<Check {...ICON} className="text-ok" />}>Booked: Wed 16:30</Chip>
      </Layer>
    </>
  );
}

function MarketingScene() {
  const heights = [26, 34, 31, 46, 55, 66, 80, 100];
  return (
    <>
      <Layer
        z={15}
        className="inset-x-[9%] top-[34px] rounded-[16px] border border-line bg-card px-5 py-[18px] shadow-soft"
      >
        <div className="mb-3.5 flex justify-between text-[0.84rem] font-semibold text-body">
          <span>Enquiries per week</span>
          <span className="text-c-mkt">Last 8 weeks</span>
        </div>
        <OnScreen className="scene-bars">
          {heights.map((height, index) => (
            <span key={height} style={{ height: `${height}%`, "--i": index } as CSSProperties} />
          ))}
        </OnScreen>
      </Layer>
      <Layer z={80} className="float-chip top-3.5 right-[4%]">
        <Chip icon={<TrendingUp {...ICON} className="text-c-mkt" />}>Leads tracked</Chip>
      </Layer>
      <Layer z={60} className="float-chip bottom-3 left-[4%]">
        <Chip icon={<Search {...ICON} className="text-c-web" />}>SEO, Google Ads, Meta Ads</Chip>
      </Layer>
    </>
  );
}

/** Centres of the hub and its three tool tiles, in percent of the scene. */
const HUB = { x: 50, y: 52 };
const SPOKES = [
  { x: 17, y: 24, logo: "postgresql", z: 60 },
  { x: 83, y: 22, logo: "googlecloud", z: 75 },
  { x: 78, y: 80, logo: "docker", z: 50 },
] as const;

function CustomScene() {
  return (
    <>
      <Layer z={8} className="inset-0">
        <OnScreen className="size-full">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="size-full"
            aria-hidden="true"
          >
            {SPOKES.map((spoke) => (
              <line
                key={spoke.logo}
                x1={spoke.x}
                y1={spoke.y}
                x2={HUB.x}
                y2={HUB.y}
                className="hub-wire"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </OnScreen>
      </Layer>
      <Layer
        z={35}
        className="grid size-[68px] place-items-center rounded-[18px] bg-accent text-accent-ink shadow-[0_16px_40px_var(--glow)]"
        style={{ left: `calc(${HUB.x}% - 34px)`, top: `calc(${HUB.y}% - 34px)` }}
      >
        <Server size={30} strokeWidth={1.7} aria-hidden="true" />
      </Layer>
      {SPOKES.map((spoke) => (
        <Layer
          key={spoke.logo}
          z={spoke.z}
          className="grid size-[54px] place-items-center rounded-[14px] border border-line bg-card shadow-soft"
          style={{ left: `calc(${spoke.x}% - 27px)`, top: `calc(${spoke.y}% - 27px)` }}
        >
          <TechLogo slug={spoke.logo} size={28} />
        </Layer>
      ))}
    </>
  );
}

/** The scene for each service line on the home page. */
export const serviceScenes: Partial<Record<ServiceSlug, () => ReactNode>> = {
  "web-development": WebScene,
  "app-development": AppScene,
  "agentic-automation": AgenticScene,
  "digital-marketing": MarketingScene,
  "custom-software": CustomScene,
};
