import ToolChip from "@/components/home/ToolChip";
import Marquee from "@/components/motion/Marquee";
import { home } from "@/content/home";
import { tools } from "@/content/tools";

const rowOne = tools.filter((_, index) => index % 2 === 0);
const rowTwo = tools.filter((_, index) => index % 2 === 1);

/** Two rows of tool chips with official marks, moving in opposite directions, under a one-line caption. */
export default function ToolMarquee() {
  return (
    <section aria-labelledby="tools-caption" className="border-b border-line py-[34px]">
      <p id="tools-caption" className="mb-[18px] px-6 text-center text-sm font-semibold text-muted">
        {home.tools.caption}
      </p>
      <Marquee label="Tools, first row" duration={55}>
        {rowOne.map((tool) => (
          <ToolChip key={tool.name} name={tool.name} logo={tool.logo} />
        ))}
      </Marquee>
      <Marquee label="Tools, second row" duration={60} reverse>
        {rowTwo.map((tool) => (
          <ToolChip key={tool.name} name={tool.name} logo={tool.logo} />
        ))}
      </Marquee>
    </section>
  );
}
