"use server";

import { randomUUID } from "node:crypto";
import { addResponse, SubmissionError } from "@/lib/data/responses";
import { surveySchema, toFieldErrors, type FieldErrors } from "./schema";

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: FieldErrors };

/**
 * Public survey submission. Validates on the server (never trust the client)
 * and stores the response. Safe to retry: duplicates are ignored by submission_id.
 */
export async function submitSurvey(input: unknown, honeypot?: string): Promise<SubmitResult> {
  // Bots tend to fill every field; humans never see this one.
  if (honeypot && honeypot.trim() !== "") return { ok: true };

  const parsed = surveySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Some answers need your attention.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    await addResponse(parsed.data);
    return { ok: true };
  } catch (err) {
    if (err instanceof SubmissionError) return { ok: false, error: err.message };
    const ref = randomUUID().slice(0, 8);
    console.error(`[survey] failed to save submission (ref ${ref})`, err);
    return { ok: false, error: `We couldn't save your answers. Please try again. (ref ${ref})` };
  }
}

