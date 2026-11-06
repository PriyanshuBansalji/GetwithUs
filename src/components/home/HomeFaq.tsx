import Accordion from "@/components/ui/Accordion";
import Container from "@/components/ui/Container";
import SectionIntro from "@/components/ui/SectionIntro";
import { homeFaqs } from "@/content/faqs";
import { home } from "@/content/home";

/** "Questions people ask first": the general questions as an accordion. */
export default function HomeFaq() {
  return (
    <section
      aria-labelledby="faq-title"
      className="border-y border-line bg-bg-soft py-20 md:py-[120px]"
    >
      <Container className="max-w-[880px]">
        <SectionIntro id="faq-title" title={home.faq.title} />
        <Accordion
          className="mt-12"
          items={homeFaqs.map((faq, index) => ({
            id: `faq-${index}`,
            question: faq.question,
            answer: faq.answer,
          }))}
        />
      </Container>
    </section>
  );
}
