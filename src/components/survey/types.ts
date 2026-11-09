import type { ClothingDesign } from "@/lib/data/types";
import type { FieldErrors } from "@/lib/survey/schema";

/** Design fields that are safe to send to the public survey page. */
export type PublicDesign = Pick<
  ClothingDesign,
  "id" | "design_name" | "description" | "category" | "image_url" | "estimated_price_min" | "estimated_price_max"
>;

export type DesignSelection = {
  design_id: string;
  is_favorite: boolean;
  colors: string[];
  other_color: string;
  customization: { sleeve?: string; neckline?: string; length?: string };
};

export type SurveyState = {
  submission_id: string;
  designs: DesignSelection[];
  fashion_styles: string[];
  fabric_preferences: string[];
  comfort_preferences: string[];
  preferred_fit: string | null;
  clothing_size: string | null;
  price_range: string | null;
  purchase_intention: string | null;
  shopping_channels: string[];
  collection_preferences: string[];
  other_details: { fashion_styles?: string; fabrics?: string; shopping_channels?: string; collection?: string };
  feedback: string;
  full_name: string;
  mobile_number: string;
  launch_updates_consent: boolean | null;
};

export type UpdateState = (patch: Partial<SurveyState> | ((s: SurveyState) => Partial<SurveyState>)) => void;

export type StepProps = {
  state: SurveyState;
  update: UpdateState;
  errors: FieldErrors;
  designs: PublicDesign[];
};

/** RFC4122 v4 UUID that also works on plain-http LAN addresses (no crypto.randomUUID). */
export function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      /* insecure context — fall through */
    }
  }
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function initialSurveyState(): SurveyState {
  return {
    submission_id: uuid(),
    designs: [],
    fashion_styles: [],
    fabric_preferences: [],
    comfort_preferences: [],
    preferred_fit: null,
    clothing_size: null,
    price_range: null,
    purchase_intention: null,
    shopping_channels: [],
    collection_preferences: [],
    other_details: {},
    feedback: "",
    full_name: "",
    mobile_number: "",
    launch_updates_consent: null,
  };
}

/** Converts UI state into the payload validated by `surveySchema`. */
export function toPayload(s: SurveyState) {
  const trimOrUndef = (v?: string) => (v && v.trim() ? v.trim() : undefined);
  return {
    ...s,
    designs: s.designs.map((d) => ({
      design_id: d.design_id,
      is_favorite: d.is_favorite,
      colors: d.colors,
      other_color: d.colors.includes("other") ? trimOrUndef(d.other_color) : undefined,
      customization: Object.fromEntries(Object.entries(d.customization).filter(([, v]) => !!v)),
    })),
    other_details: {
      fashion_styles: s.fashion_styles.includes("other") ? trimOrUndef(s.other_details.fashion_styles) : undefined,
      fabrics: s.fabric_preferences.includes("other") ? trimOrUndef(s.other_details.fabrics) : undefined,
      shopping_channels: s.shopping_channels.includes("other")
        ? trimOrUndef(s.other_details.shopping_channels)
        : undefined,
      collection: s.collection_preferences.includes("other") ? trimOrUndef(s.other_details.collection) : undefined,
    },
  };
}

