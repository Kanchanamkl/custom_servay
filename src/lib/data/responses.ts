import "server-only";
import { randomUUID } from "node:crypto";
import { normalizeMobile, type SurveyData } from "@/lib/survey/schema";
import { readJson, updateJson } from "./json-store";
import { listDesigns } from "./designs";
import type { SurveyResponse } from "./types";

const FILE = "responses.json";
const empty = (): SurveyResponse[] => [];

/** All responses, newest first. */
export async function listResponses(): Promise<SurveyResponse[]> {
  const all = await readJson(FILE, empty);
  return [...all].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export class SubmissionError extends Error {}

/**
 * Stores a validated survey. Idempotent on submission_id: retries or double
 * submits return the original response instead of creating a duplicate.
 */
export async function addResponse(input: SurveyData): Promise<{ id: string; duplicate: boolean }> {
  const activeDesigns = new Map((await listDesigns({ activeOnly: true })).map((d) => [d.id, d]));

  const mobile = normalizeMobile(input.mobile_number);
  if (!mobile) throw new SubmissionError("Invalid mobile number");

  const seen = new Set<string>();
  const selected = input.designs.filter((d) => !seen.has(d.design_id) && seen.add(d.design_id));
  for (const d of selected) {
    if (!activeDesigns.has(d.design_id)) {
      throw new SubmissionError("One or more selected designs are no longer available. Please refresh and try again.");
    }
  }

  const clean = (v?: string) => (v && v.trim() ? v.trim() : undefined);
  const otherDetails = Object.fromEntries(
    Object.entries(input.other_details).filter((e): e is [string, string] => !!clean(e[1])),
  );

  return updateJson<SurveyResponse[], { id: string; duplicate: boolean }>(
    FILE,
    empty,
    (responses) => {
    const existing = responses.find((r) => r.submission_id === input.submission_id);
    if (existing) return { data: responses, result: { id: existing.id, duplicate: true } };

    const response: SurveyResponse = {
      id: randomUUID(),
      submission_id: input.submission_id,
      full_name: input.full_name.trim(),
      mobile_number: mobile,
      fashion_styles: input.fashion_styles,
      fabric_preferences: input.fabric_preferences,
      comfort_preferences: input.comfort_preferences,
      preferred_fit: input.preferred_fit,
      clothing_size: input.clothing_size,
      price_range: input.price_range,
      purchase_intention: input.purchase_intention,
      shopping_channels: input.shopping_channels,
      collection_preferences: input.collection_preferences,
      other_details: otherDetails,
      feedback: clean(input.feedback) ?? null,
      launch_updates_consent: input.launch_updates_consent,
      selected_designs: selected.map((d) => {
        const design = activeDesigns.get(d.design_id)!;
        return {
          clothing_design_id: d.design_id,
          design_name: design.design_name,
          category: design.category,
          is_favorite: d.is_favorite,
          preferred_colors: d.colors,
          other_color: d.colors.includes("other") ? (clean(d.other_color) ?? null) : null,
          customization_preferences: Object.fromEntries(
            Object.entries(d.customization).filter(([, v]) => !!v),
          ),
        };
      }),
      created_at: new Date().toISOString(),
    };
    return { data: [...responses, response], result: { id: response.id, duplicate: false } };
  });
}

