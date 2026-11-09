import type { SurveyResponse } from "@/lib/data/types";
import {
  CATEGORIES,
  COLORS,
  COMFORT_PRIORITIES,
  FABRICS,
  FASHION_STYLES,
  PRICE_RANGES,
  PURCHASE_INTENTIONS,
  SIZES,
  labelOf,
} from "@/lib/survey/options";

export type MetricCount = {
  key: string;
  label: string;
  count: number;
  percentage: number;
  color?: string;
};

export type DesignPopularity = {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  totalSelections: number;
  favorites: number;
  percentage: number;
};

export type SurveyAnalytics = {
  totalResponses: number;
  kpis: {
    mostPopularDesign: string;
    mostPopularCategory: string;
    mostPreferredColor: string;
    mostPopularPriceRange: string;
    mostPreferredSize: string;
    highIntentRate: number; // percentage with definitely or probably
    // optInRate: number; // percentage opted in for launch updates
  };
  designPopularity: DesignPopularity[];
  categoryBreakdown: MetricCount[];
  colorBreakdown: MetricCount[];
  priceRangeBreakdown: MetricCount[];
  purchaseIntentionBreakdown: MetricCount[];
  fashionStylesBreakdown: MetricCount[];
  fabricsBreakdown: MetricCount[];
  comfortPrioritiesBreakdown: MetricCount[];
  sizeBreakdown: MetricCount[];
};

