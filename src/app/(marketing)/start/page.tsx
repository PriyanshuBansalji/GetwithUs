import DeferredForm from "@/components/forms/DeferredForm";
import FormPreview from "@/components/forms/FormPreview";
import PageHero from "@/components/sections/PageHero";
import ModelStill from "@/components/three/ModelStill";
import WebGLModel from "@/components/three/WebGLModel";
import Container from "@/components/ui/Container";
import { startPage } from "@/content/pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: startPage.title,
  description: startPage.description,
  path: startPage.path,
});

/**
 * /start: the brief, with a cube that gains a face for every completed step.
 * `?service=<slug>` (from the pricing cards and service pages) starts the
 * brief with that service chosen; the wizard reads it on the client, so the
 * page stays static.
 */
export default function StartPage() {
  return (
    <>
      <PageHero
        id="start-title"
        title={startPage.title}
        lead={startPage.lead}
        crumbs={[
          { name: "Home", path: "/" },
          { name: startPage.title, path: startPage.path },
        ]}
        visual={
          <WebGLModel model="assembling-cube" still={<ModelStill model="assembling-cube" />} />
        }
      />
      <section aria-label="Project brief" className="py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-[880px]">
            <DeferredForm form="brief">
              <FormPreview form="brief" />
            </DeferredForm>
          </div>
        </Container>
      </section>
    </>
  );
}
