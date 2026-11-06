import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type IconProps = {
  icon: LucideIcon;
  size?: 16 | 20 | 24;
  className?: string;
  /** Set only when the icon carries meaning without a visible label. */
  label?: string;
};

/** Thin wrapper over lucide with the project's fixed stroke width and size steps. */
export default function Icon({ icon: Glyph, size = 16, className, label }: IconProps) {
  return (
    <Glyph
      size={size}
      strokeWidth={1.75}
      className={cn("shrink-0", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      focusable="false"
    />
  );
}
