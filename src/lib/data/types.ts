import type { Category } from "@/lib/survey/options";

/** A clothing design shown in the survey gallery (data/designs.json). */
export type ClothingDesign = {
  id: string;
  design_name: string;
  description: string | null;
  category: Category;
  image_url: string | null;
  estimated_price_min: number;
  estimated_price_max: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CustomizationPreferences = {
  sleeve?: string;
  neckline?: string;
  length?: string;
};

/** A design picked within a survey response (+ per-design preferences). */
export type SurveySelectedDesign = {
  clothing_design_id: string;
  /** Snapshot of the name/category at submission time (kept if a design is later edited). */
  design_name: string;
  category: Category;
  is_favorite: boolean;
  preferred_colors: string[];
  other_color: string | null;
  customization_preferences: CustomizationPreferences;
};

/** One completed survey (data/responses.json). */
export type SurveyResponse = {
  id: string;
  submission_id: string;
  full_name: string;
  mobile_number: string;
  fashion_styles: string[];
  fabric_preferences: string[];
  comfort_preferences: string[];
  preferred_fit: string | null;
  clothing_size: string | null;
  price_range: string | null;
  purchase_intention: string | null;
  shopping_channels: string[];
  collection_preferences: string[];
  other_details: Record<string, string>;
  feedback: string | null;
  // launch_updates_consent: boolean;
  selected_designs: SurveySelectedDesign[];
  created_at: string;
};

