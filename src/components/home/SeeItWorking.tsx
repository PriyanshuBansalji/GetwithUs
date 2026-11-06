import DemoTabs, { type DemoTab } from "@/components/home/DemoTabs";
import Container from "@/components/ui/Container";
import SectionIntro from "@/components/ui/SectionIntro";
import { isFilled } from "@/config/site";
import { home } from "@/content/home";
import { findServicePage } from "@/content/services";

/** The first three deliverables of a product page that carry no owner placeholder. */
function points(slug: string): string[] {
  return (findServicePage(slug)?.whatYouGet ?? []).filter(isFilled).slice(0, 3);
}

const tabs: DemoTab[] = [
  {
    value: "whatsapp",
    label: home.demos.whatsapp.tab,
    title: home.demos.whatsapp.title,
    points: points("whatsapp-bot"),
    link: home.demos.whatsapp.link,
  },
  {
    value: "calling",
    label: home.demos.calling.tab,
    title: home.demos.calling.title,
    points: points("calling-agent"),
    link: home.demos.calling.link,
  },
];

/** "See it working": the two agent demos behind a tab switch. */
export default function SeeItWorking() {
  return (
    <section
      aria-labelledby="demos-title"
      className="border-y border-line bg-bg-soft py-20 md:py-[120px]"
    >
      <Container>
        <SectionIntro id="demos-title" title={home.demos.title} lead={home.demos.lead} />
        <DemoTabs tabs={tabs} />
      </Container>
    </section>
  );
}
