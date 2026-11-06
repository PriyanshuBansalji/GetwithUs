import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { serviceScenes } from "@/components/home/ServiceScenes";
import { Scene, TiltScene } from "@/components/motion/TiltScene";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SectionIntro from "@/components/ui/SectionIntro";
import { home } from "@/content/home";
import { homePage } from "@/content/pages";
import { serviceLinePages } from "@/content/services";
import { cn } from "@/lib/cn";

/** Two cards on the first row, three on the second (from 1024 px). */
const SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-2"];

/**
 * "Five things we build": one tilting card per service line, each with its
 * own small 3D scene, then the summary and highlights from the service file.
 * The agentic card links its two products.
 */
export default function ServiceCards({
  title = homePage.services.title,
  lead = home.services.lead,
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section aria-labelledby="services-title" className="py-20 md:py-[120px]">
      <Container>
        <SectionIntro id="services-title" title={title} lead={lead} />
        <ul className="mt-14 grid gap-[26px] [perspective:1600px] md:grid-cols-2 lg:grid-cols-6">
          {serviceLinePages.map((page, index) => {
            const SceneContent = serviceScenes[page.slug];
            return (
              <li
                key={page.slug}
                className={cn(SPANS[index], index === 4 && "md:col-span-2 lg:col-span-2")}
              >
                <TiltScene className="h-full">
                  <Scene>{SceneContent ? <SceneContent /> : null}</Scene>
                  <div className="tilt-scene-text px-3.5 pt-[26px]">
                    <h3 className="type-h3 text-ink">
                      <Link
                        href={page.href}
                        className="group transition-colors duration-150 ease-out hover:text-accent"
                      >
                        {/* A no-break space ties the arrow to the last word, so a wrapped title keeps it beside the text. */}
                        {page.name}
                        {" "}
                        <Icon
                          icon={ArrowRight}
                          size={20}
                          className="inline-block align-[-0.15em] text-accent transition-transform duration-200 ease-out group-hover:translate-x-1"
                        />
                      </Link>
                    </h3>
                    <p className="mt-2.5 text-body">{page.summary}</p>
                    {page.products?.length ? (
                      <p className="mt-4 flex flex-wrap gap-2">
                        {page.products.map((product) =>
                          product.href ? (
                            <Link
                              key={product.name}
                              href={product.href}
                              className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent-soft px-3 py-1.5 text-[0.84rem] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-accent hover:text-accent-ink"
                            >
                              {product.name}
                              <Icon icon={ArrowRight} size={16} />
                            </Link>
                          ) : null,
                        )}
                      </p>
                    ) : null}
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {(page.highlights ?? []).map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-line bg-bg-soft px-3 py-1.5 text-[0.84rem] font-semibold text-body"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltScene>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
