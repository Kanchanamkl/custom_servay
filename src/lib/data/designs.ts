import "server-only";
import { randomUUID } from "node:crypto";
import { readJson, updateJson } from "./json-store";
import { seedDesigns } from "./seed-designs";
import type { ClothingDesign } from "./types";

const FILE = "designs.json";

const byOrder = (a: ClothingDesign, b: ClothingDesign) =>
  a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at);

export async function listDesigns(opts: { activeOnly?: boolean } = {}): Promise<ClothingDesign[]> {
  const all = await readJson(FILE, seedDesigns);
  return all.filter((d) => !opts.activeOnly || d.is_active).sort(byOrder);
}

export type DesignInput = Pick<
  ClothingDesign,
  "design_name" | "description" | "category" | "estimated_price_min" | "estimated_price_max" | "is_active" | "sort_order"
> & { image_url?: string | null };

export function createDesign(input: DesignInput): Promise<ClothingDesign> {
  return updateJson(FILE, seedDesigns, (designs) => {
    const now = new Date().toISOString();
    const design: ClothingDesign = {
      id: randomUUID(),
      ...input,
      image_url: input.image_url ?? null,
      created_at: now,
      updated_at: now,
    };
    return { data: [...designs, design], result: design };
  });
}

export function updateDesign(id: string, patch: Partial<DesignInput>): Promise<ClothingDesign | null> {
  return updateJson(FILE, seedDesigns, (designs) => {
    let updated: ClothingDesign | null = null;
    const data = designs.map((d) => {
      if (d.id !== id) return d;
      updated = { ...d, ...patch, updated_at: new Date().toISOString() };
      return updated;
    });
    return { data, result: updated };
  });
}

