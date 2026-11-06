/** The first focusable element on every page. Visible only when focused. */
export default function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only rounded-control bg-accent px-3.5 py-2.5 type-button text-accent-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]"
    >
      Skip to content
    </a>
  );
}
