import CodeTypewriter from "@/components/motion/CodeTypewriter";
import FloatingTiles, { type FloatingTile } from "@/components/motion/FloatingTiles";
import RevealText from "@/components/motion/RevealText";
import RotatingSeal from "@/components/motion/RotatingSeal";
import Container from "@/components/ui/Container";
import TechLogo from "@/components/ui/TechLogo";
import { codeSamples } from "@/content/code-samples";
import { home } from "@/content/home";

/** Language marks floating around the editor, near the prototype's positions and depths, clear of its tab bar and status bar. */
const tiles: FloatingTile[] = [
  {
    key: "typescript",
    style: { left: -34, top: -30 },
    z: 90,
    rotate: -10,
    content: <TechLogo slug="typescript" />,
  },
  {
    key: "python",
    style: { right: -26, top: 110 },
    z: 130,
    rotate: 9,
    delay: 1.4,
    content: <TechLogo slug="python" />,
  },
  {
    key: "dart",
    style: { left: -46, bottom: 90 },
    z: 70,
    rotate: 8,
    delay: 2.6,
    content: <TechLogo slug="dart" />,
  },
  {
    key: "postgresql",
    style: { right: "28%", top: -46 },
    z: 60,
    rotate: -6,
    delay: 3.3,
    content: <TechLogo slug="postgresql" />,
  },
  {
    key: "nextdotjs",
    style: { left: "30%", bottom: -62 },
    z: 100,
    rotate: 6,
    delay: 0.7,
    content: <TechLogo slug="nextdotjs" />,
  },
];

/** "Real code, in your repo, from week one": the language list and the typing editor, with floating marks and the seal. */
export default function CodeSection() {
  return (
    <section aria-labelledby="code-title" className="overflow-x-clip py-20 md:py-[120px]">
      <Container>
        <CodeTypewriter
          samples={codeSamples}
          logos={codeSamples.map((sample) => (
            <TechLogo key={sample.name} slug={sample.logo} />
          ))}
          intro={
            <>
              <RevealText
                as="h2"
                id="code-title"
                text={home.code.title}
                className="type-h2 text-ink"
              />
              <p className="mt-4 max-w-[34em] type-lead text-body">{home.code.lead}</p>
            </>
          }
          decor={
            <>
              <FloatingTiles tiles={tiles} />
              <div className="code-seal">
                <RotatingSeal id="code-seal" />
              </div>
            </>
          }
        />
      </Container>
    </section>
  );
}
