import { Globe, Server, Smartphone, Sparkles, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import RevealText from "@/components/motion/RevealText";
import TagSphere from "@/components/motion/TagSphere";
import Container from "@/components/ui/Container";
import TechLogo from "@/components/ui/TechLogo";
import { home } from "@/content/home";
import { toolCategories, tools, type ToolCategory } from "@/content/tools";

const CATEGORY: Record<ToolCategory, { color: string; icon: ReactNode }> = {
  web: { color: "var(--c-web)", icon: <Globe size={20} strokeWidth={1.75} /> },
  mob: { color: "var(--c-mob)", icon: <Smartphone size={20} strokeWidth={1.75} /> },
  data: { color: "var(--c-data)", icon: <Server size={20} strokeWidth={1.75} /> },
  ai: { color: "var(--c-ai)", icon: <Sparkles size={20} strokeWidth={1.75} /> },
  mkt: { color: "var(--c-mkt)", icon: <TrendingUp size={20} strokeWidth={1.75} /> },
};

/** "The stack behind your project": the tool sphere and the five category buttons. */
export default function StackSection() {
  return (
    <section
      aria-labelledby="stack-title"
      className="border-y border-line bg-bg-soft py-20 md:py-[120px]"
    >
      <Container>
        <TagSphere
          tools={tools.map((tool) => ({
            name: tool.name,
            category: tool.category,
            logo: tool.logo ? <TechLogo slug={tool.logo} /> : null,
          }))}
          categories={toolCategories.map((category) => ({
            key: category.key,
            label: category.label,
            ...CATEGORY[category.key],
          }))}
        >
          <RevealText
            as="h2"
            id="stack-title"
            text={home.stack.title}
            className="type-h2 text-ink"
          />
          <p className="mt-4 max-w-[34em] type-lead text-body">{home.stack.lead}</p>
        </TagSphere>
      </Container>
    </section>
  );
}
