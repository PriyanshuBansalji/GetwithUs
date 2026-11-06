import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Swaps the label for a spinner of the same width and disables the button. */
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonElementProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

type AnchorElementProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };

type ButtonProps = ButtonElementProps | AnchorElementProps;

const base =
  "relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border font-semibold leading-none transition-[box-shadow,background-color,border-color,color] duration-300 ease-out disabled:cursor-not-allowed disabled:shadow-none aria-disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "border-accent bg-accent text-accent-ink shadow-[0_10px_26px_var(--glow)] hover:shadow-[0_14px_40px_var(--glow),0_0_0_4px_var(--accent-soft)] disabled:border-line disabled:bg-card-2 disabled:text-muted",
  secondary:
    "border-line-2 bg-card text-ink hover:border-muted hover:shadow-[0_0_0_4px_var(--accent-soft)] disabled:text-muted",
  ghost:
    "border-transparent bg-transparent text-body hover:bg-card-2 hover:text-ink disabled:text-muted",
  /** On the dark closing band and the featured pricing card. */
  inverse:
    "border-white/25 bg-transparent text-cta-ink hover:border-white/50 hover:bg-white/10 disabled:text-cta-body",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.9375rem]",
  md: "h-12 px-6 text-base",
  lg: "h-[52px] px-[26px] text-[1.03rem]",
};

function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

/**
 * The one button: a pill. Renders a `<button>`, or a link when `href` is passed.
 * The primary button carries the accent glow, which grows on hover; the button
 * itself never moves toward the pointer.
 */
export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", loading = false, className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  const label = loading ? (
    <>
      <span className="invisible inline-flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 inline-flex items-center justify-center">
        <LoaderCircle size={16} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading</span>
      </span>
    </>
  ) : (
    children
  );

  if (props.href !== undefined) {
    const {
      href,
      variant: _v,
      size: _s,
      loading: _l,
      className: _c,
      children: _ch,
      ...rest
    } = props;
    if (isInternal(href)) {
      return (
        <Link href={href} className={classes} {...rest}>
          {label}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} {...rest}>
        {label}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    loading: _l,
    className: _c,
    children: _ch,
    type = "button",
    disabled,
    ...rest
  } = props;
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {label}
    </button>
  );
}
