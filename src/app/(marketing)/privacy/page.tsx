import LegalDocumentView from "@/components/sections/LegalDocumentView";
import { privacyPolicy } from "@/content/legal/privacy";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalDocumentView document={privacyPolicy} path="/privacy" model="shield" />;
}
