import { ArrowRight } from "lucide-react";
import Link from "next/link";
import TiltCard from "@/components/motion/TiltCard";
import CaseStudyCard from "@/components/sections/CaseStudyCard";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SectionIntro from "@/components/ui/SectionIntro";
import { homePage } from "@/content/pages";
import { getPublishedCaseStudies } from "@/features/case-studies/getPublishedCaseStudies";

/** Up to three published case studies as tilting cards. Renders nothing at all while there are none. */
export default function SelectedWork() {
  const studies = getPublishedCaseStudies().slice(0, 3);
  if (studies.length === 0) return null;

  return (
    <section aria-labelledby="selected-work-title" className="py-20 md:py-[120px]">
      <Container>
        <SectionIntro id="selected-work-title" title={homePage.work.title} />
        <ul className="mt-14 grid gap-6 [perspective:1400px] md:grid-cols-3">
          {studies.map((study) => (
            <li key={study.slug}>
              <TiltCard maxDeg={6} className="h-full rounded-card">
                <CaseStudyCard study={study} />
              </TiltCard>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center">
          <Link
            href={homePage.work.link.href}
            className="group inline-flex items-center gap-1.5 font-semibold text-accent"
          >
            {homePage.work.link.label}
            <Icon
              icon={ArrowRight}
              size={16}
              className="transition-transform duration-150 ease-out group-hover:translate-x-0.5"
            />
          </Link>
        </p>
      </Container>
    </section>
  );
}
