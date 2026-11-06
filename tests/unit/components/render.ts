import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

/** Server-renders a component to HTML for structural assertions. */
export function render(element: ReactElement): string {
  return renderToStaticMarkup(element);
}
