import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import LeadDetail from "@/components/admin/LeadDetail";
import { leadWithTimeline } from "@/features/leads/service";
import { requireAdmin } from "@/features/admin/auth";

export const instant = false;

export const metadata: Metadata = { title: "Lead" };

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  await requireAdmin(`/admin/leads/${id}`);
  if (!z.uuid().safeParse(id).success) notFound();
  const result = await leadWithTimeline(id);
  if (!result.ok) throw result.error;
  if (!result.data) notFound();
  return <LeadDetail {...result.data} now={new Date()} />;
}
