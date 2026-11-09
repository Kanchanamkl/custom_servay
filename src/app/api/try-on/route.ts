import { NextResponse } from "next/server";

/**
 * Optional virtual try-on API stub.
 *
 * Currently returns 501 Not Implemented because no AI try-on provider is
 * configured.
 *
 * To integrate a real provider later:
 * 1. Read API keys from process.env (never in frontend code).
 * 2. Validate participant consent in the request body.
 * 3. Verify rate limits.
 * 4. Call your provider (e.g. Fashn.ai, Replicate, or a custom model)
 *    and stream/return the resulting image.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "AI virtual try-on is not configured yet. The survey includes an on-device preview placeholder instead.",
    },
    { status: 501 },
  );
}

