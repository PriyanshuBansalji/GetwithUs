import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ToolChip from "@/components/home/ToolChip";
import JsonLd from "@/components/layout/JsonLd";
import RevealText from "@/components/motion/RevealText";
import ClosingCta from "@/components/sections/ClosingCta";
import PageHero from "@/components/sections/PageHero";
import ModelStill from "@/components/three/ModelStill";
import WebGLModel from "@/components/three/WebGLModel";
import Container from "@/components/ui/Container";
import { workPage } from "@/content/pages";
import { serviceName } from "@/content/services/catalog";
import { toolsIn } from "@/content/tools";
import {
  caseStudyParams,
  findPublishedCaseStudy,
} from "@/features/case-studies/getPublishedCaseStudies";
import { clientLabel } from "@/features/case-studies/labels";
import { formatDate } from "@/lib/dates";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export function generateStaticParams() {
  return caseStudyParams();
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const study = findPublishedCaseStudy((await params).slug);
  if (!study) return {};
  return pageMetadata({
    title: study.title,
    description: study.summary,
    path: `/work/${study.slug}`,
    ownImage: true,
  });
}

/** A case study: the project's screenshot on a 3D device frame, its facts, problem, work, and outcome, its stack, and metrics only when approved. */
export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const study = findPublishedCaseStudy((await params).slug);
  if (!study) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: workPage.title, path: workPage.path },
    { name: study.title, path: `/work/${study.slug}` },
  ];
  const sections = [
    { id: "problem", title: "The problem", text: study.problem },
    { id: "work", title: "The work", text: study.work },
    { id: "outcome", title: "The outcome", text: study.outcome },
  ];
  const facts = [
    { term: "Client", value: clientLabel(study) },
    { term: "Industry", value: study.industry },
    { term: "Services", value: study.services.map(serviceName).join(", ") },
  ];
  const phone = study.services.includes("app-development");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        id="study-title"
        title={study.title}
        lead={study.summary}
        crumbs={crumbs}
        visual={
          <WebGLModel
            model="device-frame"
            modelProps={{ image: study.images[0]?.src, kind: phone ? "phone" : "browser" }}
            still={<ModelStill model="device-frame" />}
          />
        }
      >
        <dl className="mt-8 grid gap-3 rounded-card border border-line bg-card p-5 text-[0.9375rem] shadow-soft">
          {facts.map((row) => (
            <div key={row.term} className="grid grid-cols-[96px_1fr] gap-3">
              <dt className="font-semibold text-muted">{row.term}</dt>
              <dd className="text-ink">{row.value}</dd>
            </div>
          ))}
          <div className="grid grid-cols-[96px_1fr] gap-3">
            <dt className="font-semibold text-muted">Date</dt>
            <dd className="text-ink">
              <time dateTime={study.date}>{formatDate(study.date)}</time>
            </dd>
          </div>
        </dl>
      </PageHero>
      <article aria-labelledby="study-title" className="py-20 md:py-24">
        <Container className="max-w-[860px]">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id} className="mb-14">
              <RevealText
                as="h2"
                id={section.id}
                text={section.title}
                className="type-h2 text-ink"
              />
              <p className="mt-5 type-lead text-body">{section.text}</p>
            </section>
          ))}
          {study.metricsApproved && study.metrics.length > 0 ? (
            <section aria-labelledby="results" className="mb-14">
              <h2 id="results" className="type-h2 text-ink">
                Results
              </h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {study.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-card border border-line bg-card p-6 shadow-soft"
                  >
                    <dt className="text-body">{metric.label}</dt>
                    <dd className="mt-1 font-display text-3xl font-extrabold text-ink">
                      {metric.value}
                    </dd>
                    <dd className="mt-1 type-small text-muted">Source: {metric.source}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          {study.stack.length > 0 ? (
            <section aria-labelledby="stack" className="mb-14">
              <h2 id="stack" className="type-h2 text-ink">
                Stack
              </h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {study.stack.map((item) => (
                  <li key={item}>
                    <ToolChip name={item} logo={toolsIn(item)[0]?.logo ?? null} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {study.images.map((image) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 860px) 860px, 100vw"
              className="mt-8 rounded-card border border-line shadow-soft"
            />
          ))}
        </Container>
      </article>
      <ClosingCta />
    </>
  );
}
