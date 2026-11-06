import PageHero from "@/components/sections/PageHero";
import ReadingProgress from "@/components/sections/ReadingProgress";
import type { ModelKey } from "@/components/three/models/keys";
import ModelStill from "@/components/three/ModelStill";
import WebGLModel from "@/components/three/WebGLModel";
import Container from "@/components/ui/Container";
import Prose from "@/components/ui/Prose";
import type { LegalDocument } from "@/content/types";
import { formatDate } from "@/lib/dates";

/**
 * A legal page: a still shield or document model beside the heading, the
 * last-updated date, a sticky table of contents on desktop, the text, and a
 * reading progress bar. No other motion on legal text.
 */
export default function LegalDocumentView({
  document,
  path,
  model,
}: {
  document: LegalDocument;
  path: string;
  model: ModelKey;
}) {
  return (
    <>
      <ReadingProgress targetId="legal-text" />
      <PageHero
        id="legal-title"
        title={document.title}
        crumbs={[
          { name: "Home", path: "/" },
          { name: document.title, path },
        ]}
        lead={
          <>
            Last updated <time dateTime={document.updated}>{formatDate(document.updated)}</time>
          </>
        }
        visual={
          <WebGLModel
            model={model}
            still={<ModelStill model={model} />}
            className="w-full max-w-[460px] justify-self-center lg:justify-self-end"
          />
        }
      />
      <section aria-label="Full text" className="py-16 md:py-20">
        <Container className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <nav
            aria-labelledby="legal-contents"
            className="rounded-card border border-line bg-bg-soft p-5 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start"
          >
            <h2 id="legal-contents" className="text-sm font-bold text-ink">
              Contents
            </h2>
            <ol className="mt-3 grid gap-2 type-small sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1">
              {document.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="link-draw text-body transition-colors duration-150 ease-out hover:text-ink"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div id="legal-text">
            <Prose>
              {document.sections.map((section) => (
                <section key={section.id} aria-labelledby={section.id}>
                  <h2 id={section.id}>{section.title}</h2>
                  {section.blocks.map((block, index) =>
                    block.type === "p" ? (
                      <p key={index}>{block.text}</p>
                    ) : (
                      <ul key={index}>
                        {block.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ),
                  )}
                </section>
              ))}
            </Prose>
          </div>
        </Container>
      </section>
    </>
  );
}
