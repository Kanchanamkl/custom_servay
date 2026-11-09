/**
 * Survey option definitions — the single source of truth for every choice
 * shown in the survey, validated on the server and labelled in the dashboard.
 *
 * If you add/remove a value here, update the matching CHECK constraint in
 * supabase/migrations as well.
 */

export type Option<V extends string = string> = {
  value: V;
  label: string;
  description?: string;
};

const opts = <const T extends readonly Option[]>(o: T) => o;

export const CATEGORIES = opts([
  { value: "casual_tops", label: "Casual Tops" },
  { value: "blouses", label: "Blouses" },
  { value: "dresses", label: "Dresses" },
] as const);
export type Category = (typeof CATEGORIES)[number]["value"];

export const COLORS = [
  { value: "black", label: "Black", hex: "#1c1a1a" },
  { value: "white", label: "White", hex: "#ffffff" },
  { value: "beige", label: "Beige", hex: "#d8c3a5" },
  { value: "burgundy", label: "Burgundy", hex: "#6b1e36" },
  { value: "sage_green", label: "Sage Green", hex: "#a3b18a" },
  { value: "dusty_pink", label: "Dusty Pink", hex: "#d9a5a5" },
  { value: "navy_blue", label: "Navy Blue", hex: "#1f2a44" },
  { value: "other", label: "Other", hex: "conic-gradient(#e76f51, #f4a261, #e9c46a, #2a9d8f, #264653, #9d4edd, #e76f51)" },
] as const;
export type ColorValue = (typeof COLORS)[number]["value"];

export const SLEEVE_STYLES = opts([
  { value: "sleeveless", label: "Sleeveless" },
  { value: "short", label: "Short" },
  { value: "puff", label: "Puff" },
  { value: "three_quarter", label: "3/4" },
  { value: "long", label: "Long" },
] as const);

export const NECKLINES = opts([
  { value: "round", label: "Round" },
  { value: "v_neck", label: "V-neck" },
  { value: "square", label: "Square" },
  { value: "collared", label: "Collared" },
  { value: "boat", label: "Boat" },
] as const);

export const TOP_LENGTHS = opts([
  { value: "cropped", label: "Cropped" },
  { value: "regular", label: "Regular" },
  { value: "longline", label: "Longline" },
] as const);

export const DRESS_LENGTHS = opts([
  { value: "mini", label: "Mini" },
  { value: "knee", label: "Knee" },
  { value: "midi", label: "Midi" },
  { value: "maxi", label: "Maxi" },
] as const);

export const LENGTHS = [...TOP_LENGTHS, ...DRESS_LENGTHS] as const;

export const FASHION_STYLES = opts([
  { value: "minimal_elegant", label: "Minimal & Elegant", description: "Clean lines, timeless pieces" },
  { value: "casual_everyday", label: "Casual & Everyday", description: "Easy, comfortable staples" },
  { value: "office_wear", label: "Office Wear", description: "Polished workday looks" },
  { value: "trendy", label: "Trendy & Fashionable", description: "Of-the-moment styles" },
  { value: "fusion", label: "Traditional / Modern Fusion", description: "Heritage meets modern" },
  { value: "other", label: "Other", description: "Something else" },
] as const);

export const FABRICS = opts([
  { value: "cotton", label: "Cotton" },
  { value: "linen", label: "Linen" },
  { value: "cotton_blend", label: "Cotton Blend" },
  { value: "satin", label: "Satin" },
  { value: "ribbed_knit", label: "Ribbed Knit" },
  { value: "polyester_blend", label: "Polyester Blend" },
  { value: "other", label: "Other" },
] as const);

export const COMFORT_PRIORITIES = opts([
  { value: "comfort", label: "Comfort" },
  { value: "quality", label: "Quality" },
  { value: "durability", label: "Durability" },
  { value: "breathability", label: "Breathability" },
  { value: "appearance", label: "Appearance" },
  { value: "affordable_price", label: "Affordable price" },
  { value: "easy_maintenance", label: "Easy maintenance" },
] as const);

export const FITS = opts([
  { value: "slim", label: "Slim Fit", description: "Close to the body" },
  { value: "regular", label: "Regular Fit", description: "Classic, easy shape" },
  { value: "relaxed", label: "Relaxed Fit", description: "A little extra room" },
  { value: "oversized", label: "Oversized", description: "Loose & roomy" },
] as const);

export const SIZES = opts([
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "xxl", label: "XXL" },
  { value: "other", label: "Other / Not sure" },
] as const);

export const PRICE_RANGES = opts([
  { value: "below_2000", label: "Below LKR 2,000" },
  { value: "2000_2500", label: "LKR 2,000 – 2,500" },
  { value: "2500_3000", label: "LKR 2,500 – 3,000" },
  { value: "3000_3500", label: "LKR 3,000 – 3,500" },
  { value: "3500_4500", label: "LKR 3,500 – 4,500" },
  { value: "above_4500", label: "Above LKR 4,500" },
] as const);

export const PURCHASE_INTENTIONS = opts([
  { value: "definitely", label: "Definitely would buy" },
  { value: "probably", label: "Probably would buy" },
  { value: "not_sure", label: "Not sure" },
  { value: "probably_not", label: "Probably would not buy" },
  { value: "definitely_not", label: "Definitely would not buy" },
] as const);

export const SHOPPING_CHANNELS = opts([
  { value: "social", label: "Instagram / Facebook" },
  { value: "online_stores", label: "Online clothing stores" },
  { value: "malls", label: "Shopping malls" },
  { value: "boutiques", label: "Local boutiques" },
  { value: "other", label: "Other" },
] as const);

export const COLLECTION_PREFERENCES = opts([
  { value: "casual_tops", label: "Casual Tops" },
  { value: "blouses", label: "Blouses" },
  { value: "dresses", label: "Dresses" },
  { value: "office_wear", label: "Office Wear" },
  { value: "oversized_shirts", label: "Oversized Shirts" },
  { value: "other", label: "Other" },
] as const);

export const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map((o) => o.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

/** Look up a human-readable label for a stored option value. */
export function labelOf(list: readonly { value: string; label: string }[], value: string | null | undefined) {
  if (!value) return "—";
  return list.find((o) => o.value === value)?.label ?? value;
}
