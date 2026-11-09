import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { DATA_DIR } from "@/lib/data/json-store";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/**
 * Serves design images uploaded via /admin-pannel.
 * Files live in <DATA_DIR>/uploads/<filename>.
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ file: string }> },
) {
  const { file } = await context.params;
  const safe = path.basename(file);
  if (safe !== file) return new NextResponse("Invalid file", { status: 400 });

  const fullPath = path.join(DATA_DIR, "uploads", safe);
  try {
    const data = await fs.readFile(fullPath);
    const ext = path.extname(safe).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return new NextResponse("Not Found", { status: 404 });
    }
    return new NextResponse("Error reading file", { status: 500 });
  }
}

