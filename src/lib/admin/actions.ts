"use server";

import { revalidatePath } from "next/cache";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  isAdminAuthenticated,
  setAdminSession,
  clearAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-session";
import { createDesign, updateDesign, type DesignInput } from "@/lib/data/designs";
import { DATA_DIR } from "@/lib/data/json-store";
import type { Category } from "@/lib/survey/options";

export type AdminActionResult = {
  ok: boolean;
  error?: string;
};

// 1. Authentication
export async function loginAction(formData: FormData): Promise<AdminActionResult> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const valid = await verifyAdminCredentials(username, password);
  if (!valid) {
    return { ok: false, error: "Invalid username or password" };
  }

  await setAdminSession();
  revalidatePath("/admin-pannel");
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  revalidatePath("/admin-pannel");
}

// 2. Design Image Upload
export async function uploadDesignImageAction(formData: FormData): Promise<{ ok: boolean; url?: string; error?: string }> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { ok: false, error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { ok: false, error: "No image file provided" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: "Image size must be under 5MB" };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return { ok: false, error: "Only JPG, PNG, and WebP images are allowed" };
  }

  const ext = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
  const filename = `design-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
  const uploadDir = path.join(DATA_DIR, "uploads");

  await fs.mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  const publicUrl = `/api/uploads/${filename}`;
  return { ok: true, url: publicUrl };
}

// 3. Design Management
export async function createDesignAction(data: {
  design_name: string;
  description?: string;
  category: Category;
  image_url?: string;
  estimated_price_min: number;
  estimated_price_max: number;
  is_active?: boolean;
  sort_order?: number;
}): Promise<AdminActionResult> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { ok: false, error: "Unauthorized" };

  if (!data.design_name || data.design_name.trim().length === 0) {
    return { ok: false, error: "Design name is required" };
  }

  if (data.estimated_price_min < 0 || data.estimated_price_max < data.estimated_price_min) {
    return { ok: false, error: "Please enter a valid price range" };
  }

  const input: DesignInput = {
    design_name: data.design_name.trim(),
    description: data.description?.trim() || null,
    category: data.category,
    image_url: data.image_url?.trim() || null,
    estimated_price_min: data.estimated_price_min,
    estimated_price_max: data.estimated_price_max,
    is_active: data.is_active ?? true,
    sort_order: data.sort_order ?? 100,
  };

  await createDesign(input);
  revalidatePath("/");
  revalidatePath("/admin-pannel");
  return { ok: true };
}

export async function updateDesignAction(
  id: string,
  patch: Partial<DesignInput>,
): Promise<AdminActionResult> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { ok: false, error: "Unauthorized" };

  if (patch.estimated_price_min !== undefined && patch.estimated_price_max !== undefined) {
    if (patch.estimated_price_min < 0 || patch.estimated_price_max < patch.estimated_price_min) {
      return { ok: false, error: "Invalid price range" };
    }
  }

  const updated = await updateDesign(id, patch);
  if (!updated) return { ok: false, error: "Design not found" };

  revalidatePath("/");
  revalidatePath("/admin-pannel");
  return { ok: true };
}

export async function toggleDesignActiveAction(id: string, is_active: boolean): Promise<AdminActionResult> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return { ok: false, error: "Unauthorized" };

  const updated = await updateDesign(id, { is_active });
  if (!updated) return { ok: false, error: "Design not found" };

  revalidatePath("/");
  revalidatePath("/admin-pannel");
  return { ok: true };
}

