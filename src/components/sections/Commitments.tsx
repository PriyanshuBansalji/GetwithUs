import { FileCheck, KeyRound, LockOpen, MonitorPlay } from "lucide-react";
import TiltCard from "@/components/motion/TiltCard";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SectionIntro from "@/components/ui/SectionIntro";
import { commitments } from "@/content/commitments";
import { home } from "@/content/home";
import { homePage } from "@/content/pages";

const ICONS = [FileCheck, KeyRound, MonitorPlay, LockOpen];

/**
 * "What you can hold us to": four tilting cards, each with an icon, a large
 * outlined number standing 30 px forward of the card, and the commitment; the
 * second sentence opens on hover or keyboard focus, and is always open on
 * touch screens. Each card takes focus so keyboard users can open it too.
 */
export default function Commitments() {
  return (
    <section aria-labelledby="commitments-title" className="py-20 md:py-[120px]">
      <Container>
        <SectionIntro
          id="commitments-title"
          title={homePage.commitments.title}
          lead={home.commitments.lead}
        />
        <ul className="mt-14 grid gap-6 [perspective:1400px] sm:grid-cols-2">
          {commitments.map((commitment, position) => {
            const CommitIcon = ICONS[position] ?? FileCheck;
            return (
              <li key={commitment.text}>
                <TiltCard
                  maxDeg={6}
                  className="h-full rounded-card border border-line bg-card shadow-soft transition-shadow duration-300 hover:shadow-lift"
                >
                  {/* Focusable so keyboard users can open the detail the way a pointer does on hover;
                      a named group so the stop is announced as this commitment, not an unnamed box. */}
                  <div
                    tabIndex={0}
                    role="group"
                    aria-labelledby={`commitment-${position}`}
                    className="commit-card relative h-full rounded-card px-8 pt-8 pb-9 outline-offset-4"
                  >
                    <span
                      aria-hidden="true"
                      className="commit-ghost pointer-events-none absolute top-4 right-6 font-display text-[96px] leading-none font-extrabold tracking-[-0.06em] text-transparent select-none"
                    >
                      {String(position + 1).padStart(2, "0")}
                    </span>
                    <span className="grid size-12 [transform:translateZ(20px)] place-items-center rounded-[14px] bg-accent-soft text-accent">
                      <Icon icon={CommitIcon} size={24} />
                    </span>
                    <p
                      id={`commitment-${position}`}
                      className="relative mt-5 max-w-[30ch] [transform:translateZ(20px)] type-lead font-semibold text-ink"
                    >
                      {commitment.text}
                    </p>
                    <div className="commit-more">
                      <p className="min-h-0 overflow-hidden pt-2.5 text-body">
                        {commitment.expanded}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