export function computeAnalytics(responses: SurveyResponse[]): SurveyAnalytics {
  const total = responses.length;

  if (total === 0) {
    return {
      totalResponses: 0,
      kpis: {
        mostPopularDesign: "—",
        mostPopularCategory: "—",
        mostPreferredColor: "—",
        mostPopularPriceRange: "—",
        mostPreferredSize: "—",
        highIntentRate: 0,
        // optInRate: 0,
      },
      designPopularity: [],
      categoryBreakdown: [],
      colorBreakdown: [],
      priceRangeBreakdown: [],
      purchaseIntentionBreakdown: [],
      fashionStylesBreakdown: [],
      fabricsBreakdown: [],
      comfortPrioritiesBreakdown: [],
      sizeBreakdown: [],
    };
  }

  // 1. Designs & categories
  const designMap = new Map<string, { name: string; category: string; count: number; favorites: number }>();
  const catCountMap = new Map<string, number>();

  for (const r of responses) {
    for (const d of r.selected_designs) {
      const cur = designMap.get(d.clothing_design_id) ?? {
        name: d.design_name,
        category: d.category,
        count: 0,
        favorites: 0,
      };
      cur.count += 1;
      if (d.is_favorite) cur.favorites += 1;
      designMap.set(d.clothing_design_id, cur);

      catCountMap.set(d.category, (catCountMap.get(d.category) ?? 0) + 1);
    }
  }

  const designPopularity: DesignPopularity[] = Array.from(designMap.entries())
    .map(([id, data]) => ({
      id,
      name: data.name,
      category: data.category,
      categoryLabel: labelOf(CATEGORIES, data.category),
      totalSelections: data.count,
      favorites: data.favorites,
      percentage: Math.round((data.count / total) * 100),
    }))
    .sort((a, b) => b.totalSelections - a.totalSelections || b.favorites - a.favorites);

  // 2. Category breakdown
  const categoryBreakdown: MetricCount[] = CATEGORIES.map((c) => {
    const count = catCountMap.get(c.value) ?? 0;
    return {
      key: c.value,
      label: c.label,
      count,
      percentage: Math.round((count / Math.max(1, total)) * 100),
    };
  }).sort((a, b) => b.count - a.count);

  // 3. Colors
  const colorCountMap = new Map<string, number>();
  for (const r of responses) {
    for (const d of r.selected_designs) {
      for (const c of d.preferred_colors) {
        colorCountMap.set(c, (colorCountMap.get(c) ?? 0) + 1);
      }
    }
  }
  const colorBreakdown: MetricCount[] = COLORS.map((c) => {
    const count = colorCountMap.get(c.value) ?? 0;
    return {
      key: c.value,
      label: c.label,
      count,
      percentage: Math.round((count / Math.max(1, total)) * 100),
      color: c.value === "white" ? "#eaeaea" : c.value === "other" ? "#a8566d" : c.hex,
    };
  }).sort((a, b) => b.count - a.count);

  // 4. Price range
  const priceCountMap = new Map<string, number>();
  for (const r of responses) {
    if (r.price_range) {
      priceCountMap.set(r.price_range, (priceCountMap.get(r.price_range) ?? 0) + 1);
    }
  }
  const priceRangeBreakdown: MetricCount[] = PRICE_RANGES.map((p) => {
    const count = priceCountMap.get(p.value) ?? 0;
    return {
      key: p.value,
      label: p.label,
      count,
      percentage: Math.round((count / total) * 100),
    };
  });

  // 5. Purchase intention
  const intentCountMap = new Map<string, number>();
  for (const r of responses) {
    if (r.purchase_intention) {
      intentCountMap.set(r.purchase_intention, (intentCountMap.get(r.purchase_intention) ?? 0) + 1);
    }
  }
  const purchaseIntentionBreakdown: MetricCount[] = PURCHASE_INTENTIONS.map((pi) => {
    const count = intentCountMap.get(pi.value) ?? 0;
    return {
      key: pi.value,
      label: pi.label,
      count,
      percentage: Math.round((count / total) * 100),
    };
  });

  // 6. Fashion styles
  const styleCountMap = new Map<string, number>();
  for (const r of responses) {
    for (const s of r.fashion_styles) {
      styleCountMap.set(s, (styleCountMap.get(s) ?? 0) + 1);
    }
  }
  const fashionStylesBreakdown: MetricCount[] = FASHION_STYLES.map((fs) => {
    const count = styleCountMap.get(fs.value) ?? 0;
    return {
      key: fs.value,
      label: fs.label,
      count,
      percentage: Math.round((count / total) * 100),
    };
  }).sort((a, b) => b.count - a.count);

  // 7. Fabrics
  const fabricCountMap = new Map<string, number>();
  for (const r of responses) {
    for (const f of r.fabric_preferences) {
      fabricCountMap.set(f, (fabricCountMap.get(f) ?? 0) + 1);
    }
  }
  const fabricsBreakdown: MetricCount[] = FABRICS.map((f) => {
    const count = fabricCountMap.get(f.value) ?? 0;
    return {
      key: f.value,
      label: f.label,
      count,
      percentage: Math.round((count / total) * 100),
    };
  }).sort((a, b) => b.count - a.count);

  // 8. Comfort priorities
  const comfortCountMap = new Map<string, number>();
  for (const r of responses) {
    for (const c of r.comfort_preferences) {
      comfortCountMap.set(c, (comfortCountMap.get(c) ?? 0) + 1);
    }
  }
  const comfortPrioritiesBreakdown: MetricCount[] = COMFORT_PRIORITIES.map((cp) => {
    const count = comfortCountMap.get(cp.value) ?? 0;
    return {
      key: cp.value,
      label: cp.label,
      count,
      percentage: Math.round((count / total) * 100),
    };
  }).sort((a, b) => b.count - a.count);

  // 9. Sizes
  const sizeCountMap = new Map<string, number>();
  for (const r of responses) {
    if (r.clothing_size) {
      sizeCountMap.set(r.clothing_size, (sizeCountMap.get(r.clothing_size) ?? 0) + 1);
    }
  }
  const sizeBreakdown: MetricCount[] = SIZES.map((sz) => {
    const count = sizeCountMap.get(sz.value) ?? 0;
    return {
      key: sz.value,
      label: sz.label,
      count,
      percentage: Math.round((count / total) * 100),
    };
  });

  // KPI Calculations
  const highIntentCount =
    (intentCountMap.get("definitely") ?? 0) + (intentCountMap.get("probably") ?? 0);
  const highIntentRate = Math.round((highIntentCount / total) * 100);

  // const optInCount = responses.filter((r) => r.launch_updates_consent).length;
  // const optInRate = Math.round((optInCount / total) * 100);

  const topDesign = designPopularity[0]?.name ?? "—";
  const topCategory = categoryBreakdown[0]?.label ?? "—";
  const topColor = colorBreakdown[0]?.label ?? "—";
  const topPriceRange = [...priceRangeBreakdown].sort((a, b) => b.count - a.count)[0]?.label ?? "—";
  const topSize = [...sizeBreakdown].sort((a, b) => b.count - a.count)[0]?.label ?? "—";

  return {
    totalResponses: total,
    kpis: {
      mostPopularDesign: topDesign,
      mostPopularCategory: topCategory,
      mostPreferredColor: topColor,
      mostPopularPriceRange: topPriceRange,
      mostPreferredSize: topSize,
      highIntentRate
      // optInRate,
    },
    designPopularity,
    categoryBreakdown,
    colorBreakdown,
    priceRangeBreakdown,
    purchaseIntentionBreakdown,
    fashionStylesBreakdown,
    fabricsBreakdown,
    comfortPrioritiesBreakdown,
    sizeBreakdown,
  };
}

