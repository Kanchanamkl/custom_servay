import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { listDesigns } from "@/lib/data/designs";
import { listResponses } from "@/lib/data/responses";
import { computeAnalytics } from "@/lib/analytics";
import { AdminPanelClient } from "@/components/admin/admin-panel-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel · Market Research",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPannelPage() {
  const isAuth = await isAdminAuthenticated();
  const designs = await listDesigns();
  const responses = await listResponses();
  const analytics = computeAnalytics(responses);

  return (
    <AdminPanelClient
      isAuthenticated={isAuth}
      analytics={analytics}
      responses={responses}
      designs={designs}
    />
  );
}

