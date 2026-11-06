import { render } from "@react-email/render";
import type { ReactElement } from "react";

// html-to-text uppercases headings by default; the copy rules require sentence case everywhere.
const keepCase = ["h1", "h2", "h3"].map((selector) => ({
  selector,
  options: { uppercase: false },
}));

/** Renders an email template to HTML and its plain-text alternative. */
export async function renderEmail(element: ReactElement): Promise<{ html: string; text: string }> {
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true, htmlToTextOptions: { selectors: keepCase } }),
  ]);
  return { html, text };
}
