import LegalDocumentView from "@/components/sections/LegalDocumentView";
import { termsOfService } from "@/content/legal/terms";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: termsOfService.title,
  description: termsOfService.description,
  path: "/terms",
});

export default function TermsPage() {
  return <LegalDocumentView document={termsOfService} path="/terms" model="legal-document" />;
}
