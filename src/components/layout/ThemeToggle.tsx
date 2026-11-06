"use client";

import { Moon, Sun } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";
import { applyTheme, type Theme } from "@/lib/theme";

/** The header's theme switch: a sun in the dark theme, a moon in the light one, labelled with what it switches to. */
export default function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full border border-line-2 bg-card text-ink transition-colors duration-200 hover:border-accent hover:text-accent",
        className,
      )}
    >
      <Icon icon={theme === "dark" ? Sun : Moon} size={20} />
    </button>
  );
}
