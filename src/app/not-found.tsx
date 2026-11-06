import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import TypedText from "@/components/motion/TypedText";
import ModelStill from "@/components/three/ModelStill";
import WebGLModel from "@/components/three/WebGLModel";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you asked for does not exist or has moved.",
};

/** 404: the brand cube drifting away from an empty orbit, a typed line, and the ways back. */
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="content" tabIndex={-1} className="outline-none">
        <section
          aria-labelledby="not-found-title"
          className="dots-bg border-b border-line py-16 md:py-24"
        >
          <Container className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="inline-flex rounded-full border border-line bg-card px-3.5 py-1.5 text-sm font-semibold text-accent shadow-soft">
                Error 404
              </p>
              <h1 id="not-found-title" className="mt-5 type-display text-ink">
                Page not found
              </h1>
              <p className="mt-5 type-lead text-body">
                <TypedText text="This page is not in orbit." delay={500} />
              </p>
              <p className="mt-2 max-w-[44ch] text-body">
                The page you asked for does not exist or has moved.
              </p>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Button href="/" size="lg">
                  Back to home
                </Button>
                <Button href="/services" variant="secondary" size="lg">
                  See our services
                </Button>
              </div>
            </div>
            <WebGLModel model="drifting-cube" still={<ModelStill model="drifting-cube" />} />
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
