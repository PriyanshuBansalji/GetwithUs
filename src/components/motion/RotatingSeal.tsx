import OnScreen from "@/components/motion/OnScreen";
import { LogoMark } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

/**
 * A round seal whose text turns slowly on a circular path around the brand mark.
 * Decorative; the same promise is written in the page copy. Still under
 * reduced motion and while off screen.
 */
export default function RotatingSeal({
  text = "shipped weekly · you own the code · ",
  id = "seal-path",
  className,
}: {
  text?: string;
  id?: string;
  className?: string;
}) {
  return (
    <OnScreen aria-hidden className={cn("rotating-seal", className)}>
      <svg viewBox="0 0 130 130" className="rotating-seal-text" focusable="false">
        <defs>
          <path id={id} d="M65,65 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
        </defs>
        <text>
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <span className="rotating-seal-core">
        <LogoMark />
      </span>
    </OnScreen>
  );
}
