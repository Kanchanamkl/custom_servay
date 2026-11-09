import { listDesigns } from "@/lib/data/designs";
import { SurveyHomeClient } from "@/components/survey/survey-home-client";
import type { PublicDesign } from "@/components/survey/types";

export const dynamic = "force-dynamic";

export default async function SurveyPage() {
  const all = await listDesigns({ activeOnly: true });

  const publicDesigns: PublicDesign[] = all.map((d) => ({
    id: d.id,
    design_name: d.design_name,
    description: d.description,
    category: d.category,
    image_url: d.image_url,
    estimated_price_min: d.estimated_price_min,
    estimated_price_max: d.estimated_price_max,
  }));

  return <SurveyHomeClient designs={publicDesigns} />;
}
