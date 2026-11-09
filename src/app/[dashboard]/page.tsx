import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDashboardSlug } from "@/config/admin";
import { listDesigns } from "@/lib/data/designs";
import { listResponses } from "@/lib/data/responses";
import { computeAnalytics } from "@/lib/analytics";
import { AdminPanelClient } from "@/components/admin/admin-panel-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Survey Analytics",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SecretDashboardPage({
  params,
}: {
  params: Promise<{ dashboard: string }>;
}) {
  const { dashboard } = await params;
  const configuredSlug = getDashboardSlug();

  // If this doesn't match the configured secret slug, return 404
  if (!configuredSlug || dashboard !== configuredSlug) {
    notFound();
  }

  const designs = await listDesigns();
  const responses = await listResponses();
  const analytics = computeAnalytics(responses);

  return (
    <AdminPanelClient
      isAuthenticated={true}
      analytics={analytics}
      responses={responses}
      designs={designs}
      exportToken={configuredSlug}
    />
  );
}

