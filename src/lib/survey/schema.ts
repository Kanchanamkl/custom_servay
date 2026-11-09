import { z } from "zod";
import {
  COLLECTION_PREFERENCES,
  COLORS,
  COMFORT_PRIORITIES,
  FABRICS,
  FASHION_STYLES,
  FITS,
  LENGTHS,
  NECKLINES,
  PRICE_RANGES,
  PURCHASE_INTENTIONS,
  SHOPPING_CHANNELS,
  SIZES,
  SLEEVE_STYLES,
  values,
} from "./options";

/** Accepts 07XXXXXXXX, 7XXXXXXXX, 947XXXXXXXX, +947XXXXXXXX (spaces/dashes allowed). */
export function normalizeMobile(input: string): string | null {
  const compact = input.replace(/[\s\-().]/g, "");
  const match = compact.match(/^(?:\+94|0094|94|0)?(7\d{8})$/);
  return match ? `+94${match[1]}` : null;
}

const otherText = z.string().trim().max(120).optional();

export const selectedDesignSchema = z.object({
  design_id: z.string().min(1).max(64),
  is_favorite: z.boolean(),
  colors: z
    .array(z.enum(values(COLORS)))
    .min(1, { error: "Pick at least one colour" })
    .max(COLORS.length),
  other_color: z.string().trim().max(60).optional(),
  customization: z
    .object({
      sleeve: z.enum(values(SLEEVE_STYLES)).optional(),
      neckline: z.enum(values(NECKLINES)).optional(),
      length: z.enum(values(LENGTHS)).optional(),
    })
    .default({}),
});

export const surveySchema = z.object({
  submission_id: z.uuid(),
  designs: z
    .array(selectedDesignSchema)
    .min(1, { error: "Please select at least one design" })
    .max(30),
  // Fashion styles (optional / commented out in survey)
  fashion_styles: z.array(z.enum(values(FASHION_STYLES))).default([]),
  fabric_preferences: z.array(z.enum(values(FABRICS))).default([]),
  comfort_preferences: z.array(z.enum(values(COMFORT_PRIORITIES))).default([]),
  preferred_fit: z.enum(values(FITS)).nullable().default(null),
  clothing_size: z.enum(values(SIZES)).nullable().default(null),
  // Price range & purchase intention (optional / commented out in survey)
  price_range: z.enum(values(PRICE_RANGES)).nullable().optional().default(null),
  purchase_intention: z.enum(values(PURCHASE_INTENTIONS)).nullable().optional().default(null),
  shopping_channels: z.array(z.enum(values(SHOPPING_CHANNELS))).default([]),
  collection_preferences: z
    .array(z.enum(values(COLLECTION_PREFERENCES)))
    .min(1, { error: "Choose at least one clothing type" }),
  other_details: z
    .object({
      fashion_styles: otherText,
      fabrics: otherText,
      shopping_channels: otherText,
      collection: otherText,
    })
    .default({}),
  feedback: z.string().trim().max(2000, { error: "Please keep feedback under 2,000 characters" }).default(""),
  full_name: z
    .string({ error: "Please enter your full name" })
    .trim()
    .min(2, { error: "Please enter your full name" })
    .max(120, { error: "Name is too long" }),
  mobile_number: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || normalizeMobile(v) !== null, {
      error: "Enter a valid Sri Lankan mobile number (e.g. 077 123 4567) or leave blank",
    })
    .default(""),
  // launch_updates_consent: z.boolean({ error: "Please choose Yes or No" }),
});

export type SurveyInput = z.input<typeof surveySchema>;
export type SurveyData = z.output<typeof surveySchema>;

/** Fields validated on each wizard step (index = step). Step 0 = designs. */
export const STEP_FIELDS: (keyof SurveyData)[][] = [
  ["designs"],
  ["designs"],
  ["fabric_preferences", "comfort_preferences", "preferred_fit", "clothing_size", "other_details"],
  ["collection_preferences", "shopping_channels", "feedback", "other_details"],
  ["full_name", "mobile_number",
    // "launch_updates_consent"
  ],
];

export type FieldErrors = Record<string, string>;

/** Flattens zod issues into { "path.to.field": "message" } (first message wins). */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

