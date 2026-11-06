/**
 * Small inline SVG brand icons for social platforms.
 * These are not available in lucide-react; they are hand-written from the
 * official brand guidelines and kept minimal (single-path fills only).
 * Each accepts a className and aria-hidden (always true - labelling is on the
 * wrapping anchor).
 */

type IconProps = { className?: string };

/** LinkedIn "in" logo - official shape simplified to a single path. */
export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z" />
    </svg>
  );
}

/** Instagram camera mark - simplified geometric version. */
export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163Zm0 1.837c-3.15 0-3.503.011-4.755.069-1.17.053-1.805.249-2.228.413a3.714 3.714 0 0 0-1.38.898 3.714 3.714 0 0 0-.898 1.38c-.164.423-.36 1.058-.413 2.228C2.174 8.997 2.163 9.35 2.163 12s.011 3.503.069 4.755c.053 1.17.249 1.805.413 2.228.189.487.454.9.898 1.38.48.444.893.709 1.38.898.423.164 1.058.36 2.228.413C8.497 21.826 8.85 21.837 12 21.837s3.503-.011 4.755-.069c1.17-.053 1.805-.249 2.228-.413a3.714 3.714 0 0 0 1.38-.898 3.714 3.714 0 0 0 .898-1.38c.164-.423.36-1.058.413-2.228.058-1.252.069-1.605.069-4.755s-.011-3.503-.069-4.755c-.053-1.17-.249-1.805-.413-2.228a3.714 3.714 0 0 0-.898-1.38 3.714 3.714 0 0 0-1.38-.898c-.423-.164-1.058-.36-2.228-.413C15.503 4.011 15.15 4 12 4Zm0 3.838a4.162 4.162 0 1 1 0 8.324 4.162 4.162 0 0 1 0-8.324Zm0 1.838a2.324 2.324 0 1 0 0 4.648 2.324 2.324 0 0 0 0-4.648Zm4.406-3.274a.972.972 0 1 1 0 1.944.972.972 0 0 1 0-1.944Z" />
    </svg>
  );
}

/** Globe / website icon - from the existing lucide shape for consistency. */
export function GlobeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20A14.5 14.5 0 0 0 12 2" />
      <path d="M2 12h20" />
    </svg>
  );
}
