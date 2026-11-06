import type { JsonLdData } from "@/lib/json-ld";

/**
 * Structured data for search engines. The one sanctioned use of
 * dangerouslySetInnerHTML: the content is JSON built from typed objects, with
 * `<` escaped so it cannot close the script element.
 */
export default function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
