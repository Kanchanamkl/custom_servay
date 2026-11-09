import type { SurveyResponse } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format";
import {
  labelOf,
  PRICE_RANGES,
  PURCHASE_INTENTIONS,
  SIZES,
  FITS,
  FASHION_STYLES,
  FABRICS,
  COMFORT_PRIORITIES,
  SHOPPING_CHANNELS,
  COLLECTION_PREFERENCES,
} from "@/lib/survey/options";

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export function generateResponsesCsv(responses: SurveyResponse[]): string {
  const headers = [
    "Response ID",
    "Submitted At (Asia/Colombo)",
    "Full Name",
    "Mobile Number",
    "Selected Designs",
    "Favorite Designs",
    "Preferred Colors Per Design",
    "Price Range",
    "Purchase Intention",
    "Preferred Fit",
    "Usual Size",
    "Fashion Styles",
    "Fabrics",
    "Comfort Priorities",
    "Shopping Channels",
    "Collection Wishlist",
    "Feedback / Suggestions",
    "Opted In For Launch Updates",
  ];

  const rows = responses.map((r) => {
    const designsList = r.selected_designs.map((d) => d.design_name).join("; ");
    const favList = r.selected_designs
      .filter((d) => d.is_favorite)
      .map((d) => d.design_name)
      .join("; ");
    const colorsList = r.selected_designs
      .map((d) => `${d.design_name}: [${d.preferred_colors.join(", ")}${d.other_color ? ` (${d.other_color})` : ""}]`)
      .join("; ");

    return [
      escapeCsv(r.id),
      escapeCsv(formatDateTime(r.created_at)),
      escapeCsv(r.full_name),
      escapeCsv(r.mobile_number),
      escapeCsv(designsList),
      escapeCsv(favList),
      escapeCsv(colorsList),
      escapeCsv(labelOf(PRICE_RANGES, r.price_range)),
      escapeCsv(labelOf(PURCHASE_INTENTIONS, r.purchase_intention)),
      escapeCsv(labelOf(FITS, r.preferred_fit)),
      escapeCsv(labelOf(SIZES, r.clothing_size)),
      escapeCsv(r.fashion_styles.map((s) => labelOf(FASHION_STYLES, s)).join("; ")),
      escapeCsv(r.fabric_preferences.map((f) => labelOf(FABRICS, f)).join("; ")),
      escapeCsv(r.comfort_preferences.map((c) => labelOf(COMFORT_PRIORITIES, c)).join("; ")),
      escapeCsv(r.shopping_channels.map((sc) => labelOf(SHOPPING_CHANNELS, sc)).join("; ")),
      escapeCsv(r.collection_preferences.map((cp) => labelOf(COLLECTION_PREFERENCES, cp)).join("; ")),
      escapeCsv(r.feedback || ""),
      escapeCsv(r.launch_updates_consent ? "Yes" : "No"),
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}

